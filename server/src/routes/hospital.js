import express from 'express';
import { Hospital } from '../models/Hospital.js';
import { DonationRequest } from '../models/DonationRequest.js';
import { VerificationDocument } from '../models/VerificationDocument.js';
import { MatchingEngine } from '../services/MatchingEngine.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { hospitalProfileValidation, donationRequestValidation, handleValidationErrors } from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const filters = req.query;
    const hospitals = await Hospital.list(filters);
    res.json(hospitals);
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }
    res.json(hospital);
  } catch (error) {
    next(error);
  }
});

router.put('/me', authenticate, authorize('hospital'), hospitalProfileValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }

    const updated = await Hospital.update(hospital.id, req.body);
    res.json({
      message: 'Hospital profile updated successfully',
      hospital: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/documents', authenticate, authorize('hospital'), uploadSingle, async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const document = await VerificationDocument.create({
      hospital_id: hospital.id,
      document_type: req.body.document_type,
      document_name: req.body.document_name || req.file.originalname,
      file_url: req.file.path,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/documents', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }

    const documents = await VerificationDocument.getByHospital(hospital.id);
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

router.post('/requests', authenticate, authorize('hospital'), donationRequestValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }

    if (!hospital.is_verified) {
      return res.status(403).json({ error: 'Hospital must be verified to post requests' });
    }

    const request = await DonationRequest.create({
      hospital_id: hospital.id,
      ...req.body,
    });

    await MatchingEngine.autoMatchRequest(request.id);

    res.status(201).json({
      message: 'Donation request created successfully',
      request,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/requests', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }

    const requests = await Hospital.getDonationRequests(hospital.id);
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

router.get('/requests/:id', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }

    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.hospital_id !== hospital.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const responses = await DonationRequest.getResponses(request.id);
    res.json({ ...request, responses });
  } catch (error) {
    next(error);
  }
});

router.put('/requests/:id', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }

    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.hospital_id !== hospital.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await DonationRequest.update(req.params.id, req.body);
    res.json({
      message: 'Request updated successfully',
      request: updated,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/requests/:id', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }

    const request = await DonationRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.hospital_id !== hospital.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await DonationRequest.delete(req.params.id);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/responses', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findByUserId(req.user.id);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }

    const responses = await Hospital.getResponses(hospital.id);
    res.json(responses);
  } catch (error) {
    next(error);
  }
});

export default router;
