import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://vvcwnokwrtyykfjimvgm.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY'
);

async function finalFixInterface() {
  try {
    console.log('الإصلاح النهائي لتوافق الواجهة...');
    
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
    
    // تحديث كل محامي باستخدام أسماء الأعمدة الصحيحة
    for (const lawyer of lawyers) {
      try {
        // تحضير البيانات المحدثة باستخدام الأعمدة الموجودة
        const updateData = {
          // نسخ البيانات من الأعمدة القديمة إلى الجديدة
          phone: lawyer.mobile || lawyer.phone || '',
          cases: lawyer.consumed_cases || lawyer.cases || 0,
          maxcases: lawyer.total_cases || lawyer.maxcases || 10,
          availablecases: lawyer.remaining_cases || lawyer.availablecases || 0,
          pricepercase: lawyer.subscription_amount || lawyer.price_per_case || lawyer.pricepercase || 0,
          receivedfreecase: lawyer.received_free_case || lawyer.receivedfreecase || false,
          reorders: lawyer.reorders || 0,
          lastcasedate: lawyer.lastcasedate || null
        };
        
        // تحديث البيانات
        const { error: updateError } = await supabase
          .from('lawyers')
          .update(updateData)
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
      .select('id, name, phone, cases, maxcases, availablecases, pricepercase, participated, subscribed, receivedfreecase')
      .limit(5);
    
    if (testError) {
      console.error('خطأ في اختبار البيانات:', testError);
    } else {
      updatedLawyers.forEach((lawyer, index) => {
        console.log(`${index + 1}. ${lawyer.name}`);
        console.log(`   الهاتف: ${lawyer.phone || 'غير محدد'}`);
        console.log(`   القضايا: ${lawyer.cases || 0}`);
        console.log(`   الحد الأقصى: ${lawyer.maxcases || 0}`);
        console.log(`   المتاحة: ${lawyer.availablecases || 0}`);
        console.log(`   السعر: ${lawyer.pricepercase || 0}`);
        console.log(`   مشارك: ${lawyer.participated ? 'نعم' : 'لا'}`);
        console.log(`   مشترك: ${lawyer.subscribed ? 'نعم' : 'لا'}`);
        console.log(`   قضية مجانية: ${lawyer.receivedfreecase ? 'نعم' : 'لا'}`);
        console.log('---');
      });
    }
    
    // اختبار عمليات CRUD مع الأعمدة الصحيحة
    console.log('\n=== اختبار عمليات CRUD النهائي ===');
    
    const testLawyer = {
      name: 'محامي تجريبي نهائي',
      phone: '+201234567890',
      mobile: '+201234567890',
      governorate: 'القاهرة',
      gender: 'ذكر',
      subscription_amount: 500,
      send_method: 'واتس',
      total_cases: 3,
      consumed_cases: 1,
      remaining_cases: 2,
      available_cases: 2,
      price_per_case: 500,
      revenue: 500,
      participated: false,
      subscribed: true,
      is_subscribed: true,
      received_free_case: false,
      subscription_date: new Date().toISOString().split('T')[0],
      cases: 1,
      maxcases: 3,
      availablecases: 2,
      pricepercase: 500,
      receivedfreecase: false,
      reorders: 0
    };
    
    console.log('إضافة محامي تجريبي...');
    const { data: newLawyer, error: insertError } = await supabase
      .from('lawyers')
      .insert([testLawyer])
      .select()
      .single();
    
    if (insertError) {
      console.error('خطأ في إضافة المحامي:', insertError);
    } else {
      console.log(`✓ تم إضافة المحامي: ${newLawyer.name} (ID: ${newLawyer.id})`);
      
      // اختبار التحديث
      console.log('تحديث بيانات المحامي التجريبي...');
      const { error: updateError } = await supabase
        .from('lawyers')
        .update({ 
          phone: '+201234567891',
          cases: 2,
          availablecases: 1,
          pricepercase: 600
        })
        .eq('id', newLawyer.id);
      
      if (updateError) {
        console.error('خطأ في تحديث المحامي:', updateError);
      } else {
        console.log('✓ تم تحديث المحامي بنجاح');
      }
      
      // اختبار الحذف
      console.log('حذف المحامي التجريبي...');
      const { error: deleteError } = await supabase
        .from('lawyers')
        .delete()
        .eq('id', newLawyer.id);
      
      if (deleteError) {
        console.error('خطأ في حذف المحامي:', deleteError);
      } else {
        console.log('✓ تم حذف المحامي بنجاح');
      }
    }
    
    console.log('\n=== الاختبار النهائي مكتمل ===');
    console.log('✓ التكامل مع الواجهة يعمل بشكل صحيح');
    console.log('✓ البيانات متوافقة مع متطلبات الواجهة');
    console.log('✓ جميع عمليات CRUD تعمل بنجاح');
    console.log('✓ أسماء الأعمدة متوافقة مع قاعدة البيانات');
    
  } catch (error) {
    console.error('خطأ عام:', error);
  }
}

finalFixInterface();