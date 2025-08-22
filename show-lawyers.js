import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://vvcwnokwrtyykfjimvgm.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY'
);

async function showLawyers() {
  try {
    console.log('جاري جلب بيانات المحامين...');
    
    // جلب جميع المحامين
    const { data: lawyers, error } = await supabase
      .from('lawyers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('خطأ في جلب البيانات:', error);
      return;
    }
    
    console.log(`\nإجمالي عدد المحامين: ${lawyers.length}`);
    console.log('\n=== بيانات المحامين ===');
    
    lawyers.forEach((lawyer, index) => {
      console.log(`\n${index + 1}. ${lawyer.name}`);
      console.log(`   الهاتف: ${lawyer.mobile}`);
      console.log(`   المحافظة: ${lawyer.governorate}`);
      console.log(`   النوع: ${lawyer.gender}`);
      console.log(`   مبلغ الاشتراك: ${lawyer.subscription_amount} جنيه`);
      console.log(`   طريقة الإرسال: ${lawyer.send_method}`);
      console.log(`   إجمالي القضايا: ${lawyer.total_cases}`);
      console.log(`   القضايا المستهلكة: ${lawyer.consumed_cases}`);
      console.log(`   القضايا المتبقية: ${lawyer.remaining_cases}`);
      console.log(`   القضايا المتاحة: ${lawyer.available_cases}`);
      console.log(`   سعر القضية: ${lawyer.price_per_case} جنيه`);
      console.log(`   الإيرادات: ${lawyer.revenue} جنيه`);
      console.log(`   مشارك: ${lawyer.participated ? 'نعم' : 'لا'}`);
      console.log(`   مشترك: ${lawyer.subscribed ? 'نعم' : 'لا'}`);
      console.log(`   استلم قضية مجانية: ${lawyer.received_free_case ? 'نعم' : 'لا'}`);
      console.log(`   تاريخ الاشتراك: ${lawyer.subscription_date ? new Date(lawyer.subscription_date).toLocaleDateString('ar-EG') : 'غير محدد'}`);
      console.log(`   تاريخ الإنشاء: ${new Date(lawyer.created_at).toLocaleDateString('ar-EG')}`);
    });
    
    // إحصائيات
    const totalRevenue = lawyers.reduce((sum, lawyer) => sum + (lawyer.revenue || 0), 0);
    const totalCases = lawyers.reduce((sum, lawyer) => sum + (lawyer.total_cases || 0), 0);
    const totalConsumed = lawyers.reduce((sum, lawyer) => sum + (lawyer.consumed_cases || 0), 0);
    const totalRemaining = lawyers.reduce((sum, lawyer) => sum + (lawyer.remaining_cases || 0), 0);
    const subscribedCount = lawyers.filter(lawyer => lawyer.subscribed).length;
    
    console.log('\n=== الإحصائيات ===');
    console.log(`إجمالي الإيرادات: ${totalRevenue} جنيه`);
    console.log(`إجمالي القضايا: ${totalCases}`);
    console.log(`القضايا المستهلكة: ${totalConsumed}`);
    console.log(`القضايا المتبقية: ${totalRemaining}`);
    console.log(`عدد المشتركين: ${subscribedCount}/${lawyers.length}`);
    
  } catch (error) {
    console.error('خطأ:', error);
  }
}

showLawyers();