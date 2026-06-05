import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Hospital } from '../models/Hospital.js';
import { Donor } from '../models/Donor.js';
import { Admin } from '../models/Admin.js';
import { NotificationService } from '../services/NotificationService.js';
import { TokenBlacklist } from '../services/TokenBlacklist.js';
import { registerValidation, loginValidation, handleValidationErrors } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import config from '../config/index.js';

const router = express.Router();

// Self-healing helper functions
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

router.post('/register', registerValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const { email, password, full_name, phone, role, ...profileData } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      full_name,
      phone,
      role,
    });

    await User.updateLastLogin(user.id);

    let profile = null;
    if (role === 'hospital') {
      profile = await Hospital.create({ user_id: user.id, ...profileData });
    } else if (role === 'donor') {
      profile = await Donor.create({ user_id: user.id, ...profileData });
    } else if (role === 'admin') {
      profile = await Admin.create({ user_id: user.id, ...profileData });
    }

    await NotificationService.sendWelcomeEmail(user, role);

    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      profile,
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', loginValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const isAdminAttempt = adminEmail && adminPassword && email === adminEmail && password === adminPassword && role === 'admin';

    if (isAdminAttempt) {
      let user = await User.findByEmail(adminEmail);
      if (!user) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        user = await User.create({
          email: adminEmail,
          password: hashedPassword,
          full_name: 'System Admin',
          phone: '1234567890',
          role: 'admin',
        });
        await Admin.create({
          user_id: user.id,
          department: 'Management',
          permissions: ['all'],
        });
      } else {
        const isValid = await bcrypt.compare(adminPassword, user.password);
        if (!isValid) {
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          await User.update(user.id, { password: hashedPassword });
        }
      }
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ error: `Unauthorized role: This account is registered as a ${user.role}` });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is suspended' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await User.updateLastLogin(user.id);

    let profile = null;
    if (user.role === 'hospital') {
      profile = await getOrCreateHospitalProfile(user.id, user);
    } else if (user.role === 'donor') {
      profile = await getOrCreateDonorProfile(user.id, user);
    } else if (user.role === 'admin') {
      profile = await Admin.findByUserId(user.id);
    }

    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      profile,
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    let profile = null;
    if (user.role === 'hospital') {
      profile = await getOrCreateHospitalProfile(user.id, user);
    } else if (user.role === 'donor') {
      profile = await getOrCreateDonorProfile(user.id, user);
    } else if (user.role === 'admin') {
      profile = await Admin.findByUserId(user.id);
    }

    res.json({
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { full_name, phone, ...profileData } = req.body;
    
    const updateData = {};
    if (full_name) updateData.full_name = full_name;
    if (phone) updateData.phone = phone;

    const user = await User.update(req.user.id, updateData);

    let profile = null;
    if (req.user.role === 'hospital') {
      const hospital = await Hospital.findByUserId(req.user.id);
      if (hospital) {
        profile = await Hospital.update(hospital.id, profileData);
      }
    } else if (req.user.role === 'donor') {
      const donor = await Donor.findByUserId(req.user.id);
      if (donor) {
        profile = await Donor.update(donor.id, profileData);
      }
    }

    res.json({
      message: 'Profile updated successfully',
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', authenticate, async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    await TokenBlacklist.add(token);
  }
  res.json({ message: 'Logout successful' });
});

router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const currentPassword = req.body.currentPassword || req.body.current_password;
    const newPassword = req.body.newPassword || req.body.new_password;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current password and new password are required' });
    }

    const user = await User.findById(req.user.id);
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(req.user.id, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
