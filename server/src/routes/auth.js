import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Hospital } from '../models/Hospital.js';
import { Donor } from '../models/Donor.js';
import { Admin } from '../models/Admin.js';
import { NotificationService } from '../services/NotificationService.js';
import { registerValidation, loginValidation, handleValidationErrors } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';
import config from '../config/index.js';

const router = express.Router();

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

    if (role === 'hospital') {
      await Hospital.create({ user_id: user.id, ...profileData });
    } else if (role === 'donor') {
      await Donor.create({ user_id: user.id, ...profileData });
    } else if (role === 'admin') {
      await Admin.create({ user_id: user.id, ...profileData });
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
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', loginValidation, handleValidationErrors, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is suspended' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await User.updateLastLogin(user.id);

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
      profile = await Hospital.findByUserId(user.id);
    } else if (user.role === 'donor') {
      profile = await Donor.findByUserId(user.id);
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
  res.json({ message: 'Logout successful' });
});

router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

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
