-- إنشاء جدول العملاء إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS public.clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    governorate VARCHAR(100),
    gender VARCHAR(10),
    subscription_amount INTEGER,
    send_method VARCHAR(50),
    total_cases INTEGER DEFAULT 0,
    consumed_cases INTEGER DEFAULT 0,
    remaining_cases INTEGER DEFAULT 0,
    subscription_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إدراج بيانات العملاء
INSERT INTO public.clients (name, mobile, governorate, gender, subscription_amount, send_method, total_cases, consumed_cases, remaining_cases, subscription_date) VALUES
('هارون', '+201062546455', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-06-03'),
('محمد ابراهيم', '+201063131642', NULL, 'ذكر', 400, 'واتس', 5, 5, 0, '2024-06-17'),
('وسام', '+201001755770', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-06-18'),
('محمد سامى', '+201025333333', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-06-20'),
('محمد ياسين', '+201226996026', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-06-29'),
('محمود محمد ابوالفتوح', '+201289097335', NULL, 'ذكر', 400, 'واتس', 5, 3, 2, '2024-05-02'),
('خالد', '+201020759107', NULL, 'ذكر', 500, 'واتس', 5, 5, 0, '2024-04-15'),
('اسلام', '+201211195381', NULL, 'ذكر', 200, 'واتس', 1, 1, 0, '2024-05-31'),
('عبد الحميد منصور', '+201098262529', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-06-03'),
('محامى طارق', '+201288242805', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-05-03'),
('محمود النمس', '+201141157262', NULL, 'ذكر', 400, 'واتس', 5, 1, 4, '2024-05-05'),
('احمد شريف', '+201050706027', NULL, 'ذكر', 500, 'واتس', 5, 5, 0, '2024-05-17'),
('اكرم مصطفى', '+201008974477', NULL, 'ذكر', 550, 'واتس', 6, 6, 0, '2024-05-19'),
('احمد عبد العزيز', '+201007217898', NULL, 'ذكر', 300, 'واتس', 2, 2, 0, '2024-05-27'),
('اسلام ابو جبل', '+201005533572', NULL, 'ذكر', 400, 'واتس', 5, 4, 1, '2024-05-27'),
('احمد ابو الوفا', '+201004402485', NULL, 'ذكر', 400, 'واتس', 5, 5, 0, '2024-05-30'),
('صاحب اشرف', '+201272607926', NULL, 'ذكر', 400, 'واتس', 1, 1, 0, NULL),
('احمد سلامه', '+201093750911', NULL, 'ذكر', 200, 'واتس', 1, 1, 0, '2024-06-29'),
('عبدالله زينهم', '+201064365320', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-06-30'),
('احمد محمود', '+201276997470', NULL, 'ذكر', 400, 'واتس', 5, 5, 0, '2024-06-30'),
('شيماء مصطفى بكرى', '+201221914175', 'الاسماعلية', 'انثى', 400, 'واتس', 5, 2, 3, '2024-07-01'),
('علاء المالكى', '+201031277891', NULL, 'ذكر', 900, 'واتس', 7, 7, 0, '2024-07-04'),
('محمد فاروق', '+201227490166', 'القاهرة', 'ذكر', 150, 'واتس', 1, 1, 0, '2024-07-05'),
('محمد علام', '+201112772799', NULL, 'ذكر', 400, 'واتس', 5, 5, 0, '2024-07-08'),
('صلاح الصاوي', '+201005136764', NULL, 'ذكر', 200, 'واتس', 1, 1, 0, '2024-07-16'),
('صبري عماد', '+201010556923', NULL, 'ذكر', 500, 'واتس', 5, 3, 2, '2024-07-19'),
('وحيد الكلاني', '+201276444114', NULL, 'ذكر', 300, 'واتس', 2, 2, 0, '2024-07-21'),
('عماد', '+201120915557', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-07-25'),
('علاء عطالله', '+201022262755', NULL, 'ذكر', 400, 'واتس', 5, 4, 1, '2024-07-25'),
('صبري', '+201113293409', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-07-20'),
('لينا', '+201032909479', NULL, 'انثى', 150, 'واتس', 1, 1, 0, '2024-07-20'),
('محمد سيد', '+201002113403', NULL, 'ذكر', 400, 'واتس', 5, 4, 1, '2024-07-31'),
('فاطمه محمد', '+201001434161', NULL, 'انثى', 400, 'واتس', 3, 3, 0, '2024-08-04'),
('ميخائيل شاروبيم', '+201220572262', NULL, 'ذكر', 400, 'واتس', 5, 2, 3, '2024-08-04'),
('احمد حسنى', '+201031391972', NULL, 'ذكر', 200, 'واتس', 1, 1, 0, '2024-08-05'),
('ابراهيم حسن', '+201140066926', NULL, 'ذكر', 200, 'واتس', 1, 1, 0, '2024-08-07'),
('محمد الرملي', '+201063083050', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-08-10'),
('محمد ربيع', '+201118102614', NULL, 'ذكر', 150, 'واتس', 1, 1, 0, '2024-08-11'),
('صباح حكيم', '+201069025663', NULL, 'ذكر', 200, 'واتس', 5, 2, 3, '2024-08-11'),
('كاريم جمال', '+201110383629', NULL, 'ذكر', 200, 'واتس', 1, 1, 0, '2024-08-11')
ON CONFLICT (mobile) DO NOTHING;

-- إنشاء الفهارس
CREATE INDEX IF NOT EXISTS idx_clients_mobile ON public.clients(mobile);
CREATE INDEX IF NOT EXISTS idx_clients_governorate ON public.clients(governorate);
CREATE INDEX IF NOT EXISTS idx_clients_gender ON public.clients(gender);
CREATE INDEX IF NOT EXISTS idx_clients_subscription_date ON public.clients(subscription_date);

-- تفعيل Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة للسماح بجميع العمليات
DROP POLICY IF EXISTS "Enable all operations for clients table" ON public.clients;
CREATE POLICY "Enable all operations for clients table" ON public.clients
  FOR ALL USING (true);

-- إنشاء دالة لتحديث updated_at
CREATE OR REPLACE FUNCTION update_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء المشغل
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION update_clients_updated_at();

-- عرض عدد العملاء المدرجين
SELECT COUNT(*) as total_clients FROM public.clients;