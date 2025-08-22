import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// قراءة متغيرات البيئة
const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');
const url = lines.find(line => line.startsWith('VITE_SUPABASE_URL=')).split('=')[1];
const key = lines.find(line => line.startsWith('VITE_SUPABASE_ANON_KEY=')).split('=')[1];

const supabase = createClient(url, key);

async function checkClientsTable() {
  try {
    console.log('فحص جدول العملاء...');
    
    // محاولة الحصول على بيانات من الجدول
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('خطأ في الوصول لجدول العملاء:', error.message);
      console.log('الجدول غير موجود، سأقوم بإنشائه...');
      
      // إنشاء جدول العملاء
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          mobile TEXT,
          governorate TEXT,
          gender TEXT,
          subscription_amount DECIMAL(10,2) DEFAULT 0,
          send_method TEXT,
          total_cases INTEGER DEFAULT 0,
          consumed_cases INTEGER DEFAULT 0,
          remaining_cases INTEGER DEFAULT 0,
          subscription_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec', {
        sql: createTableSQL
      });
      
      if (createError) {
        console.log('خطأ في إنشاء جدول العملاء:', createError.message);
      } else {
        console.log('تم إنشاء جدول العملاء بنجاح!');
      }
      
      return;
    }
    
    // عد إجمالي العملاء
    const { count, error: countError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('خطأ في عد العملاء:', countError.message);
    } else {
      console.log('إجمالي عدد العملاء في الجدول:', count);
    }
    
    if (data && data.length > 0) {
      console.log('أعمدة الجدول المتاحة:', Object.keys(data[0]));
      console.log('عينة من البيانات:', data[0]);
    } else {
      console.log('الجدول فارغ');
    }
    
  } catch (err) {
    console.error('خطأ عام:', err.message);
  }
}

checkClientsTable();