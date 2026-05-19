import express from 'express';
import { DonationRequest } from '../models/DonationRequest.js';
import { DonorResponse } from '../models/DonorResponse.js';
import { MatchingEngine } from '../services/MatchingEngine.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const filters = req.query;
    const requests = await DonationRequest.list(filters);
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

router.get('/active', optionalAuth, async (req, res, next) => {
  try {
    const requests = await DonationRequest.getActiveRequests();
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

router.get('/urgent', optionalAuth, async (req, res, next) => {
  try {
    const requests = await DonationRequest.getUrgentRequests();
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/responses', optionalAuth, async (req, res, next) => {
  try {
    const responses = await DonationRequest.getResponses(req.params.id);
    res.json(responses);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/match', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const result = await MatchingEngine.autoMatchRequest(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
