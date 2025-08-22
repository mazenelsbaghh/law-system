-- إنشاء جدول العملاء
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

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_clients_mobile ON clients(mobile);
CREATE INDEX IF NOT EXISTS idx_clients_governorate ON clients(governorate);
CREATE INDEX IF NOT EXISTS idx_clients_gender ON clients(gender);
CREATE INDEX IF NOT EXISTS idx_clients_subscription_date ON clients(subscription_date);

-- تفعيل Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للوصول العام (يمكن تقييدها في الإنتاج)
CREATE POLICY "Enable all operations for clients" ON clients
    FOR ALL USING (true) WITH CHECK (true);

-- إنشاء trigger للـ updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- رسالة تأكيد
SELECT 'تم إنشاء جدول العملاء بنجاح!' as message;