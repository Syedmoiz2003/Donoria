import express from 'express';
import { DonorResponse } from '../models/DonorResponse.js';
import { Donor } from '../models/Donor.js';
import { Hospital } from '../models/Hospital.js';
import { DonationRequest } from '../models/DonationRequest.js';
import { NotificationService } from '../services/NotificationService.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const filters = req.query;
    const responses = await DonorResponse.list(filters);
    res.json(responses);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const response = await DonorResponse.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    if (req.user.role === 'donor') {
      const donor = await Donor.findByUserId(req.user.id);
      if (response.donor_id !== donor.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (req.user.role === 'hospital') {
      const hospital = await Hospital.findByUserId(req.user.id);
      const request = await DonationRequest.findById(response.request_id);
      if (request.hospital_id !== hospital.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/accept', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    const response = await DonorResponse.findById(req.params.id);
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    const request = await DonationRequest.findById(response.request_id);
    if (request.hospital_id !== hospital.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (response.status !== 'pending') {
      return res.status(400).json({ error: 'Response is not in pending status' });
    }

    await DonorResponse.acceptResponse(req.params.id);
    // Re-fetch with full joins for notification
    const updated = await DonorResponse.findById(req.params.id);
    await NotificationService.sendResponseAcceptedNotification(updated);
    
    res.json({
      message: 'Response accepted successfully',
      response: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/complete', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    const response = await DonorResponse.findById(req.params.id);
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    const request = await DonationRequest.findById(response.request_id);
    if (request.hospital_id !== hospital.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (response.status !== 'accepted') {
      return res.status(400).json({ error: 'Response must be accepted before completing' });
    }

    await DonorResponse.completeResponse(req.params.id);
    // Re-fetch with full joins for notification (completeResponse only returns flat data)
    const updated = await DonorResponse.findById(req.params.id);
    await NotificationService.sendResponseCompletedNotification(updated);
    await Donor.updateLastDonationDate(response.donor_id);
    
    res.json({
      message: 'Donation completed successfully',
      response: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/reject', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    const response = await DonorResponse.findById(req.params.id);
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    const request = await DonationRequest.findById(response.request_id);
    if (request.hospital_id !== hospital.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (response.status !== 'pending') {
      return res.status(400).json({ error: 'Response is not in pending status' });
    }

    const updated = await DonorResponse.rejectResponse(req.params.id);
    
    res.json({
      message: 'Response rejected successfully',
      response: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
