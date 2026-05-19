# LifeLink Backend API

Complete backend for the LifeLink Blood Donation Platform based on the class diagram.

## Features

- **User Management**: Registration, login, profile management for Donors, Hospitals, and Admins
- **Hospital Operations**: Profile management, verification document uploads, donation request posting
- **Donor Operations**: Profile management, eligibility checking, browsing requests, submitting responses
- **Matching Engine**: Intelligent donor-request matching based on blood type, location, urgency
- **Notification Service**: Email, SMS, and push notifications based on urgency levels
- **AI Chatbot**: Multi-language support for donor assistance
- **Admin Operations**: Dashboard analytics, hospital verification, user management, reports

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: PostgreSQL via Supabase
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email**: Nodemailer
- **SMS**: Twilio
- **AI**: OpenAI API
- **Validation**: Express-validator

## Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Supabase URL and keys
- JWT secret
- SMTP credentials for email
- Twilio credentials for SMS
- OpenAI API key for chatbot

3. Set up the database:
- Run the SQL schema in `supabase/schema.sql` in your Supabase SQL editor
- This will create all tables, indexes, and RLS policies

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on port 5000 by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Change password

### Hospitals
- `GET /api/hospitals/me` - Get hospital profile
- `PUT /api/hospitals/me` - Update hospital profile
- `POST /api/hospitals/documents` - Upload verification document
- `GET /api/hospitals/documents` - Get hospital documents
- `POST /api/hospitals/requests` - Create donation request
- `GET /api/hospitals/requests` - Get hospital requests
- `GET /api/hospitals/requests/:id` - Get specific request
- `PUT /api/hospitals/requests/:id` - Update request
- `DELETE /api/hospitals/requests/:id` - Delete request
- `GET /api/hospitals/responses` - Get responses to hospital requests

### Donors
- `GET /api/donors/me` - Get donor profile
- `POST /api/donors/me` - Create donor profile
- `PUT /api/donors/me` - Update donor profile
- `PUT /api/donors/me/availability` - Set availability status
- `GET /api/donors/me/eligibility` - Check donation eligibility
- `GET /api/donors/requests` - Browse compatible requests
- `GET /api/donors/requests/:id` - Get specific request
- `POST /api/donors/responses` - Submit response to request
- `GET /api/donors/responses` - Get donor's responses
- `GET /api/donors/responses/:id` - Get specific response
- `DELETE /api/donors/responses/:id` - Cancel response
- `GET /api/donors/history` - Get donation history
- `POST /api/donors/chat` - Chat with AI assistant
- `GET /api/donors/chat/quick-responses` - Get quick chat responses
- `GET /api/donors/health-tips` - Get health tips

### Public Requests
- `GET /api/requests` - List all requests (with filters)
- `GET /api/requests/active` - Get active requests
- `GET /api/requests/urgent` - Get urgent requests
- `GET /api/requests/:id` - Get specific request
- `GET /api/requests/:id/responses` - Get responses to request
- `POST /api/requests/:id/match` - Trigger donor matching (admin only)

### Responses
- `GET /api/responses` - List all responses (admin only)
- `GET /api/responses/:id` - Get specific response
- `PUT /api/responses/:id/accept` - Accept response (hospital)
- `PUT /api/responses/:id/complete` - Mark donation as complete (hospital)
- `PUT /api/responses/:id/reject` - Reject response (hospital)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id/suspend` - Suspend user
- `PUT /api/admin/users/:id/activate` - Activate user
- `GET /api/admin/hospitals` - List all hospitals
- `PUT /api/admin/hospitals/:id/verify` - Verify hospital
- `PUT /api/admin/hospitals/:id/reject` - Reject hospital
- `GET /api/admin/documents` - Get pending documents
- `PUT /api/admin/documents/:id/approve` - Approve document
- `PUT /api/admin/documents/:id/reject` - Reject document
- `GET /api/admin/reports` - Generate reports
- `GET /api/admin/analytics` - Get analytics data

### Health
- `GET /api/health` - Health check endpoint

## Database Schema

The database consists of the following tables:
- `users` - Base user table
- `hospitals` - Hospital profiles
- `donors` - Donor profiles
- `admins` - Admin profiles
- `donation_requests` - Blood/organ donation requests
- `donor_responses` - Donor responses to requests
- `verification_documents` - Hospital verification documents
- `chat_sessions` - AI chatbot sessions
- `chat_messages` - Chat message history

See `supabase/schema.sql` for the complete schema with indexes and RLS policies.

## Security

- JWT-based authentication
- Role-based authorization (donor, hospital, admin)
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Helmet for security headers
- Row Level Security (RLS) in Supabase

## Matching Engine

The matching engine considers:
- Blood type compatibility
- Geographic proximity
- Urgency level
- Donor eligibility (last donation date, age, weight)
- Availability status

## Notification Service

Notifications are sent based on urgency:
- **Critical**: Email, SMS, Push
- **High**: Email, SMS
- **Medium**: Email, Push
- **Low**: Email

## AI Chatbot

The chatbot provides:
- Multi-language support (English, Hindi)
- Donation eligibility information
- Health tips
- Quick responses for common questions
- Session history management

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── database.js       # Supabase client
│   │   └── index.js          # Configuration
│   ├── middleware/
│   │   ├── auth.js           # Authentication & authorization
│   │   ├── validation.js     # Request validation
│   │   ├── errorHandler.js   # Error handling
│   │   └── upload.js         # File upload handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Hospital.js
│   │   ├── Donor.js
│   │   ├── Admin.js
│   │   ├── DonationRequest.js
│   │   ├── DonorResponse.js
│   │   └── VerificationDocument.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── hospital.js
│   │   ├── donor.js
│   │   ├── requests.js
│   │   ├── responses.js
│   │   ├── admin.js
│   │   └── index.js
│   ├── services/
│   │   ├── MatchingEngine.js
│   │   ├── NotificationService.js
│   │   └── AIChatbot.js
│   └── server.js             # Main server file
├── supabase/
│   └── schema.sql            # Database schema
├── uploads/                  # File upload directory
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## License

ISC
