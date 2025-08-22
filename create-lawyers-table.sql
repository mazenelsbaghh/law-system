-- إنشاء جدول المحامين (العملاء)
CREATE TABLE IF NOT EXISTS public.lawyers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    governorate VARCHAR(100),
    gender VARCHAR(10),
    subscription_amount DECIMAL(10,2) DEFAULT 0,
    send_method VARCHAR(50),
    total_cases INTEGER DEFAULT 0,
    consumed_cases INTEGER DEFAULT 0,
    remaining_cases INTEGER DEFAULT 0,
    available_cases INTEGER DEFAULT 0,
    price_per_case DECIMAL(10,2) DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    participated BOOLEAN DEFAULT false,
    subscribed BOOLEAN DEFAULT false,
    received_free_case BOOLEAN DEFAULT false,
    is_subscribed BOOLEAN DEFAULT false,
    subscription_date DATE,
    reorder_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_lawyers_name ON public.lawyers(name);
CREATE INDEX IF NOT EXISTS idx_lawyers_mobile ON public.lawyers(mobile);
CREATE INDEX IF NOT EXISTS idx_lawyers_governorate ON public.lawyers(governorate);
CREATE INDEX IF NOT EXISTS idx_lawyers_subscription_date ON public.lawyers(subscription_date);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER update_lawyers_updated_at
    BEFORE UPDATE ON public.lawyers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- تفعيل Row Level Security
ALTER TABLE public.lawyers ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للسماح بجميع العمليات
CREATE POLICY "Enable all operations for lawyers" ON public.lawyers
    FOR ALL USING (true) WITH CHECK (true);

-- منح الصلاحيات
GRANT ALL ON public.lawyers TO anon;
GRANT ALL ON public.lawyers TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE lawyers_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE lawyers_id_seq TO authenticated;