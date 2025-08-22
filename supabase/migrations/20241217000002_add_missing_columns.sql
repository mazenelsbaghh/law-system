-- إضافة الأعمدة المفقودة إلى جدول المحامين

-- إضافة عمود available_cases إذا لم يكن موجوداً
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lawyers' AND column_name = 'available_cases'
  ) THEN
    ALTER TABLE lawyers ADD COLUMN available_cases INTEGER DEFAULT 0;
    COMMENT ON COLUMN lawyers.available_cases IS 'عدد القضايا المتاحة للمحامي';
  END IF;
END
$$;

-- إضافة عمود price_per_case إذا لم يكن موجوداً
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lawyers' AND column_name = 'price_per_case'
  ) THEN
    ALTER TABLE lawyers ADD COLUMN price_per_case DECIMAL(10,2) DEFAULT 0;
    COMMENT ON COLUMN lawyers.price_per_case IS 'سعر القضية الواحدة';
  END IF;
END
$$;

-- إضافة عمود is_subscribed إذا لم يكن موجوداً
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lawyers' AND column_name = 'is_subscribed'
  ) THEN
    ALTER TABLE lawyers ADD COLUMN is_subscribed BOOLEAN DEFAULT false;
    COMMENT ON COLUMN lawyers.is_subscribed IS 'حالة الاشتراك';
  END IF;
END
$$;

-- تحديث القيم الافتراضية للأعمدة الموجودة
UPDATE lawyers 
SET 
  available_cases = COALESCE(remaining_cases, 0),
  price_per_case = CASE 
    WHEN COALESCE(total_cases, 0) > 0 THEN COALESCE(revenue, 0) / COALESCE(total_cases, 1)
    ELSE COALESCE(revenue, 0)
  END,
  is_subscribed = true
WHERE available_cases IS NULL OR price_per_case IS NULL OR is_subscribed IS NULL;