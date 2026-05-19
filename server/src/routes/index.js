import express from 'express';
import authRoutes from './auth.js';
import hospitalRoutes from './hospital.js';
import donorRoutes from './donor.js';
import requestRoutes from './requests.js';
import responseRoutes from './responses.js';
import adminRoutes from './admin.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/donors', donorRoutes);
router.use('/requests', requestRoutes);
router.use('/responses', responseRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
