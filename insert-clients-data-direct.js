import { createClient } from '@supabase/supabase-js';

// إعداد Supabase
const supabaseUrl = 'https://vvcwnokwrtyykfjimvgm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY';
const supabase = createClient(supabaseUrl, supabaseKey);

// بيانات العملاء مع تصحيح أرقام الهواتف
const clientsData = [
  {
    subscription_date: '2024-06-03',
    name: 'هارون',
    mobile: '+201062546455',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-06-17',
    name: 'محمد ابراهيم',
    mobile: '+201063131642',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-06-18',
    name: 'وسام',
    mobile: '+201001755770',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-06-20',
    name: 'محمد سامى',
    mobile: '+201025333333',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-06-29',
    name: 'محمد ياسين',
    mobile: '+201226996026',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-05-02',
    name: 'محمود محمد ابوالفتوح',
    mobile: '+201289097335',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 3,
    remaining_cases: 2
  },
  {
    subscription_date: '2024-04-15',
    name: 'خالد',
    mobile: '+201020759107',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 500,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-05-31',
    name: 'اسلام',
    mobile: '+201211195381',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-06-03',
    name: 'عبد الحميد منصور',
    mobile: '+201098262529',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-05-03',
    name: 'محامى طارق',
    mobile: '+201288242805',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-05-05',
    name: 'محمود النمس',
    mobile: '+201141157262',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 1,
    remaining_cases: 4
  },
  {
    subscription_date: '2024-05-17',
    name: 'احمد شريف',
    mobile: '+201050706027',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 500,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-05-19',
    name: 'اكرم مصطفى',
    mobile: '+201008974477',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 550,
    send_method: 'واتس',
    total_cases: 6,
    consumed_cases: 6,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-05-27',
    name: 'احمد عبد العزيز',
    mobile: '+201007217898',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 300,
    send_method: 'واتس',
    total_cases: 2,
    consumed_cases: 2,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-05-27',
    name: 'اسلام ابو جبل',
    mobile: '+201005533572',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 4,
    remaining_cases: 1
  },
  {
    subscription_date: '2024-05-30',
    name: 'احمد ابو الوفا',
    mobile: '+201004402485',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0
  },
  {
    subscription_date: null,
    name: 'صاحب اشرف',
    mobile: '+201272607926',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-06-29',
    name: 'احمد سلامه',
    mobile: '+201093750911',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-06-30',
    name: 'عبدالله زينهم',
    mobile: '+201064365320',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-06-30',
    name: 'احمد محمود',
    mobile: '+201276997470',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-07-01',
    name: 'شيماء مصطفى بكرى',
    mobile: '+201221914175',
    governorate: 'الاسماعلية',
    gender: 'انثى',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 2,
    remaining_cases: 3
  },
  {
    subscription_date: '2024-07-04',
    name: 'علاء المالكى',
    mobile: '+201031277891',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 900,
    send_method: 'واتس',
    total_cases: 7,
    consumed_cases: 7,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-07-05',
    name: 'محمد فاروق',
    mobile: '+201227490166',
    governorate: 'القاهرة',
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-07-08',
    name: 'محمد علام',
    mobile: '+201112772799',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-07-16',
    name: 'صلاح الصاوي',
    mobile: '+201005136764',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-07-19',
    name: 'صبري عماد',
    mobile: '+201010556923',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 500,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 3,
    remaining_cases: 2
  },
  {
    subscription_date: '2024-07-21',
    name: 'وحيد الكلاني',
    mobile: '+201276444114',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 300,
    send_method: 'واتس',
    total_cases: 2,
    consumed_cases: 2,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-07-25',
    name: 'عماد',
    mobile: '+201120915557',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-07-25',
    name: 'علاء عطالله',
    mobile: '+201022262755',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 4,
    remaining_cases: 1
  },
  {
    subscription_date: '2024-07-20',
    name: 'صبري',
    mobile: '+201113293409',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-07-20',
    name: 'لينا',
    mobile: '+201032909479',
    governorate: null,
    gender: 'انثى',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-07-31',
    name: 'محمد سيد',
    mobile: '+201002113403',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 4,
    remaining_cases: 1
  },
  {
    subscription_date: '2024-08-04',
    name: 'فاطمه محمد',
    mobile: '+201001434161',
    governorate: null,
    gender: 'انثى',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 3,
    consumed_cases: 3,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-08-04',
    name: 'ميخائيل شاروبيم',
    mobile: '+201220572262',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 2,
    remaining_cases: 3
  },
  {
    subscription_date: '2024-08-05',
    name: 'احمد حسنى',
    mobile: '+201031391972',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-08-07',
    name: 'ابراهيم حسن',
    mobile: '+201140066926',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-08-10',
    name: 'محمد الرملي',
    mobile: '+201063083050',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-08-11',
    name: 'محمد ربيع',
    mobile: '+201118102614',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  },
  {
    subscription_date: '2024-08-11',
    name: 'صباح حكيم',
    mobile: '+201069025663',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 2,
    remaining_cases: 3
  },
  {
    subscription_date: '2024-08-11',
    name: 'كاريم جمال',
    mobile: '+201110383629',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0
  }
];

// دالة لإدراج بيانات العملاء
async function insertClientsData() {
  try {
    console.log('بدء إدراج بيانات العملاء...');
    
    // إدراج البيانات في دفعات صغيرة لتجنب الأخطاء
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < clientsData.length; i += batchSize) {
      const batch = clientsData.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('clients')
        .insert(batch);
      
      if (error) {
        console.error(`خطأ في إدراج الدفعة ${Math.floor(i/batchSize) + 1}:`, error);
        errorCount += batch.length;
      } else {
        console.log(`تم إدراج الدفعة ${Math.floor(i/batchSize) + 1} بنجاح (${batch.length} عميل)`);
        successCount += batch.length;
      }
    }
    
    // عرض إحصائيات النتائج
    console.log(`\nإحصائيات الإدراج:`);
    console.log(`- تم إدراج ${successCount} عميل بنجاح`);
    console.log(`- فشل في إدراج ${errorCount} عميل`);
    console.log(`- إجمالي العملاء: ${clientsData.length}`);
    
    // التحقق من إجمالي عدد العملاء في قاعدة البيانات
    const { count, error: countError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('خطأ في عد العملاء:', countError);
    } else {
      console.log(`إجمالي عدد العملاء في قاعدة البيانات: ${count}`);
    }
    
    console.log('\nتم إكمال عملية إدراج بيانات العملاء!');
  } catch (error) {
    console.error('خطأ عام:', error);
  }
}

// تشغيل الدالة
insertClientsData();