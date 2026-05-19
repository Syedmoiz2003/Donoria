import express from 'express';
import { Donor } from '../models/Donor.js';
import { DonationRequest } from '../models/DonationRequest.js';
import { DonorResponse } from '../models/DonorResponse.js';
import { AIChatbot } from '../services/AIChatbot.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { donorProfileValidation, donorResponseValidation, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

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
    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }
    res.json(donor);
  } catch (error) {
    next(error);
  }
});

router.post('/me', authenticate, authorize('donor'), donorProfileValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const existingDonor = await Donor.findByUserId(req.user.id);
    
    let donor;
    if (existingDonor) {
      donor = await Donor.update(existingDonor.id, req.body);
    } else {
      donor = await Donor.create({ user_id: req.user.id, ...req.body });
    }

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
    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

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
    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

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
    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

    const eligibility = await Donor.checkEligibility(donor.id);
    res.json(eligibility);
  } catch (error) {
    next(error);
  }
});

router.get('/requests', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

    const filters = req.query;
    const requests = await DonationRequest.list(filters);
    
    const compatibleRequests = requests.filter(request => {
      if (request.request_type === 'blood') {
        const compatible = Donor.getCompatibleBloodGroups(donor.blood_group, donor.rh_factor);
        return compatible.bloodGroups.includes(request.blood_group) && 
               (request.rh_factor === donor.rh_factor || compatible.rhFactors?.includes(request.rh_factor));
      }
      return donor.organ_donor_consent;
    });

    res.json(compatibleRequests);
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

    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
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

router.post('/responses', authenticate, authorize('donor'), donorResponseValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

    const eligibility = await Donor.checkEligibility(donor.id);
    if (!eligibility.eligible) {
      return res.status(400).json({ error: 'Not eligible to donate', reason: eligibility.reason });
    }

    const request = await DonationRequest.findById(req.body.request_id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const existingResponse = await DonorResponse.list({
      donor_id: donor.id,
      request_id: req.body.request_id,
    });

    if (existingResponse.length > 0) {
      return res.status(400).json({ error: 'Already responded to this request' });
    }

    const compatibilityScore = Donor.getBloodCompatibilityScore(
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
    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

    const responses = await Donor.getResponses(donor.id);
    res.json(responses);
  } catch (error) {
    next(error);
  }
});

router.get('/responses/:id', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

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
    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

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
    const donor = await Donor.findByUserId(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found' });
    }

    const history = await Donor.getDonationHistory(donor.id);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

router.post('/chat', authenticate, authorize('donor'), async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;
    const donor = await Donor.findByUserId(req.user.id);

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
