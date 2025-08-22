import { createClient } from '@supabase/supabase-js';

// إعداد Supabase
const supabaseUrl = 'https://vvcwnokwrtyykfjimvgm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY';
const supabase = createClient(supabaseUrl, supabaseKey);

// بيانات العملاء
const clientsData = [
  {
    date: '3-Jun',
    name: 'هارون',
    phone: '+20 106 254 6455',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '17-Jun',
    name: 'محمد ابراهيم',
    phone: '+20 106 313 1642',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 5,
    remaining_cases: 0
  },
  {
    date: '18-Jun',
    name: 'وسام',
    phone: '10 01755770',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'وااتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '20-Jun',
    name: 'محمد سامى',
    phone: '10 25333333',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '29-Jun',
    name: 'محمد ياسين',
    phone: '+20 122 699 6026',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '2-May',
    name: 'محمود محمد ابوالفتوح',
    phone: '+20 128 909 7335',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 3,
    remaining_cases: 0
  },
  {
    date: '15-Apr',
    name: 'خالد',
    phone: '+20 102 075 9107',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 500,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 5,
    remaining_cases: 0
  },
  {
    date: '31-May',
    name: 'اسلام',
    phone: '+20 121 119 5381',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 200,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '3-Jun',
    name: 'عبد الحميد منصور',
    phone: '-20 109 826 2529',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '3-May',
    name: 'محامى طارق',
    phone: '20 128 824 2805',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '5-May',
    name: 'محمود النمس',
    phone: '-20 114 115 7262',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 1,
    remaining_cases: 4
  },
  {
    date: '17-May',
    name: 'احمد شريف',
    phone: '20 105 070 6027',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 500,
    contact_method: 'ةاتس',
    total_cases: 5,
    used_cases: 5,
    remaining_cases: 0
  },
  {
    date: '19-May',
    name: 'اكرم مصطفى',
    phone: '20 100 897 4477',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 550,
    contact_method: 'واتس',
    total_cases: 6,
    used_cases: 6,
    remaining_cases: 0
  },
  {
    date: '27-May',
    name: 'احمد عبد العزيز',
    phone: '0100 721 7898',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 300,
    contact_method: 'واتس',
    total_cases: 2,
    used_cases: 2,
    remaining_cases: 0
  },
  {
    date: '27-May',
    name: 'اسلام ابو جبل',
    phone: '+20 100 553 3572',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 4,
    remaining_cases: 1
  },
  {
    date: '30-May',
    name: 'احمد ابو الوفا',
    phone: '+20 10 04402485',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 5,
    remaining_cases: 0
  },
  {
    date: '',
    name: 'صاحب اشرف',
    phone: '201272607926',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '29-Jun',
    name: 'احمد سلامه',
    phone: '+20 109 375 0911',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 200,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '30-Jun',
    name: 'عبدالله زينهم',
    phone: '+20 106 436 5320',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '30-Jun',
    name: 'احمد محمود',
    phone: '+20 127 699 7470',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 5,
    remaining_cases: 0
  },
  {
    date: '1-Jul',
    name: 'شيماء مصطفى بكرى',
    phone: '+20 122 191 4175',
    governorate: 'الاسماعلية',
    gender: 'انثى',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 2,
    remaining_cases: 3
  },
  {
    date: '4-Jul',
    name: 'علاء المالكى',
    phone: '+20 10 31277891',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 900,
    contact_method: 'واتس',
    total_cases: 7,
    used_cases: 7,
    remaining_cases: 0
  },
  {
    date: '5-Jul',
    name: 'محمد فاروق',
    phone: '+20 122 749 0166',
    governorate: 'القاهرة',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '8-Jul',
    name: 'محمد علام',
    phone: '+20 111 277 2799',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 5,
    remaining_cases: 0
  },
  {
    date: '16-Jul',
    name: 'صلاح الصاوي',
    phone: '+20 100 513 6764',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 200,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '19-Jul',
    name: 'صبري عماد',
    phone: '+20 101 055 6923',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 500,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 3,
    remaining_cases: 2
  },
  {
    date: '21-Jul',
    name: 'وحيد الكلاني',
    phone: '+20 127 644 4114',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 300,
    contact_method: 'واتس',
    total_cases: 2,
    used_cases: 2,
    remaining_cases: 0
  },
  {
    date: '25-Jul',
    name: 'عماد',
    phone: '+20 112 091 5557',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '25-Jul',
    name: 'علاء عطالله',
    phone: '+20 102 226 2755',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 4,
    remaining_cases: 1
  },
  {
    date: '20-Jul',
    name: 'صبري',
    phone: '+20 111 329 3409',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '20-Jul',
    name: 'لينا',
    phone: '+20 103 290 9479',
    governorate: '',
    gender: 'انثي',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '31-Jul',
    name: 'محمد سيد',
    phone: '+20 100 211 3403',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 4,
    remaining_cases: 1
  },
  {
    date: '4-Aug',
    name: 'فاطمه محمد',
    phone: '+20 10 01434161',
    governorate: '',
    gender: 'انثى',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 3,
    used_cases: 3,
    remaining_cases: 0
  },
  {
    date: '4-Aug',
    name: 'ميخائيل شاروبيم',
    phone: '+20 12 20572262',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 400,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 2,
    remaining_cases: 3
  },
  {
    date: '5-Aug',
    name: 'احمد حسنى',
    phone: '+20 10 31391972',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 200,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '7-Aug',
    name: 'ابراهيم حسن',
    phone: '+20 114 006 6926',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 200,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '10-Aug',
    name: 'محمد الرملي',
    phone: '+20 10 63083050',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '11-Aug',
    name: 'محمد ربيع',
    phone: '+20 11 18102614',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 150,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  },
  {
    date: '11-Aug',
    name: 'صباح حكيم',
    phone: '+20 10 69025663',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 200,
    contact_method: 'واتس',
    total_cases: 5,
    used_cases: 2,
    remaining_cases: 3
  },
  {
    date: '11-Aug',
    name: 'كاريم جمال',
    phone: '+20 11 10383629',
    governorate: '',
    gender: 'ذكر',
    subscription_fee: 200,
    contact_method: 'واتس',
    total_cases: 1,
    used_cases: 1,
    remaining_cases: 0
  }
];

