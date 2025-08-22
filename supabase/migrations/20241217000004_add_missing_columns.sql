-- إضافة الأعمدة المفقودة لجدول lawyers لتتوافق مع الواجهة

-- إضافة عمود phone (نسخة من mobile)
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS phone TEXT;
UPDATE lawyers SET phone = mobile WHERE phone IS NULL;

-- إضافة عمود cases (نسخة من total_cases)
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS cases INTEGER DEFAULT 0;
UPDATE lawyers SET cases = COALESCE(total_cases, 0) WHERE cases = 0;

-- إضافة عمود maxCases
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS maxCases INTEGER DEFAULT 10;
UPDATE lawyers SET maxCases = COALESCE(total_cases, 10) WHERE maxCases = 10;

-- إضافة عمود availableCases (نسخة من remaining_cases)
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS availableCases INTEGER DEFAULT 0;
UPDATE lawyers SET availableCases = COALESCE(remaining_cases, 0) WHERE availableCases = 0;

-- إضافة عمود pricePerCase (نسخة من subscription_amount)
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS pricePerCase DECIMAL DEFAULT 0;
UPDATE lawyers SET pricePerCase = COALESCE(subscription_amount, 0) WHERE pricePerCase = 0;

-- إضافة عمود participated
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS participated BOOLEAN DEFAULT false;

-- إضافة عمود subscribed (نسخة من is_subscribed)
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS subscribed BOOLEAN DEFAULT true;
UPDATE lawyers SET subscribed = COALESCE(is_subscribed, true) WHERE subscribed IS NULL;

-- إضافة عمود receivedFreeCase (نسخة من received_free_case)
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS receivedFreeCase BOOLEAN DEFAULT false;
UPDATE lawyers SET receivedFreeCase = COALESCE(received_free_case, false) WHERE receivedFreeCase IS NULL;

-- إضافة عمود reorders
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS reorders INTEGER DEFAULT 0;

-- إضافة عمود lastCaseDate
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS lastCaseDate TIMESTAMP;

-- إنشاء فهارس للأعمدة الجديدة
CREATE INDEX IF NOT EXISTS idx_lawyers_phone ON lawyers(phone);
CREATE INDEX IF NOT EXISTS idx_lawyers_cases ON lawyers(cases);
CREATE INDEX IF NOT EXISTS idx_lawyers_subscribed ON lawyers(subscribed);
CREATE INDEX IF NOT EXISTS idx_lawyers_participated ON lawyers(participated);

-- تحديث trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_lawyers_updated_at ON lawyers;
CREATE TRIGGER update_lawyers_updated_at
    BEFORE UPDATE ON lawyers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();