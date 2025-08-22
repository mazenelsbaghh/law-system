import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://vvcwnokwrtyykfjimvgm.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY'
);

async function checkActualColumns() {
  try {
    console.log('فحص الأعمدة الفعلية في جدول المحامين...');
    
    // جلب سجل واحد لمعرفة الأعمدة المتاحة
    const { data, error } = await supabase
      .from('lawyers')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('خطأ في جلب البيانات:', error);
      return;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('\n=== الأعمدة المتاحة في جدول lawyers ===');
      columns.forEach((col, index) => {
        console.log(`${index + 1}. ${col}`);
      });
      
      console.log('\n=== عينة من البيانات ===');
      const sample = data[0];
      columns.forEach(col => {
        console.log(`${col}: ${sample[col]}`);
      });
      
      // فحص الأعمدة المطلوبة للواجهة
      const requiredColumns = [
        'id', 'name', 'phone', 'mobile', 'governorate', 'gender',
        'subscription_amount', 'send_method', 'total_cases', 'consumed_cases',
        'remaining_cases', 'available_cases', 'price_per_case', 'revenue',
        'participated', 'subscribed', 'is_subscribed', 'received_free_case',
        'subscription_date', 'reorder_date', 'notes', 'created_at', 'updated_at',
        'cases', 'maxcases', 'pricepercases', 'receivedfreecases', 'reorders', 'lastcasedate'
      ];
      
      console.log('\n=== فحص الأعمدة المطلوبة ===');
      const missingColumns = [];
      const availableColumns = [];
      
      requiredColumns.forEach(col => {
        if (columns.includes(col)) {
          availableColumns.push(col);
          console.log(`✓ ${col} - موجود`);
        } else {
          missingColumns.push(col);
          console.log(`✗ ${col} - مفقود`);
        }
      });
      
      console.log(`\nالأعمدة المتاحة: ${availableColumns.length}`);
      console.log(`الأعمدة المفقودة: ${missingColumns.length}`);
      
      if (missingColumns.length > 0) {
        console.log('\nالأعمدة المفقودة:');
        missingColumns.forEach(col => console.log(`- ${col}`));
      }
      
    } else {
      console.log('لا توجد بيانات في الجدول');
    }
    
  } catch (error) {
    console.error('خطأ:', error);
  }
}

checkActualColumns();