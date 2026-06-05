import express from 'express';
import path from 'path';
import { supabase } from '../config/database.js';
import { Hospital } from '../models/Hospital.js';
import { DonationRequest } from '../models/DonationRequest.js';
import { HospitalInventory } from '../models/HospitalInventory.js';
import { VerificationDocument } from '../models/VerificationDocument.js';
import { MatchingEngine } from '../services/MatchingEngine.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { hospitalProfileValidation, donationRequestValidation, handleValidationErrors } from '../middleware/validation.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Self-healing helper function to prevent crashing or hard 404s when user profile records are missing
const getOrCreateHospitalProfile = async (userId, userDetails = {}) => {
  let hospital = await Hospital.findByUserId(userId);
  if (!hospital) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    hospital = await Hospital.create({
      user_id: userId,
      hospital_name: userDetails.full_name || 'My Hospital',
      license_number: `PENDING-${randomSuffix}`,
      address: 'Please update your address',
      city: 'City',
      state: 'Province',
      zip_code: '00000',
      is_verified: false,
      contact_person: userDetails.full_name || 'Staff',
      emergency_contact: userDetails.phone || '0000000000'
    });
  }
  return hospital;
};

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
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);
    res.json(hospital);
  } catch (error) {
    next(error);
  }
});

router.put('/me', authenticate, authorize('hospital'), hospitalProfileValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);
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
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filename for Supabase Storage
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${hospital.id}/${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    const filePath = `${fileName}`; // Root of the bucket or a specific folder

    // Upload to Supabase Storage bucket 'hospital-documents'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('hospital-documents')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('hospital-documents')
      .getPublicUrl(filePath);

    const document = await VerificationDocument.create({
      hospital_id: hospital.id,
      document_type: req.body.document_type || 'MOU',
      document_name: req.body.document_name || req.file.originalname,
      file_url: urlData.publicUrl,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
    });

    res.status(201).json({
      message: 'Document uploaded and stored online successfully',
      document,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/documents', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);
    const documents = await VerificationDocument.getByHospital(hospital.id);
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

router.post('/requests', authenticate, authorize('hospital'), donationRequestValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);

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
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);
    const requests = await Hospital.getDonationRequests(hospital.id);
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

router.get('/requests/:id', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);
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
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);
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
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);
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
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);
    const responses = await Hospital.getResponses(hospital.id);
    res.json(responses);
  } catch (error) {
    next(error);
  }
});

router.get('/inventory', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);
    const inventory = await HospitalInventory.getByHospital(hospital.id);
    res.json(inventory);
  } catch (error) {
    next(error);
  }
});

router.put('/inventory', authenticate, authorize('hospital'), async (req, res, next) => {
  try {
    const hospital = await getOrCreateHospitalProfile(req.user.id, req.user);
    const { blood_group, rh_factor, quantity } = req.body;
    
    if (!blood_group || !rh_factor || quantity === undefined) {
      return res.status(400).json({ error: 'Missing blood_group, rh_factor, or quantity' });
    }

    const updated = await HospitalInventory.updateQuantity(
      hospital.id,
      blood_group,
      rh_factor,
      quantity
    );

    res.json({
      message: 'Inventory updated successfully',
      inventory: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
