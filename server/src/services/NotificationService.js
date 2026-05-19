import emailjs from '@emailjs/browser';
import twilio from 'twilio';
import config from '../config/index.js';

export class NotificationService {
  static twilioClient = null;

  static initializeEmailJS() {
    if (!config.emailjs.serviceId || !config.emailjs.templateId || !config.emailjs.publicKey) {
      console.log('EmailJS not configured');
      return false;
    }
    return true;
  }

  static initializeSMS() {
    if (!this.twilioClient && config.twilio.accountSid) {
      this.twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);
    }
  }

  static async sendEmail(to, subject, html, text) {
    try {
      if (!this.initializeEmailJS()) {
        console.log('EmailJS service not configured');
        return false;
      }

      const templateParams = {
        to_email: to,
        subject: subject,
        html_content: html,
        text_content: text,
      };

      const response = await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.templateId,
        templateParams,
        config.emailjs.publicKey
      );

      console.log('Email sent:', response.status);
      return true;
    } catch (error) {
      console.error('Email error:', error);
      return false;
    }
  }

  static async sendSMS(to, message) {
    try {
      this.initializeSMS();
      
      if (!this.twilioClient) {
        console.log('SMS service not configured');
        return false;
      }

      const response = await this.twilioClient.messages.create({
        body: message,
        from: config.twilio.phoneNumber,
        to,
      });

      console.log('SMS sent:', response.sid);
      return true;
    } catch (error) {
      console.error('SMS error:', error);
      return false;
    }
  }

  static determineChannels(urgencyLevel) {
    const channels = {
      'critical': ['email', 'sms', 'push'],
      'high': ['email', 'sms'],
      'medium': ['email', 'push'],
      'low': ['email'],
    };
    return channels[urgencyLevel] || ['email'];
  }

  static async sendDonationRequestNotification(donor, request) {
    const channels = this.determineChannels(request.urgency_level);
    const hospital = request.hospitals;
    const user = donor.users;

    const subject = `Urgent Blood Donation Request - ${request.urgency_level.toUpperCase()}`;
    const html = `
      <h2>Blood Donation Request</h2>
      <p>Dear ${user.full_name},</p>
      <p>There is an urgent blood donation request that matches your profile:</p>
      <ul>
        <li><strong>Blood Group:</strong> ${request.blood_group}${request.rh_factor}</li>
        <li><strong>Quantity:</strong> ${request.quantity} ${request.unit}</li>
        <li><strong>Urgency:</strong> ${request.urgency_level}</li>
        <li><strong>Deadline:</strong> ${new Date(request.deadline).toLocaleDateString()}</li>
        <li><strong>Hospital:</strong> ${hospital?.hospital_name}</li>
        <li><strong>Location:</strong> ${hospital?.city}, ${hospital?.state}</li>
      </ul>
      <p>${request.description || ''}</p>
      <p>Please log in to your account to respond to this request.</p>
      <p>Thank you for being a life saver!</p>
    `;

    const text = `
      Blood Donation Request
      Dear ${user.full_name},
      There is an urgent blood donation request that matches your profile.
      Blood Group: ${request.blood_group}${request.rh_factor}
      Quantity: ${request.quantity} ${request.unit}
      Urgency: ${request.urgency_level}
      Deadline: ${new Date(request.deadline).toLocaleDateString()}
      Hospital: ${hospital?.hospital_name}
      Location: ${hospital?.city}, ${hospital?.state}
      Please log in to your account to respond to this request.
    `;

    const smsMessage = `
      URGENT: Blood donation request for ${request.blood_group}${request.rh_factor} at ${hospital?.hospital_name}, ${hospital?.city}. Deadline: ${new Date(request.deadline).toLocaleDateString()}. Login to respond.
    `;

    const results = {};

    if (channels.includes('email') && user.email) {
      results.email = await this.sendEmail(user.email, subject, html, text);
    }

    if (channels.includes('sms') && user.phone) {
      results.sms = await this.sendSMS(user.phone, smsMessage);
    }

    if (channels.includes('push')) {
      results.push = await this.sendPushNotification(donor.id, {
        title: subject,
        body: `Urgent request for ${request.blood_group}${request.rh_factor} blood`,
        data: { requestId: request.id },
      });
    }

    return results;
  }

  static async sendResponseAcceptedNotification(response) {
    const donor = response.donors;
    const request = response.donation_requests;
    const hospital = request.hospitals;
    const user = donor.users;

    const subject = 'Your Donation Response Has Been Accepted';
    const html = `
      <h2>Response Accepted</h2>
      <p>Dear ${user.full_name},</p>
      <p>Great news! Your response to the blood donation request has been accepted.</p>
      <ul>
        <li><strong>Hospital:</strong> ${hospital?.hospital_name}</li>
        <li><strong>Address:</strong> ${hospital?.address}, ${hospital?.city}, ${hospital?.state}</li>
        <li><strong>Contact:</strong> ${hospital?.contact_person} - ${hospital?.emergency_contact}</li>
      </ul>
      <p>Please visit the hospital at your earliest convenience.</p>
      <p>Thank you for your generosity!</p>
    `;

    await this.sendEmail(user.email, subject, html);
  }

  static async sendResponseCompletedNotification(response) {
    const donor = response.donors;
    const user = donor.users;

    const subject = 'Thank You for Your Donation';
    const html = `
      <h2>Donation Completed</h2>
      <p>Dear ${user.full_name},</p>
      <p>Thank you for completing your blood donation. Your contribution has helped save lives.</p>
      <p>You can donate again after 56 days. We'll notify you when you're eligible.</p>
      <p>From the LifeLink team</p>
    `;

    await this.sendEmail(user.email, subject, html);
  }

  static async sendHospitalVerificationNotification(hospital, status) {
    const user = hospital.users;
    const subject = status === 'approved' 
      ? 'Hospital Verification Approved' 
      : 'Hospital Verification Rejected';

    const html = status === 'approved'
      ? `
        <h2>Verification Approved</h2>
        <p>Congratulations! Your hospital has been verified and can now post donation requests.</p>
      `
      : `
        <h2>Verification Rejected</h2>
        <p>Your hospital verification was not approved. Please review your documents and try again.</p>
      `;

    await this.sendEmail(user.email, subject, html);
  }

  static async sendPushNotification(userId, notification) {
    console.log(`Push notification to user ${userId}:`, notification);
    return true;
  }

  static async sendWelcomeEmail(user, role) {
    const subject = 'Welcome to LifeLink';
    const html = `
      <h2>Welcome to LifeLink</h2>
      <p>Dear ${user.full_name},</p>
      <p>Thank you for joining LifeLink as a ${role}.</p>
      <p>Your account has been successfully created.</p>
      <p>Please complete your profile to get started.</p>
      <p>Best regards,<br>LifeLink Team</p>
    `;

    await this.sendEmail(user.email, subject, html);
  }
}

export default NotificationService;
