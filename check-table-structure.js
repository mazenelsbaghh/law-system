import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://vvcwnokwrtyykfjimvgm.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY'
);

async function checkTableStructure() {
  try {
    console.log('فحص هيكل جدول lawyers...');
    
    // فحص أعمدة الجدول
    const { data: columns, error: columnsError } = await supabase
      .rpc('exec', {
        sql: `SELECT column_name, data_type, is_nullable, column_default 
              FROM information_schema.columns 
              WHERE table_name = 'lawyers' 
              ORDER BY ordinal_position;`
      });
    
    if (columnsError) {
      console.error('خطأ في فحص الأعمدة:', columnsError);
      
      // محاولة بديلة - جلب عينة من البيانات لمعرفة الأعمدة
      console.log('\nمحاولة جلب عينة من البيانات...');
      const { data: sample, error: sampleError } = await supabase
        .from('lawyers')
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.error('خطأ في جلب العينة:', sampleError);
        return;
      }
      
      if (sample && sample.length > 0) {
        console.log('\nالأعمدة الموجودة في الجدول:');
        Object.keys(sample[0]).forEach((key, index) => {
          console.log(`${index + 1}. ${key}: ${typeof sample[0][key]}`);
        });
        
        console.log('\nعينة من البيانات:');
        console.log(JSON.stringify(sample[0], null, 2));
      }
    } else {
      console.log('\nأعمدة جدول lawyers:');
      columns.forEach((col, index) => {
        console.log(`${index + 1}. ${col.column_name} (${col.data_type}) - ${col.is_nullable === 'YES' ? 'nullable' : 'not null'}`);
      });
    }
    
    // الأعمدة المطلوبة للواجهة
    const requiredColumns = [
      'phone',
      'cases', 
      'maxCases',
      'availableCases',
      'pricePerCase',
      'participated',
      'subscribed',
      'receivedFreeCase',
      'reorders',
      'lastCaseDate'
    ];
    
    console.log('\n=== الأعمدة المطلوبة للواجهة ===');
    requiredColumns.forEach(col => {
      console.log(`- ${col}`);
    });
    
    // إنشاء SQL لإضافة الأعمدة المفقودة
    const alterStatements = [
      "ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS phone TEXT;",
      "ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS cases INTEGER DEFAULT 0;",
      "ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS maxCases INTEGER DEFAULT 10;", 
      "ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS availableCases INTEGER DEFAULT 0;",
      "ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS pricePerCase DECIMAL DEFAULT 0;",
      "ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS participated BOOLEAN DEFAULT false;",
      "ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS subscribed BOOLEAN DEFAULT true;",
      "ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS receivedFreeCase BOOLEAN DEFAULT false;",
      "ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS reorders INTEGER DEFAULT 0;",
      "ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS lastCaseDate TIMESTAMP;"
    ];
    
    console.log('\n=== تنفيذ إضافة الأعمدة المفقودة ===');
    
    for (const statement of alterStatements) {
      console.log(`تنفيذ: ${statement}`);
      
      const { error: alterError } = await supabase
        .rpc('exec', { sql: statement });
      
      if (alterError) {
        console.error(`خطأ في تنفيذ ${statement}:`, alterError);
      } else {
        console.log('✓ تم بنجاح');
      }
    }
    
    console.log('\n=== تحديث البيانات الموجودة ===');
    
    // تحديث البيانات الموجودة
    const updateStatements = [
      "UPDATE lawyers SET phone = mobile WHERE phone IS NULL AND mobile IS NOT NULL;",
      "UPDATE lawyers SET cases = total_cases WHERE cases IS NULL OR cases = 0;",
      "UPDATE lawyers SET availableCases = remaining_cases WHERE availableCases IS NULL OR availableCases = 0;",
      "UPDATE lawyers SET pricePerCase = subscription_amount WHERE pricePerCase IS NULL OR pricePerCase = 0;",
      "UPDATE lawyers SET subscribed = is_subscribed WHERE subscribed IS NULL;",
      "UPDATE lawyers SET participated = false WHERE participated IS NULL;",
      "UPDATE lawyers SET receivedFreeCase = received_free_case WHERE receivedFreeCase IS NULL;"
    ];
    
    for (const statement of updateStatements) {
      console.log(`تنفيذ: ${statement}`);
      
      const { error: updateError } = await supabase
        .rpc('exec', { sql: statement });
      
      if (updateError) {
        console.error(`خطأ في تنفيذ ${statement}:`, updateError);
      } else {
        console.log('✓ تم بنجاح');
      }
    }
    
    // التحقق من النتائج
    console.log('\n=== التحقق من النتائج ===');
    const { data: updatedSample, error: finalError } = await supabase
      .from('lawyers')
      .select('name, phone, cases, availableCases, pricePerCase, subscribed, participated')
      .limit(3);
    
    if (finalError) {
      console.error('خطأ في التحقق النهائي:', finalError);
    } else {
      console.log('عينة من البيانات المحدثة:');
      updatedSample.forEach((lawyer, index) => {
        console.log(`${index + 1}. ${lawyer.name}`);
        console.log(`   الهاتف: ${lawyer.phone}`);
        console.log(`   القضايا: ${lawyer.cases}`);
        console.log(`   القضايا المتاحة: ${lawyer.availableCases}`);
        console.log(`   سعر القضية: ${lawyer.pricePerCase}`);
        console.log(`   مشترك: ${lawyer.subscribed}`);
        console.log(`   مشارك: ${lawyer.participated}`);
        console.log('---');
      });
    }
    
  } catch (error) {
    console.error('خطأ عام:', error);
  }
}

checkTableStructure();