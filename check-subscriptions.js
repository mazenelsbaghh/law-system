import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vvcwnokwrtyykfjimvgm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubscriptions() {
  console.log('التحقق من حالة الاشتراك للمحامين...');
  
  const { data, error } = await supabase
    .from('lawyers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('خطأ في استرجاع البيانات:', error.message);
    return;
  }
  
  console.log(`\nإجمالي المحامين في قاعدة البيانات: ${data.length}`);
  
  // فحص الأعمدة المتاحة
  if (data.length > 0) {
    console.log('\nالأعمدة المتاحة في جدول المحامين:');
    console.log(Object.keys(data[0]).join(', '));
    
    // عرض أول 10 محامين مع جميع بياناتهم
    console.log('\nأول 10 محامين مع جميع البيانات:');
    data.slice(0, 10).forEach((lawyer, index) => {
      console.log(`\n${index + 1}. ${lawyer.name}`);
      console.log(`   الهاتف: ${lawyer.phone}`);
      console.log(`   المحافظة: ${lawyer.governorate}`);
      console.log(`   القضايا: ${lawyer.cases}`);
      console.log(`   الإيرادات: ${lawyer.revenue}`);
      console.log(`   تاريخ الاشتراك: ${lawyer.subscription_date || 'غير محدد'}`);
      console.log(`   تاريخ الإنشاء: ${lawyer.created_at}`);
    });
    
    // إحصائيات
    const withSubscriptionDate = data.filter(l => l.subscription_date).length;
    const withoutSubscriptionDate = data.filter(l => !l.subscription_date).length;
    
    console.log(`\n📊 الإحصائيات:`);
    console.log(`المحامين الذين لديهم تاريخ اشتراك: ${withSubscriptionDate}`);
    console.log(`المحامين الذين ليس لديهم تاريخ اشتراك: ${withoutSubscriptionDate}`);
    
    // عرض المحامين بدون تاريخ اشتراك
    if (withoutSubscriptionDate > 0) {
      console.log('\n⚠️ المحامين بدون تاريخ اشتراك:');
      data.filter(l => !l.subscription_date).forEach(lawyer => {
        console.log(`- ${lawyer.name} (${lawyer.phone})`);
      });
    }
  }
}

async function main() {
  try {
    await checkSubscriptions();
    console.log('\n✅ تم إكمال فحص البيانات!');
  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

main();