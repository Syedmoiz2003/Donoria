import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:8080'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global security middleware to strip password hashes from responses
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (body) {
    const sanitize = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(sanitize);
      
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'password') continue;
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    };
    return originalJson.call(this, sanitize(body));
  };
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts from this IP, please try again later.',
});
app.use('/api/auth/login', authLimiter);

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    message: 'LifeLink Blood Donation Platform API',
    version: '1.0.0',
    status: 'running',
  });
});

app.use(notFound);
app.use(errorHandler);

import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Admin } from './models/Admin.js';

const PORT = config.port;

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_SEED_EMAIL;
    const adminPassword = process.env.ADMIN_SEED_PASSWORD;
    if (!adminEmail || !adminPassword) {
      return;
    }
    const existingAdmin = await User.findByEmail(adminEmail);
    if (!existingAdmin) {
      console.log(`🌱 Seeding admin user ${adminEmail}...`);
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const user = await User.create({
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
      console.log('✅ Admin user successfully seeded!');
    }
  } catch (error) {
    console.error('❌ Failed to seed admin user:', error);
  }
}

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  await seedAdmin();
});

export default app;
