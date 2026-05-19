import express from 'express';
import { User } from '../models/User.js';
import { Hospital } from '../models/Hospital.js';
import { Admin } from '../models/Admin.js';
import { Donor } from '../models/Donor.js';
import { VerificationDocument } from '../models/VerificationDocument.js';
import { DonationRequest } from '../models/DonationRequest.js';
import { NotificationService } from '../services/NotificationService.js';
import { authenticate, authorize } from '../middleware/auth.js';
import config from '../config/index.js';

const router = express.Router();

router.get('/dashboard', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const stats = await Admin.getDashboardStats();
    const recentActivity = await Admin.getRecentActivity(10);
    
    res.json({
      stats,
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/users', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const filters = req.query;
    const users = await User.list(filters);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id/suspend', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.update(req.params.id, { is_active: false });
    res.json({
      message: 'User suspended successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id/activate', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.update(req.params.id, { is_active: true });
    res.json({
      message: 'User activated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/hospitals', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const filters = req.query;
    const hospitals = await Hospital.list(filters);
    res.json(hospitals);
  } catch (error) {
    next(error);
  }
});

router.put('/hospitals/:id/verify', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const hospital = await Hospital.verify(req.params.id);
    await NotificationService.sendHospitalVerificationNotification(hospital, 'approved');
    
    res.json({
      message: 'Hospital verified successfully',
      hospital,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/hospitals/:id/reject', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    await Hospital.update(req.params.id, { is_verified: false });
    await NotificationService.sendHospitalVerificationNotification(hospital, 'rejected');
    
    res.json({
      message: 'Hospital verification rejected',
      hospital,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/documents', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const documents = await VerificationDocument.getPendingDocuments();
    res.json(documents);
  } catch (error) {
    next(error);
  }
});

router.put('/documents/:id/approve', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const document = await VerificationDocument.updateStatus(req.params.id, 'approved');
    res.json({
      message: 'Document approved successfully',
      document,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/documents/:id/reject', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { rejection_reason } = req.body;
    const document = await VerificationDocument.updateStatus(req.params.id, 'rejected', rejection_reason);
    res.json({
      message: 'Document rejected successfully',
      document,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/reports', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    let reportData = {};
    
    if (type === 'donations') {
      reportData = await DonationRequest.list({
        status: 'completed',
      });
    } else if (type === 'requests') {
      reportData = await DonationRequest.list();
    } else if (type === 'users') {
      reportData = await User.list();
    }
    
    res.json({
      type,
      period: { startDate, endDate },
      data: reportData,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/analytics', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const stats = await Admin.getDashboardStats();
    
    const bloodGroupDistribution = await Donor.list();
    const bloodGroups = {};
    bloodGroupDistribution.forEach(donor => {
      const key = `${donor.blood_group}${donor.rh_factor}`;
      bloodGroups[key] = (bloodGroups[key] || 0) + 1;
    });

    const urgencyDistribution = await DonationRequest.list();
    const urgencyLevels = {};
    urgencyDistribution.forEach(request => {
      urgencyLevels[request.urgency_level] = (urgencyLevels[request.urgency_level] || 0) + 1;
    });

    res.json({
      stats,
      bloodGroupDistribution: bloodGroups,
      urgencyDistribution: urgencyLevels,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
