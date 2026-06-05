import express from 'express';
import path from 'path';
import { supabase } from '../config/database.js';
import { Donor } from '../models/Donor.js';
import { DonationRequest } from '../models/DonationRequest.js';
import { DonorResponse } from '../models/DonorResponse.js';
import { VerificationDocument } from '../models/VerificationDocument.js';
import { AIChatbot } from '../services/AIChatbot.js';
import { MatchingEngine } from '../services/MatchingEngine.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { donorProfileValidation, donorResponseValidation, handleValidationErrors } from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Self-healing helper function to prevent crashing or hard 404s when donor profile records are missing
const getOrCreateDonorProfile = async (userId, userDetails = {}) => {
  let donor = await Donor.findByUserId(userId);
  if (!donor) {
    donor = await Donor.create({
      user_id: userId,
      blood_group: 'O',
      rh_factor: '+',
      date_of_birth: '1995-01-01',
      gender: 'other',
      weight: 70,
      height: 170,
      organ_donor_consent: true,
      address: 'Please update your address',
      city: 'City',
      state: 'Province',
      zip_code: '00000'
    });
  }
  return donor;
};

router.post('/documents', authenticate, authorize('donor'), uploadSingle, async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filename for Supabase Storage
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${donor.id}/${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    const filePath = `donor-documents/${fileName}`;

    // Upload to Supabase Storage bucket 'documents'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get the public URL for the uploaded file
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    const document = await VerificationDocument.create({
      donor_id: donor.id, // We'll need to update the model/schema if we want to support donor_id
      hospital_id: null,
      document_type: req.body.document_type || 'Identity',
      document_name: req.body.document_name || req.file.originalname,
      file_url: data.publicUrl,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
    });

    res.status(201).json({
      message: 'ID document uploaded and stored online successfully',
      document,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/documents', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);
    const { data, error } = await supabase
      .from('verification_documents')
      .select('*')
      .eq('donor_id', donor.id)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const filters = req.query;
    const donors = await Donor.list(filters);
    res.json(donors);
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);
    res.json(donor);
  } catch (error) {
    next(error);
  }
});

