import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://vvcwnokwrtyykfjimvgm.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY'
);

async function fixColumnMapping() {
  try {
    console.log('إصلاح توافق الأعمدة مع الواجهة...');
    
    // جلب جميع المحامين
    const { data: lawyers, error: fetchError } = await supabase
      .from('lawyers')
      .select('*');
    
    if (fetchError) {
      console.error('خطأ في جلب البيانات:', fetchError);
      return;
    }
    
    console.log(`تم جلب ${lawyers.length} محامي`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // تحديث كل محامي بالأعمدة الصحيحة
    for (const lawyer of lawyers) {
      try {
        // تحضير البيانات المحدثة باستخدام الأعمدة الموجودة فقط
        const updateData = {
          // استخدام الأعمدة الموجودة بالفعل
          phone: lawyer.phone || lawyer.mobile || '',
          cases: lawyer.cases || lawyer.total_cases || lawyer.consumed_cases || 0,
          maxCases: lawyer.maxCases || lawyer.total_cases || 10,
          pricePerCase: lawyer.pricePerCase || lawyer.subscription_amount || lawyer.price_per_case || 0,
          participated: lawyer.participated || false,
          subscribed: lawyer.subscribed || lawyer.is_subscribed || false,
          receivedFreeCase: lawyer.receivedFreeCase || lawyer.received_free_case || false,
          reorders: lawyer.reorders || 0,
          lastCaseDate: lawyer.lastCaseDate || lawyer.last_case_date || null
        };
        
        // حساب القضايا المتاحة
        const availableCases = Math.max(0, (updateData.maxCases || 0) - (updateData.cases || 0));
        
        // تحديث البيانات باستخدام الأعمدة الأساسية فقط
        const { error: updateError } = await supabase
          .from('lawyers')
          .update({
            phone: updateData.phone,
            cases: updateData.cases,
            maxCases: updateData.maxCases,
            pricePerCase: updateData.pricePerCase,
            participated: updateData.participated,
            subscribed: updateData.subscribed,
            receivedFreeCase: updateData.receivedFreeCase,
            reorders: updateData.reorders,
            remaining_cases: availableCases // استخدام العمود الموجود
          })
          .eq('id', lawyer.id);
        
        if (updateError) {
          console.error(`خطأ في تحديث المحامي ${lawyer.name}:`, updateError.message);
          errorCount++;
        } else {
          successCount++;
        }
        
      } catch (error) {
        console.error(`خطأ في معالجة المحامي ${lawyer.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\nتم تحديث ${successCount} محامي بنجاح`);
    console.log(`فشل في تحديث ${errorCount} محامي`);
    
    // اختبار البيانات المحدثة
    console.log('\n=== اختبار البيانات المحدثة ===');
    const { data: updatedLawyers, error: testError } = await supabase
      .from('lawyers')
      .select('id, name, phone, cases, maxCases, remaining_cases, pricePerCase, participated, subscribed, receivedFreeCase')
      .limit(3);
    
    if (testError) {
      console.error('خطأ في اختبار البيانات:', testError);
    } else {
      updatedLawyers.forEach((lawyer, index) => {
        console.log(`${index + 1}. ${lawyer.name}`);
        console.log(`   الهاتف: ${lawyer.phone || 'غير محدد'}`);
        console.log(`   القضايا: ${lawyer.cases || 0}`);
        console.log(`   الحد الأقصى: ${lawyer.maxCases || 0}`);
        console.log(`   المتبقية: ${lawyer.remaining_cases || 0}`);
        console.log(`   السعر: ${lawyer.pricePerCase || 0}`);
        console.log(`   مشارك: ${lawyer.participated ? 'نعم' : 'لا'}`);
        console.log(`   مشترك: ${lawyer.subscribed ? 'نعم' : 'لا'}`);
        console.log('---');
      });
    }
    
    console.log('\n✓ تم إصلاح توافق الأعمدة مع الواجهة');
    
  } catch (error) {
    console.error('خطأ عام:', error);
  }
}

fixColumnMapping();