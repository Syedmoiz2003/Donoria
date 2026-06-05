import express from 'express';
import authRoutes from './auth.js';
import hospitalRoutes from './hospital.js';
import donorRoutes from './donor.js';
import requestRoutes from './requests.js';
import responseRoutes from './responses.js';
import adminRoutes from './admin.js';
import feedbackRoutes from './feedback.js';
import aiRoutes from './ai.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/donors', donorRoutes);
router.use('/requests', requestRoutes);
router.use('/responses', responseRoutes);
router.use('/admin', adminRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/ai', aiRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