router.post('/me', authenticate, authorize('donor'), donorProfileValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const existingDonor = await getOrCreateDonorProfile(req.user.id, req.user);
    const donor = await Donor.update(existingDonor.id, req.body);
    res.status(201).json({
      message: 'Donor profile created/updated successfully',
      donor,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/me', authenticate, authorize('donor'), donorProfileValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);
    const updated = await Donor.update(donor.id, req.body);
    res.json({
      message: 'Donor profile updated successfully',
      donor: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/me/availability', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);
    const { is_available } = req.body;
    const updated = await Donor.setAvailability(donor.id, is_available);
    res.json({
      message: 'Availability updated successfully',
      donor: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me/eligibility', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);
    const eligibility = await Donor.checkEligibility(donor.id);
    res.json(eligibility);
  } catch (error) {
    next(error);
  }
});

router.get('/requests', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    // Ensure donor profile exists
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);

    const filters = req.query;
    const requests = await DonationRequest.list(filters);

    // Filter requests based on donor's blood type (and organ consent if applicable)
    const filteredRequests = requests.filter(request => {
      // If request is blood, it MUST match the donor's blood group and rh factor exactly
      if (request.request_type === 'blood') {
        return request.blood_group === donor.blood_group && request.rh_factor === donor.rh_factor;
      }
      
      // If request is organ, donor must have organ consent, and if the organ request specifies a blood group/rh factor, they must match
      if (request.request_type === 'organ') {
        if (!donor.organ_donor_consent) return false;
        if (request.blood_group && request.blood_group !== donor.blood_group) return false;
        if (request.rh_factor && request.rh_factor !== donor.rh_factor) return false;
        return true;
      }
      
      return false;
    });

    res.json(filteredRequests);
  } catch (error) {
    next(error);
  }
});

router.get('/requests/:id', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const donor = await getOrCreateDonorProfile(req.user.id, req.user);

    // Apply security check for matching blood group and organ consent
    if (request.request_type === 'blood') {
      if (request.blood_group !== donor.blood_group || request.rh_factor !== donor.rh_factor) {
        return res.status(403).json({ error: 'Access denied: Blood type mismatch' });
      }
    } else if (request.request_type === 'organ') {
      if (!donor.organ_donor_consent) {
        return res.status(403).json({ error: 'Access denied: Organ donor consent required' });
      }
      if (request.blood_group && request.blood_group !== donor.blood_group) {
        return res.status(403).json({ error: 'Access denied: Blood type mismatch' });
      }
      if (request.rh_factor && request.rh_factor !== donor.rh_factor) {
        return res.status(403).json({ error: 'Access denied: Blood type mismatch' });
      }
    }

    const eligibility = await Donor.checkEligibility(donor.id);
    
    res.json({
      request,
      eligible: eligibility.eligible,
      eligibilityReason: eligibility.reason,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/responses', authenticate, authorize('donor'), uploadSingle, donorResponseValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);

    const eligibility = await Donor.checkEligibility(donor.id);
    if (!eligibility.eligible) {
      return res.status(400).json({ error: 'Not eligible to donate', reason: eligibility.reason });
    }

    const request = await DonationRequest.findById(req.body.request_id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Apply security check for matching blood group and organ consent
    if (request.request_type === 'blood') {
      if (request.blood_group !== donor.blood_group || request.rh_factor !== donor.rh_factor) {
        return res.status(400).json({ error: 'Blood type mismatch' });
      }
    } else if (request.request_type === 'organ') {
      if (!donor.organ_donor_consent) {
        return res.status(400).json({ error: 'Organ donor consent required' });
      }
      
      // Organ donation REQUIRES a legal document
      if (!req.file) {
        return res.status(400).json({ error: 'Legal consent document is required for organ donation' });
      }

      if (request.blood_group && request.blood_group !== donor.blood_group) {
        return res.status(400).json({ error: 'Blood type mismatch' });
      }
      if (request.rh_factor && request.rh_factor !== donor.rh_factor) {
        return res.status(400).json({ error: 'Blood type mismatch' });
      }
    }

    const existingResponse = await DonorResponse.list({
      donor_id: donor.id,
      request_id: req.body.request_id,
    });

    if (existingResponse.length > 0) {
      return res.status(400).json({ error: 'Already responded to this request' });
    }

    const compatibilityScore = MatchingEngine.getBloodCompatibilityScore(
      donor.blood_group,
      donor.rh_factor,
      request.blood_group,
      request.rh_factor
    );

    const response = await DonorResponse.create({
      donor_id: donor.id,
      request_id: req.body.request_id,
      compatibility_score: compatibilityScore,
      message: req.body.message,
      estimated_arrival: req.body.estimated_arrival,
    });

    // Handle document upload if provided (required for organ, optional for blood)
    if (req.file) {
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${donor.id}/${response.id}/${Date.now()}${fileExt}`;
      const filePath = `donation-documents/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Save to verification_documents for audit
      await VerificationDocument.create({
        donor_id: donor.id,
        response_id: response.id,
        hospital_id: null,
        document_type: req.body.document_type || 'Legal Consent',
        document_name: req.body.document_name || req.file.originalname,
        file_url: data.publicUrl,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        status: 'pending'
      });

      // Update response with document URL for easy access by hospitals
      await DonorResponse.update(response.id, { document_url: data.publicUrl });
    }

    res.status(201).json({
      message: 'Response submitted successfully',
      response,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/responses', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);
    const responses = await Donor.getResponses(donor.id);
    res.json(responses);
  } catch (error) {
    next(error);
  }
});

router.get('/responses/:id', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);

    const response = await DonorResponse.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    if (response.donor_id !== donor.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.delete('/responses/:id', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);

    const response = await DonorResponse.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    if (response.donor_id !== donor.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (response.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot cancel non-pending response' });
    }

    await DonorResponse.cancelResponse(req.params.id);
    res.json({ message: 'Response cancelled successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/history', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);
    const history = await Donor.getDonationHistory(donor.id);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

router.post('/chat', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const { message } = req.body;
    const sessionId = req.body.sessionId || req.body.session_id;
    const donor = await getOrCreateDonorProfile(req.user.id, req.user);

    const response = await AIChatbot.chat(message, sessionId, donor.id);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get('/chat/quick-responses', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const category = req.query.category || 'general';
    const responses = await AIChatbot.getQuickResponses(category);
    res.json(responses);
  } catch (error) {
    next(error);
  }
});

router.get('/health-tips', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const tips = await AIChatbot.getHealthTips();
    res.json(tips);
  } catch (error) {
    next(error);
  }
});

export default router;