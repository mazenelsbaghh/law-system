import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// قراءة متغيرات البيئة
const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');
const url = lines.find(line => line.startsWith('VITE_SUPABASE_URL=')).split('=')[1];
const key = lines.find(line => line.startsWith('VITE_SUPABASE_ANON_KEY=')).split('=')[1];

const supabase = createClient(url, key);

async function checkLawyersTable() {
  try {
    console.log('فحص جدول المحامين...');
    
    // محاولة الحصول على بيانات من الجدول
    const { data, error } = await supabase
      .from('lawyers')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('خطأ في الوصول لجدول المحامين:', error.message);
      return;
    }
    
    // عد إجمالي المحامين
    const { count, error: countError } = await supabase
      .from('lawyers')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('خطأ في عد المحامين:', countError.message);
    } else {
      console.log('إجمالي عدد المحامين في الجدول:', count);
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

checkLawyersTable();