async function insertClientsData() {
  console.log('بدء إدراج بيانات العملاء...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const client of clientsData) {
    try {
      // تحويل التاريخ إلى تنسيق صحيح
      let subscriptionDate = null;
      if (client.date) {
        subscriptionDate = new Date(client.date + ', 2024').toISOString();
      }
      
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: client.name,
          mobile: client.phone,
          governorate: client.governorate || null,
          gender: client.gender,
          subscription_amount: client.subscription_fee,
          send_method: client.contact_method,
          total_cases: client.total_cases,
          consumed_cases: client.used_cases,
          remaining_cases: client.remaining_cases,
          subscription_date: subscriptionDate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error(`خطأ في إدراج العميل ${client.name}:`, error);
        errorCount++;
      } else {
        console.log(`تم إدراج العميل ${client.name} بنجاح`);
        successCount++;
      }
    } catch (err) {
      console.error(`خطأ غير متوقع في إدراج العميل ${client.name}:`, err);
      errorCount++;
    }
  }
  
  console.log('\nملخص النتائج:');
  console.log(`عدد العملاء المدرجين بنجاح: ${successCount}`);
  console.log(`عدد الأخطاء: ${errorCount}`);
  console.log(`إجمالي العملاء: ${clientsData.length}`);
  
  // التحقق من البيانات المدرجة
  console.log('\nالتحقق من البيانات المدرجة...');
  const { data: clients, error: fetchError } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (fetchError) {
    console.error('خطأ في جلب البيانات:', fetchError);
  } else {
    console.log(`عدد العملاء في قاعدة البيانات: ${clients.length}`);
    
    // إحصائيات
    const totalSubscriptionFees = clients.reduce((sum, client) => sum + (client.subscription_fee || 0), 0);
    const totalCases = clients.reduce((sum, client) => sum + (client.total_cases || 0), 0);
    const totalUsedCases = clients.reduce((sum, client) => sum + (client.used_cases || 0), 0);
    const totalRemainingCases = clients.reduce((sum, client) => sum + (client.remaining_cases || 0), 0);
    
    console.log('\nالإحصائيات:');
    console.log(`إجمالي رسوم الاشتراك: ${totalSubscriptionFees} جنيه`);
    console.log(`إجمالي القضايا: ${totalCases}`);
    console.log(`القضايا المستخدمة: ${totalUsedCases}`);
    console.log(`القضايا المتبقية: ${totalRemainingCases}`);
    
    // أحدث 5 عملاء
    console.log('\nأحدث 5 عملاء:');
    clients.slice(0, 5).forEach(client => {
      console.log(`- ${client.name} (${client.phone}) - القضايا: ${client.used_cases}/${client.total_cases} - الباقي: ${client.remaining_cases}`);
    });
  }
  
  console.log('\nتم إكمال جميع العمليات!');
}

// تشغيل الدالة
insertClientsData().catch(console.error);