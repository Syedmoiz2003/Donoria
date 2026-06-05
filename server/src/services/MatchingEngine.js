import { Donor } from '../models/Donor.js';
import { DonationRequest } from '../models/DonationRequest.js';
import { NotificationService } from './NotificationService.js';
import config from '../config/index.js';
import { supabase } from '../config/database.js';

export class MatchingEngine {
  static async findMatchingDonors(requestId) {
    const request = await DonationRequest.findById(requestId);
    
    if (!request) {
      throw new Error('Donation request not found');
    }

    if (request.request_type === 'blood') {
      return await this.findBloodDonors(request);
    } else if (request.request_type === 'organ') {
      return await this.findOrganDonors(request);
    }

    return [];
  }

  static async findBloodDonors(request) {
    const hospital = request.hospitals;
    const city = hospital?.city;

    const donors = await Donor.findCompatibleDonors(
      request.blood_group,
      request.rh_factor,
      city
    );

    const scoredDonors = donors.map(donor => {
      const distance = (donor.latitude && donor.longitude && hospital.latitude && hospital.longitude)
        ? this.calculateDistance(donor.latitude, donor.longitude, hospital.latitude, hospital.longitude)
        : null;
      
      const score = this.calculateBloodMatchScore(donor, request, hospital);
      return { ...donor, matchScore: score, distance };
    });

    // Filter by 20km radius if coordinates are available
    const filteredDonors = scoredDonors.filter(donor => {
      if (donor.distance === null) return true; // Include if distance can't be calculated
      return donor.distance <= 20;
    });

    filteredDonors.sort((a, b) => b.matchScore - a.matchScore);

    return filteredDonors.slice(0, 20);
  }

  static async findOrganDonors(request) {
    const hospital = request.hospitals;

    const { data, error } = await supabase
      .from('donors')
      .select('*, users(*)')
      .eq('organ_donor_consent', true)
      .eq('is_available', true);

    if (error) throw error;

    const scoredDonors = data.map(donor => {
      const distance = (donor.latitude && donor.longitude && hospital.latitude && hospital.longitude)
        ? this.calculateDistance(donor.latitude, donor.longitude, hospital.latitude, hospital.longitude)
        : null;

      const score = this.calculateOrganMatchScore(donor, request, hospital);
      return { ...donor, matchScore: score, distance };
    });

    // Filter by 20km radius if coordinates are available
    const filteredDonors = scoredDonors.filter(donor => {
      if (donor.distance === null) return true;
      return donor.distance <= 20;
    });

    filteredDonors.sort((a, b) => b.matchScore - a.matchScore);

    return filteredDonors.slice(0, 20);
  }

  static calculateBloodMatchScore(donor, request, hospital) {
    let score = 0;

    const bloodCompatibility = this.getBloodCompatibilityScore(
      donor.blood_group,
      donor.rh_factor,
      request.blood_group,
      request.rh_factor
    );
    score += bloodCompatibility * 40;

    const urgencyBonus = this.getUrgencyBonus(request.urgency_level);
    score += urgencyBonus;

    if (hospital && donor.city === hospital.city) {
      score += 20;
    }

    if (config.googleMaps.apiKey && donor.latitude && donor.longitude && hospital.latitude && hospital.longitude) {
      const distance = this.calculateDistance(
        donor.latitude, donor.longitude,
        hospital.latitude, hospital.longitude
      );
      if (distance < 10) score += 15;
      else if (distance < 25) score += 10;
      else if (distance < 50) score += 5;
    }

    if (donor.last_donation_date) {
      const daysSinceDonation = this.getDaysSince(donor.last_donation_date);
      if (daysSinceDonation > 90) {
        score += 15;
      } else if (daysSinceDonation > 60) {
        score += 10;
      }
    } else {
      score += 15;
    }

    const age = Donor.calculateAge(donor.date_of_birth);
    if (age >= 25 && age <= 45) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  static calculateOrganMatchScore(donor, request, hospital) {
    let score = 0;

    if (hospital && donor.city === hospital.city) {
      score += 30;
    }

    if (config.googleMaps.apiKey && donor.latitude && donor.longitude && hospital.latitude && hospital.longitude) {
      const distance = this.calculateDistance(
        donor.latitude, donor.longitude,
        hospital.latitude, hospital.longitude
      );
      if (distance < 10) score += 20;
      else if (distance < 25) score += 15;
      else if (distance < 50) score += 10;
    }

    const urgencyBonus = this.getUrgencyBonus(request.urgency_level);
    score += urgencyBonus;

    const age = Donor.calculateAge(donor.date_of_birth);
    if (age >= 18 && age <= 55) {
      score += 20;
    }

    if (donor.medical_history && donor.medical_history.length === 0) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  static getBloodCompatibilityScore(donorBG, donorRH, requestBG, requestRH) {
    if (donorBG === requestBG && donorRH === requestRH) {
      return 100;
    }

    const compatibility = {
      'O-': { canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      'O+': { canDonateTo: ['A+', 'B+', 'AB+', 'O+'] },
      'A-': { canDonateTo: ['A+', 'A-', 'AB+', 'AB-'] },
      'A+': { canDonateTo: ['A+', 'AB+'] },
      'B-': { canDonateTo: ['B+', 'B-', 'AB+', 'AB-'] },
      'B+': { canDonateTo: ['B+', 'AB+'] },
      'AB-': { canDonateTo: ['AB+', 'AB-'] },
      'AB+': { canDonateTo: ['AB+'] },
    };

    const donorType = `${donorBG}${donorRH}`;
    const requestType = `${requestBG}${requestRH}`;

    if (compatibility[donorType]?.canDonateTo.includes(requestType)) {
      return 80;
    }

    return 0;
  }

  static getUrgencyBonus(urgencyLevel) {
    const bonuses = {
      'critical': 25,
      'high': 20,
      'medium': 15,
      'low': 10,
    };
    return bonuses[urgencyLevel] || 10;
  }

  static getDaysSince(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now - date) / (1000 * 60 * 60 * 24));
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static async notifyMatchedDonors(requestId) {
    const matchedDonors = await this.findMatchingDonors(requestId);
    const request = await DonationRequest.findById(requestId);

    const notifiedDonors = [];

    for (const donor of matchedDonors) {
      // CRITICAL: Check eligibility before sending email
      const eligibility = await Donor.checkEligibility(donor.id);
      
      if (eligibility.eligible) {
        await NotificationService.sendDonationRequestNotification(donor, request);
        notifiedDonors.push(donor);
      } else {
        console.log(`Donor ${donor.id} matched but is not eligible: ${eligibility.reason}`);
      }
    }

    return notifiedDonors;
  }

  static async autoMatchRequest(requestId) {
    const matchedDonors = await this.notifyMatchedDonors(requestId);
    return {
      requestId,
      matchedCount: matchedDonors.length,
      donors: matchedDonors,
    };
  }
}

export default MatchingEngine;