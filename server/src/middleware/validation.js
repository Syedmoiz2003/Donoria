import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('full_name').trim().notEmpty().withMessage('Full name required'),
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  body('role').isIn(['donor', 'hospital', 'admin']).withMessage('Invalid role'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

export const donorProfileValidation = [
  body('blood_group').isIn(['A', 'B', 'AB', 'O']).withMessage('Invalid blood group'),
  body('rh_factor').isIn(['+', '-']).withMessage('Invalid RH factor'),
  body('date_of_birth').isISO8601().withMessage('Valid date of birth required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('weight').isFloat({ min: 30, max: 200 }).withMessage('Weight must be between 30 and 200 kg'),
  body('height').isFloat({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),
];

export const hospitalProfileValidation = [
  body('hospital_name').trim().notEmpty().withMessage('Hospital name required'),
  body('license_number').trim().notEmpty().withMessage('License number required'),
  body('address').trim().notEmpty().withMessage('Address required'),
  body('city').trim().notEmpty().withMessage('City required'),
  body('state').trim().notEmpty().withMessage('State required'),
  body('zip_code').trim().notEmpty().withMessage('Zip code required'),
  body('contact_person').trim().notEmpty().withMessage('Contact person required'),
  body('emergency_contact').trim().notEmpty().withMessage('Emergency contact required'),
];

export const donationRequestValidation = [
  body('request_type').isIn(['blood', 'organ']).withMessage('Invalid request type'),
  body('blood_group').if(body('request_type').equals('blood')).isIn(['A', 'B', 'AB', 'O']).withMessage('Invalid blood group'),
  body('rh_factor').if(body('request_type').equals('blood')).isIn(['+', '-']).withMessage('Invalid RH factor'),
  body('organ_type').if(body('request_type').equals('organ')).trim().notEmpty().withMessage('Organ type required'),
  body('urgency_level').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid urgency level'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deadline').isISO8601().withMessage('Valid deadline required'),
];

export const donorResponseValidation = [
  body('request_id').isInt().withMessage('Valid request ID required'),
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Message too long'),
  body('estimated_arrival').optional().isISO8601().withMessage('Valid arrival time required'),
];
