import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vvcwnokwrtyykfjimvgm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY';

const supabase = createClient(supabaseUrl, supabaseKey);

const lawyersData = [
  { name: 'هارون', mobile: '+201062546455', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-06-03' },
  { name: 'محمد ابراهيم', mobile: '+201063131642', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 5, remaining_cases: 0, subscription_date: '2024-06-17' },
  { name: 'وسام', mobile: '+201001755770', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-06-18' },
  { name: 'محمد سامى', mobile: '+201025333333', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-06-20' },
  { name: 'محمد ياسين', mobile: '+201226996026', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-06-29' },
  { name: 'محمود محمد ابوالفتوح', mobile: '+201289097335', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 3, remaining_cases: 2, subscription_date: '2024-05-02' },
  { name: 'خالد', mobile: '+201020759107', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 500, send_method: 'واتس', total_cases: 5, consumed_cases: 5, remaining_cases: 0, subscription_date: '2024-04-15' },
  { name: 'اسلام', mobile: '+201211195381', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 200, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-05-31' },
  { name: 'عبد الحميد منصور', mobile: '+201098262529', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-06-03' },
  { name: 'محامى طارق', mobile: '+201288242805', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-05-03' },
  { name: 'محمود النمس', mobile: '+201141157262', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 1, remaining_cases: 4, subscription_date: '2024-05-05' },
  { name: 'احمد شريف', mobile: '+201050706027', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 500, send_method: 'واتس', total_cases: 5, consumed_cases: 5, remaining_cases: 0, subscription_date: '2024-05-17' },
  { name: 'اكرم مصطفى', mobile: '+201008974477', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 550, send_method: 'واتس', total_cases: 6, consumed_cases: 6, remaining_cases: 0, subscription_date: '2024-05-19' },
  { name: 'احمد عبد العزيز', mobile: '+201007217898', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 300, send_method: 'واتس', total_cases: 2, consumed_cases: 2, remaining_cases: 0, subscription_date: '2024-05-27' },
  { name: 'اسلام ابو جبل', mobile: '+201005533572', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 4, remaining_cases: 1, subscription_date: '2024-05-27' },
  { name: 'احمد ابو الوفا', mobile: '+201004402485', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 5, remaining_cases: 0, subscription_date: '2024-05-30' },
  { name: 'صاحب اشرف', mobile: '+201272607926', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: null },
  { name: 'احمد سلامه', mobile: '+201093750911', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 200, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-06-29' },
  { name: 'عبدالله زينهم', mobile: '+201064365320', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-06-30' },
  { name: 'احمد محمود', mobile: '+201276997470', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 5, remaining_cases: 0, subscription_date: '2024-06-30' },
  { name: 'شيماء مصطفى بكرى', mobile: '+201221914175', governorate: 'الاسماعلية', gender: 'انثى', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 2, remaining_cases: 3, subscription_date: '2024-07-01' },
  { name: 'علاء المالكى', mobile: '+201031277891', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 900, send_method: 'واتس', total_cases: 7, consumed_cases: 7, remaining_cases: 0, subscription_date: '2024-07-04' },
  { name: 'محمد فاروق', mobile: '+201227490166', governorate: 'القاهرة', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-07-05' },
  { name: 'محمد علام', mobile: '+201112772799', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 5, remaining_cases: 0, subscription_date: '2024-07-08' },
  { name: 'صلاح الصاوي', mobile: '+201005136764', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 200, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-07-16' },
  { name: 'صبري عماد', mobile: '+201010556923', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 500, send_method: 'واتس', total_cases: 5, consumed_cases: 3, remaining_cases: 2, subscription_date: '2024-07-19' },
  { name: 'وحيد الكلاني', mobile: '+201276444114', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 300, send_method: 'واتس', total_cases: 2, consumed_cases: 2, remaining_cases: 0, subscription_date: '2024-07-21' },
  { name: 'عماد', mobile: '+201120915557', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-07-25' },
  { name: 'علاء عطالله', mobile: '+201022262755', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 4, remaining_cases: 1, subscription_date: '2024-07-25' },
  { name: 'صبري', mobile: '+201113293409', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-07-20' },
  { name: 'لينا', mobile: '+201032909479', governorate: 'غير محدد', gender: 'انثى', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-07-20' },
  { name: 'محمد سيد', mobile: '+201002113403', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 4, remaining_cases: 1, subscription_date: '2024-07-31' },
  { name: 'فاطمه محمد', mobile: '+201001434161', governorate: 'غير محدد', gender: 'انثى', subscription_amount: 400, send_method: 'واتس', total_cases: 3, consumed_cases: 3, remaining_cases: 0, subscription_date: '2024-08-04' },
  { name: 'ميخائيل شاروبيم', mobile: '+201220572262', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 400, send_method: 'واتس', total_cases: 5, consumed_cases: 2, remaining_cases: 3, subscription_date: '2024-08-04' },
  { name: 'احمد حسنى', mobile: '+201031391972', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 200, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-08-05' },
  { name: 'ابراهيم حسن', mobile: '+201140066926', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 200, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-08-07' },
  { name: 'محمد الرملي', mobile: '+201063083050', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-08-10' },
  { name: 'محمد ربيع', mobile: '+201118102614', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 150, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-08-11' },
  { name: 'صباح حكيم', mobile: '+201069025663', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 200, send_method: 'واتس', total_cases: 5, consumed_cases: 2, remaining_cases: 3, subscription_date: '2024-08-11' },
  { name: 'كاريم جمال', mobile: '+201110383629', governorate: 'غير محدد', gender: 'ذكر', subscription_amount: 200, send_method: 'واتس', total_cases: 1, consumed_cases: 1, remaining_cases: 0, subscription_date: '2024-08-11' }
];

async function insertLawyers() {
  console.log('بدء إدراج بيانات المحامين...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const lawyer of lawyersData) {
    try {
      // تحويل البيانات لتتناسب مع الأعمدة الأساسية الموجودة فقط
      const lawyerRecord = {
        name: lawyer.name,
        phone: lawyer.mobile,
        governorate: lawyer.governorate,
        cases: lawyer.consumed_cases,
        revenue: lawyer.subscription_amount,
        subscription_date: lawyer.subscription_date
      };
      
      const { data, error } = await supabase
        .from('lawyers')
        .insert([lawyerRecord])
        .select();
      
      if (error) {
        console.error(`خطأ في إدراج المحامي ${lawyer.name}:`, error.message);
        errorCount++;
      } else {
        console.log(`تم إدراج المحامي ${lawyer.name} بنجاح`);
        successCount++;
      }
    } catch (err) {
      console.error(`خطأ غير متوقع للمحامي ${lawyer.name}:`, err.message);
      errorCount++;
    }
  }
  
  console.log(`\nملخص النتائج:`);
  console.log(`عدد المحامين المدرجين بنجاح: ${successCount}`);
  console.log(`عدد الأخطاء: ${errorCount}`);
  console.log(`إجمالي المحامين: ${lawyersData.length}`);
}

async function verifyData() {
  console.log('\nالتحقق من البيانات المدرجة...');
  
  const { data, error } = await supabase
    .from('lawyers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('خطأ في استرجاع البيانات:', error.message);
  } else {
    console.log(`عدد المحامين في قاعدة البيانات: ${data.length}`);
    if (data.length > 0) {
      console.log('أحدث 3 محامين:');
      data.slice(0, 3).forEach(lawyer => {
        console.log(`- ${lawyer.name} (${lawyer.phone}) - القضايا: ${lawyer.cases}`);
      });
    }
  }
}

async function main() {
  try {
    await insertLawyers();
    await verifyData();
    console.log('\nتم إكمال جميع العمليات!');
  } catch (error) {
    console.error('خطأ عام:', error.message);
  }
}

main();