-- إضافة حقول القضايا الجديدة إلى جدول المحامين

-- إضافة عمود إجمالي القضايا
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS total_cases INTEGER DEFAULT 0;

-- إضافة عمود القضايا المأخوذة
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS taken_cases INTEGER DEFAULT 0;

-- إضافة عمود القضايا المتبقية
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS remaining_cases INTEGER DEFAULT 0;

-- تحديث البيانات الموجودة
-- تحديث taken_cases بناءً على عمود cases الموجود
UPDATE lawyers SET taken_cases = COALESCE(cases, 0) WHERE taken_cases = 0;

-- تحديث total_cases بناءً على الإيرادات
UPDATE lawyers SET total_cases = 
  CASE 
    WHEN revenue >= 10000 THEN 100
    WHEN revenue >= 5000 THEN 50
    WHEN revenue >= 2000 THEN 20
    WHEN revenue >= 1000 THEN 10
    ELSE 5
  END
WHERE total_cases = 0;

-- تحديث remaining_cases
UPDATE lawyers SET remaining_cases = total_cases - taken_cases WHERE remaining_cases = 0;

-- إضافة تعليقات للأعمدة الجديدة
COMMENT ON COLUMN lawyers.total_cases IS 'إجمالي عدد القضايا المتاحة للمحامي';
COMMENT ON COLUMN lawyers.taken_cases IS 'عدد القضايا التي أخذها المحامي';
COMMENT ON COLUMN lawyers.remaining_cases IS 'عدد القضايا المتبقية للمحامي';