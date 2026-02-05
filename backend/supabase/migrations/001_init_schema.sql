-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  is_email_verified BOOLEAN DEFAULT false,
  is_phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'UZS',
  method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255) UNIQUE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);
CREATE INDEX IF NOT EXISTS payments_transaction_id_idx ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON payments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Create RLS Policies for Payments
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
