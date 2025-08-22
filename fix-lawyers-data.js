import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://vvcwnokwrtyykfjimvgm.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY'
);

async function fixLawyersData() {
  try {
    console.log('جاري إصلاح بيانات المحامين...');
    
    // جلب البيانات الحالية
    const { data: currentLawyers, error: fetchError } = await supabase
      .from('lawyers')
      .select('*');
    
    if (fetchError) {
      console.error('خطأ في جلب البيانات:', fetchError);
      return;
    }
    
    console.log(`تم العثور على ${currentLawyers.length} محامي`);
    
    // تحديث البيانات لتتوافق مع الواجهة
    const updates = [];
    
    for (const lawyer of currentLawyers) {
      const updatedData = {
        // تأكد من وجود phone بدلاً من mobile
        phone: lawyer.mobile || lawyer.phone,
        
        // تحديث الحقول لتتوافق مع الواجهة
        cases: lawyer.total_cases || lawyer.cases || 0,
        maxCases: lawyer.total_cases || 10,
        availableCases: lawyer.remaining_cases || lawyer.available_cases || 0,
        pricePerCase: lawyer.price_per_case || lawyer.subscription_amount || 0,
        
        // تحديث الحقول المنطقية
        participated: lawyer.participated || false,
        subscribed: lawyer.subscribed || lawyer.is_subscribed || false,
        receivedFreeCase: lawyer.received_free_case || false,
        
        // تحديث التواريخ
        subscription_date: lawyer.subscription_date,
        reorder_date: lawyer.reorder_date,
        reorders: lawyer.reorders || 0,
        lastCaseDate: lawyer.last_case_date
      };
      
      updates.push({
        id: lawyer.id,
        ...updatedData
      });
    }
    
    console.log('جاري تحديث البيانات...');
    
    // تحديث كل محامي على حدة
    let successCount = 0;
    let errorCount = 0;
    
    for (const update of updates) {
      const { id, ...updateData } = update;
      
      const { error: updateError } = await supabase
        .from('lawyers')
        .update(updateData)
        .eq('id', id);
      
      if (updateError) {
        console.error(`خطأ في تحديث المحامي ${id}:`, updateError);
        errorCount++;
      } else {
        successCount++;
      }
    }
    
    console.log(`\nتم تحديث ${successCount} محامي بنجاح`);
    console.log(`فشل في تحديث ${errorCount} محامي`);
    
    // التحقق من النتائج
    const { data: updatedLawyers, error: verifyError } = await supabase
      .from('lawyers')
      .select('*')
      .limit(3);
    
    if (verifyError) {
      console.error('خطأ في التحقق:', verifyError);
    } else {
      console.log('\n=== عينة من البيانات المحدثة ===');
      updatedLawyers.forEach((lawyer, index) => {
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

fixLawyersData();