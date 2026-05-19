import { supabase } from '../config/database.js';

export class Donor {
  static async create(donorData) {
    const { data, error } = await supabase
      .from('donors')
      .insert([{
        user_id: donorData.user_id,
        blood_group: donorData.blood_group,
        rh_factor: donorData.rh_factor,
        date_of_birth: donorData.date_of_birth,
        gender: donorData.gender,
        weight: donorData.weight,
        height: donorData.height,
        organ_donor_consent: donorData.organ_donor_consent || false,
        last_donation_date: donorData.last_donation_date,
        medical_history: donorData.medical_history || [],
        is_available: true,
        address: donorData.address,
        city: donorData.city,
        state: donorData.state,
        zip_code: donorData.zip_code,
        latitude: donorData.latitude,
        longitude: donorData.longitude,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('donors')
      .select('*, users(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('donors')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async setAvailability(id, isAvailable) {
    const { data, error } = await supabase
      .from('donors')
      .update({
        is_available: isAvailable,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async list(filters = {}) {
    let query = supabase.from('donors').select('*, users(*)');

    if (filters.blood_group) {
      query = query.eq('blood_group', filters.blood_group);
    }

    if (filters.rh_factor) {
      query = query.eq('rh_factor', filters.rh_factor);
    }

    if (filters.is_available !== undefined) {
      query = query.eq('is_available', filters.is_available);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.organ_donor_consent !== undefined) {
      query = query.eq('organ_donor_consent', filters.organ_donor_consent);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findCompatibleDonors(bloodGroup, rhFactor, city = null) {
    const compatibleBloodGroups = this.getCompatibleBloodGroups(bloodGroup, rhFactor);
    
    let query = supabase
      .from('donors')
      .select('*, users(*)')
      .in('blood_group', compatibleBloodGroups.bloodGroups)
      .eq('is_available', true);

    if (compatibleBloodGroups.rhFactors) {
      query = query.in('rh_factor', compatibleBloodGroups.rhFactors);
    }

    if (city) {
      query = query.eq('city', city);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static getCompatibleBloodGroups(bloodGroup, rhFactor) {
    const compatibility = {
      'A+': { bloodGroups: ['A', 'O'], rhFactors: ['+', '-'] },
      'A-': { bloodGroups: ['A', 'O'], rhFactors: ['-'] },
      'B+': { bloodGroups: ['B', 'O'], rhFactors: ['+', '-'] },
      'B-': { bloodGroups: ['B', 'O'], rhFactors: ['-'] },
      'AB+': { bloodGroups: ['A', 'B', 'AB', 'O'], rhFactors: ['+', '-'] },
      'AB-': { bloodGroups: ['A', 'B', 'AB', 'O'], rhFactors: ['-'] },
      'O+': { bloodGroups: ['O'], rhFactors: ['+', '-'] },
      'O-': { bloodGroups: ['O'], rhFactors: ['-'] },
    };

    return compatibility[`${bloodGroup}${rhFactor}`] || { bloodGroups: [bloodGroup], rhFactors: [rhFactor] };
  }

  static async getDonationHistory(donorId) {
    const { data, error } = await supabase
      .from('donor_responses')
      .select('*, donation_requests(*, hospitals(*))')
      .eq('donor_id', donorId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getResponses(donorId) {
    const { data, error } = await supabase
      .from('donor_responses')
      .select('*, donation_requests(*, hospitals(*, users(*)))')
      .eq('donor_id', donorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async updateLastDonationDate(donorId) {
    const { data, error } = await supabase
      .from('donors')
      .update({
        last_donation_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', donorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async checkEligibility(donorId) {
    const donor = await this.findById(donorId);
    
    if (!donor) {
      return { eligible: false, reason: 'Donor not found' };
    }

    if (!donor.is_available) {
      return { eligible: false, reason: 'Donor is not available' };
    }

    if (donor.last_donation_date) {
      const lastDonation = new Date(donor.last_donation_date);
      const today = new Date();
      const daysSinceDonation = Math.floor((today - lastDonation) / (1000 * 60 * 60 * 24));
      
      if (daysSinceDonation < 56) {
        return { eligible: false, reason: 'Must wait 56 days between donations' };
      }
    }

    const age = this.calculateAge(donor.date_of_birth);
    if (age < 18 || age > 65) {
      return { eligible: false, reason: 'Age must be between 18 and 65' };
    }

    if (donor.weight < 50) {
      return { eligible: false, reason: 'Weight must be at least 50kg' };
    }

    return { eligible: true, donor };
  }

  static calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

export default Donor;
