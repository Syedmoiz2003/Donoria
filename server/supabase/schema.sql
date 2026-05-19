-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL CHECK (role IN ('donor', 'hospital', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Hospitals table
CREATE TABLE hospitals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  hospital_name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  contact_person VARCHAR(255) NOT NULL,
  emergency_contact VARCHAR(20) NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donors table
CREATE TABLE donors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blood_group CHAR(1) NOT NULL CHECK (blood_group IN ('A', 'B', 'AB', 'O')),
  rh_factor CHAR(1) NOT NULL CHECK (rh_factor IN ('+', '-')),
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  weight DECIMAL(5, 2) NOT NULL,
  height DECIMAL(5, 2) NOT NULL,
  organ_donor_consent BOOLEAN DEFAULT false,
  last_donation_date DATE,
  medical_history JSONB DEFAULT '[]',
  is_available BOOLEAN DEFAULT true,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins table
CREATE TABLE admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  department VARCHAR(100),
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donation Requests table
CREATE TABLE donation_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('blood', 'organ')),
  blood_group CHAR(1) CHECK (blood_group IN ('A', 'B', 'AB', 'O')),
  rh_factor CHAR(1) CHECK (rh_factor IN ('+', '-')),
  organ_type VARCHAR(100),
  urgency_level VARCHAR(20) NOT NULL CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
  quantity INTEGER NOT NULL,
  unit VARCHAR(20) DEFAULT 'units',
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donor Responses table
CREATE TABLE donor_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
  request_id UUID REFERENCES donation_requests(id) ON DELETE CASCADE,
  compatibility_score INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  message TEXT,
  estimated_arrival TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(donor_id, request_id)
);

-- Verification Documents table
CREATE TABLE verification_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Sessions table (for AI Chatbot)
CREATE TABLE chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  language VARCHAR(20) DEFAULT 'english',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages table
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_hospitals_user_id ON hospitals(user_id);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_is_verified ON hospitals(is_verified);
CREATE INDEX idx_donors_user_id ON donors(user_id);
CREATE INDEX idx_donors_blood_group ON donors(blood_group, rh_factor);
CREATE INDEX idx_donors_is_available ON donors(is_available);
CREATE INDEX idx_donors_city ON donors(city);
CREATE INDEX idx_donation_requests_hospital_id ON donation_requests(hospital_id);
CREATE INDEX idx_donation_requests_status ON donation_requests(status);
CREATE INDEX idx_donation_requests_urgency ON donation_requests(urgency_level);
CREATE INDEX idx_donor_responses_donor_id ON donor_responses(donor_id);
CREATE INDEX idx_donor_responses_request_id ON donor_responses(request_id);
CREATE INDEX idx_donor_responses_status ON donor_responses(status);
CREATE INDEX idx_verification_documents_hospital_id ON verification_documents(hospital_id);
CREATE INDEX idx_verification_documents_status ON verification_documents(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_requests_updated_at BEFORE UPDATE ON donation_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donor_responses_updated_at BEFORE UPDATE ON donor_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_documents_updated_at BEFORE UPDATE ON verification_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Hospitals policies
CREATE POLICY "Hospitals can view own profile" ON hospitals
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Hospitals can update own profile" ON hospitals
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all hospitals" ON hospitals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Donors policies
CREATE POLICY "Donors can view own profile" ON donors
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Donors can update own profile" ON donors
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all donors" ON donors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Donation Requests policies
CREATE POLICY "Hospitals can view own requests" ON donation_requests
  FOR SELECT USING (
    hospital_id IN (
      SELECT id FROM hospitals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Hospitals can create requests" ON donation_requests
  FOR INSERT WITH CHECK (
    hospital_id IN (
      SELECT id FROM hospitals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Hospitals can update own requests" ON donation_requests
  FOR UPDATE USING (
    hospital_id IN (
      SELECT id FROM hospitals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Donors can view active requests" ON donation_requests
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can view all requests" ON donation_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Donor Responses policies
CREATE POLICY "Donors can view own responses" ON donor_responses
  FOR SELECT USING (donor_id IN (SELECT id FROM donors WHERE user_id = auth.uid()));

CREATE POLICY "Donors can create responses" ON donor_responses
  FOR INSERT WITH CHECK (donor_id IN (SELECT id FROM donors WHERE user_id = auth.uid()));

CREATE POLICY "Hospitals can view responses to their requests" ON donor_responses
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM donation_requests
      WHERE hospital_id IN (SELECT id FROM hospitals WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Hospitals can update responses to their requests" ON donor_responses
  FOR UPDATE USING (
    request_id IN (
      SELECT id FROM donation_requests
      WHERE hospital_id IN (SELECT id FROM hospitals WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Admins can view all responses" ON donor_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Verification Documents policies
CREATE POLICY "Hospitals can view own documents" ON verification_documents
  FOR SELECT USING (hospital_id IN (SELECT id FROM hospitals WHERE user_id = auth.uid()));

CREATE POLICY "Hospitals can upload documents" ON verification_documents
  FOR INSERT WITH CHECK (hospital_id IN (SELECT id FROM hospitals WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all documents" ON verification_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update documents" ON verification_documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Chat Sessions policies
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Chat Messages policies
CREATE POLICY "Users can view own chat messages" ON chat_messages
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat messages" ON chat_messages
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT id FROM chat_sessions WHERE user_id = auth.uid()
    )
  );
