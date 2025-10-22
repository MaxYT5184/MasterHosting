-- Create orders table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  discord_username TEXT,
  
  -- Website Details
  selected_domain TEXT NOT NULL,
  subdomain TEXT NOT NULL,
  full_subdomain TEXT NOT NULL,
  website_type TEXT NOT NULL,
  website_description TEXT NOT NULL,
  
  -- Technical Requirements
  tech_stack TEXT NOT NULL,
  need_database BOOLEAN DEFAULT FALSE,
  need_ssl BOOLEAN DEFAULT TRUE,
  estimated_traffic TEXT,
  
  -- Additional Information
  github_repo TEXT,
  additional_notes TEXT,
  
  -- Order Status
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create index on full_subdomain for uniqueness check
CREATE INDEX IF NOT EXISTS idx_orders_subdomain ON orders(full_subdomain);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth setup)
CREATE POLICY "Allow all operations on orders" ON orders
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
