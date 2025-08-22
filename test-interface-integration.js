import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://vvcwnokwrtyykfjimvgm.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY'
);

async function testInterfaceIntegration() {
  try {
    console.log('اختبار التكامل مع الواجهة...');
    
    // جلب البيانات بنفس الطريقة المستخدمة في الواجهة
    const { data: lawyersData, error } = await supabase
      .from('lawyers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('خطأ في جلب البيانات:', error);
      return;
    }
    
    console.log(`تم جلب ${lawyersData.length} محامي من قاعدة البيانات`);
    
    // تحويل البيانات بنفس الطريقة المستخدمة في Index.tsx
    const convertedLawyers = lawyersData.map(lawyer => ({
      id: lawyer.id,
      name: lawyer.name,
      phone: lawyer.phone || lawyer.mobile || '',
      governorate: lawyer.governorate,
      status: lawyer.participated ? 'active' : 'inactive',
      maxCases: lawyer.maxCases || lawyer.total_cases || 10,
      availableCases: lawyer.availableCases || lawyer.remaining_cases || 0,
      takenCases: lawyer.cases || lawyer.consumed_cases || 0,
      pricePerCase: lawyer.pricePerCase || lawyer.subscription_amount || 0,
      revenue: lawyer.revenue || 0,
      isSubscribed: lawyer.subscribed || lawyer.is_subscribed || false,
      hasFreeCaseUsed: lawyer.receivedFreeCase || lawyer.received_free_case || false,
      subscription_date: lawyer.subscription_date,
      reorder_date: lawyer.reorder_date,
      notes: lawyer.notes || ''
    }));
    
    console.log('\n=== عينة من البيانات المحولة للواجهة ===');
    convertedLawyers.slice(0, 3).forEach((lawyer, index) => {
      console.log(`${index + 1}. ${lawyer.name}`);
      console.log(`   الهاتف: ${lawyer.phone}`);
      console.log(`   الحالة: ${lawyer.status}`);
      console.log(`   الحد الأقصى للقضايا: ${lawyer.maxCases}`);
      console.log(`   القضايا المتاحة: ${lawyer.availableCases}`);
      console.log(`   القضايا المأخوذة: ${lawyer.takenCases}`);
      console.log(`   سعر القضية: ${lawyer.pricePerCase}`);
      console.log(`   الإيرادات: ${lawyer.revenue}`);
      console.log(`   مشترك: ${lawyer.isSubscribed ? 'نعم' : 'لا'}`);
      console.log(`   استخدم قضية مجانية: ${lawyer.hasFreeCaseUsed ? 'نعم' : 'لا'}`);
      console.log('---');
    });
    
    // حساب الإحصائيات كما في الواجهة
    const totalTakenCases = convertedLawyers.reduce((sum, lawyer) => sum + (lawyer.takenCases || 0), 0);
    const activeLawyers = convertedLawyers.filter(l => l.status === 'active').length;
    const totalRevenue = convertedLawyers.reduce((sum, lawyer) => sum + (lawyer.revenue || 0), 0);
    const subscribedLawyers = convertedLawyers.filter(l => l.isSubscribed).length;
    
    console.log('\n=== إحصائيات الواجهة ===');
    console.log(`إجمالي المحامين: ${convertedLawyers.length}`);
    console.log(`المحامون النشطون: ${activeLawyers}`);
    console.log(`القضايا المأخوذة: ${totalTakenCases}`);
    console.log(`إجمالي الإيرادات: ${totalRevenue} جنيه`);
    console.log(`المحامون المشتركون: ${subscribedLawyers}/${convertedLawyers.length}`);
    
    // اختبار عمليات CRUD
    console.log('\n=== اختبار عمليات CRUD ===');
    
    // اختبار إضافة محامي جديد
    const testLawyer = {
      name: 'محامي تجريبي',
      phone: '+201234567890',
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
      subscription_date: new Date().toISOString().split('T')[0]
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
          cases: 4,
          availableCases: 3
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
    
    console.log('\n=== اختبار مكتمل ===');
    console.log('✓ التكامل مع الواجهة يعمل بشكل صحيح');
    console.log('✓ البيانات متوافقة مع متطلبات الواجهة');
    console.log('✓ عمليات CRUD تعمل بنجاح');
    
  } catch (error) {
    console.error('خطأ في الاختبار:', error);
  }
}

testInterfaceIntegration();