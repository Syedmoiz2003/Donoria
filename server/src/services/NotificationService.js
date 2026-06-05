import twilio from 'twilio';
import emailjs from '@emailjs/nodejs';
import config from '../config/index.js';

export class NotificationService {
  static twilioClient = null;

  static initializeEmailJS() {
    if (!config.emailjs.serviceId || !config.emailjs.templateId || !config.emailjs.publicKey || !config.emailjs.privateKey) {
      console.log('EmailJS not fully configured (missing serviceId, templateId, publicKey, or privateKey)');
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
        return false;
      }

      // Parameters mapped to your EmailJS Template
      const templateParams = {
        to_email: to,
        subject: subject,
        html_content: html,
        text_content: text || html.replace(/<[^>]*>/g, ''),
        app_name: 'Donoria'
      };

      const response = await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.templateId,
        templateParams,
        {
          publicKey: config.emailjs.publicKey,
          privateKey: config.emailjs.privateKey,
        }
      );

      console.log(`Email sent successfully to ${to}:`, response.status);
      return true;
    } catch (error) {
      console.error(`Email error for ${to}:`, error);
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
    const isOrgan = request.request_type === 'organ';

    const subject = isOrgan 
      ? `🚨 Urgent Organ Donation Request: ${request.organ_type} needed at ${hospital?.hospital_name}`
      : `🆘 Action Needed: ${request.blood_group}${request.rh_factor} Blood Donation Request`;

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #e11d48; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Donation Opportunity</h1>
        </div>
        <div style="padding: 32px; background-color: white;">
          <p style="font-size: 18px; color: #1e293b; margin-bottom: 24px;">Dear <strong>${user.full_name}</strong>,</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            A new <strong>${request.request_type}</strong> donation request has been posted that matches your profile. Because you are currently eligible to donate, your help is desperately needed.
          </p>
          
          <div style="background-color: #f8fafc; padding: 24px; border-radius: 8px; margin: 32px 0; border-left: 4px solid #e11d48;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">TYPE:</td>
                <td style="padding: 8px 0; color: #1e293b; text-transform: uppercase;">${request.request_type}</td>
              </tr>
              ${!isOrgan ? `
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">BLOOD GROUP:</td>
                <td style="padding: 8px 0; color: #e11d48; font-weight: bold;">${request.blood_group}${request.rh_factor}</td>
              </tr>
              ` : `
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">ORGAN:</td>
                <td style="padding: 8px 0; color: #e11d48; font-weight: bold;">${request.organ_type}</td>
              </tr>
              `}
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">URGENCY:</td>
                <td style="padding: 8px 0; color: #e11d48; font-weight: bold; text-transform: uppercase;">${request.urgency_level}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">HOSPITAL:</td>
                <td style="padding: 8px 0; color: #1e293b;">${hospital?.hospital_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">LOCATION:</td>
                <td style="padding: 8px 0; color: #1e293b;">${hospital?.city}, ${hospital?.state}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">DEADLINE:</td>
                <td style="padding: 8px 0; color: #1e293b;">${new Date(request.deadline).toLocaleString()}</td>
              </tr>
            </table>
          </div>

          ${request.description ? `
          <div style="margin-bottom: 32px;">
            <p style="color: #64748b; font-size: 14px; margin-bottom: 8px; font-weight: 600;">HOSPITAL MESSAGE:</p>
            <p style="color: #475569; font-style: italic; background-color: #fffbeb; padding: 16px; border-radius: 8px; border: 1px solid #fef3c7;">"${request.description}"</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/donor/request/${request.id}/respond" 
               style="background-color: #e11d48; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; display: inline-block;">
              I AM READY TO HELP
            </a>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0 0 8px 0;">Donoria - Connecting Life Through Donation</p>
          <p style="margin: 0;">This email was sent to your registered Gmail address: ${user.email}</p>
        </div>
      </div>
    `;

    const smsMessage = isOrgan 
      ? `LIFE-LINK: Urgent ${request.organ_type} request at ${hospital?.hospital_name}. You are in the 20km radius and eligible to help! Respond here: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/donor/request/${request.id}/respond`
      : `LIFE-LINK: Urgent ${request.blood_group}${request.rh_factor} blood needed at ${hospital?.hospital_name}. You are nearby and eligible! Respond: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/donor/request/${request.id}/respond`;

    const results = {};

    if (channels.includes('email') && user.email) {
      results.email = await this.sendEmail(user.email, subject, html);
    }

    if (channels.includes('sms') && user.phone) {
      results.sms = await this.sendSMS(user.phone, smsMessage);
    }

    if (channels.includes('push')) {
      results.push = await this.sendPushNotification(donor.id, {
        title: subject,
        body: `You are eligible to respond to this ${request.request_type} request`,
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
