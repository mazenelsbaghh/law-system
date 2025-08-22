-- Create lawyers table
CREATE TABLE IF NOT EXISTS lawyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  governorate TEXT NOT NULL,
  cases INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  participated BOOLEAN DEFAULT false,
  subscribed BOOLEAN DEFAULT false,
  receivedFreeCase BOOLEAN DEFAULT false,
  availableCases INTEGER DEFAULT 1,
  pricePerCase DECIMAL(10,2) DEFAULT 100,
  subscription_date TIMESTAMP WITH TIME ZONE,
  reorder_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  budget DECIMAL(10,2) DEFAULT 0,
  clients INTEGER DEFAULT 0,
  responses INTEGER DEFAULT 0,
  subscribers INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  reorders INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('نشطة', 'مكتملة', 'متوقفة')) DEFAULT 'نشطة',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  lawyer TEXT NOT NULL,
  status TEXT CHECK (status IN ('جديدة', 'قيد المراجعة', 'مقبولة', 'مرفوضة', 'مكتملة')) DEFAULT 'جديدة',
  priority TEXT CHECK (priority IN ('عالية', 'متوسطة', 'منخفضة')) DEFAULT 'متوسطة',
  date DATE NOT NULL,
  amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lawyers_governorate ON lawyers(governorate);
CREATE INDEX IF NOT EXISTS idx_lawyers_participated ON lawyers(participated);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(startDate, endDate);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_priority ON cases(priority);
CREATE INDEX IF NOT EXISTS idx_cases_lawyer ON cases(lawyer);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_clients_mobile ON clients(mobile);
CREATE INDEX IF NOT EXISTS idx_clients_governorate ON clients(governorate);
CREATE INDEX IF NOT EXISTS idx_clients_gender ON clients(gender);
CREATE INDEX IF NOT EXISTS idx_clients_subscription_date ON clients(subscription_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_lawyers_updated_at BEFORE UPDATE ON lawyers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you may want to restrict this in production)
CREATE POLICY "Enable all operations for lawyers" ON lawyers
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for campaigns" ON campaigns
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for cases" ON cases
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for expenses" ON expenses
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for clients" ON clients
    FOR ALL USING (true) WITH CHECK (true);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  governorate TEXT,
  gender TEXT CHECK (gender IN ('ذكر', 'انثى', 'انثي')) NOT NULL,
  subscription_amount DECIMAL(10,2) NOT NULL,
  send_method TEXT DEFAULT 'واتس',
  total_cases INTEGER DEFAULT 1,
  consumed_cases INTEGER DEFAULT 0,
  remaining_cases INTEGER DEFAULT 1,
  subscription_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  assignee TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('عالية', 'متوسطة', 'منخفضة')) DEFAULT 'متوسطة',
  status TEXT CHECK (status IN ('جديدة', 'قيد التنفيذ', 'مكتملة')) DEFAULT 'جديدة',
  dueDate DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for tasks" ON tasks
    FOR ALL USING (true) WITH CHECK (true);