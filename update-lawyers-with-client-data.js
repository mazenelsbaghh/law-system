import { createClient } from '@supabase/supabase-js';

// إعداد Supabase
const supabaseUrl = 'https://vvcwnokwrtyykfjimvgm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY';
const supabase = createClient(supabaseUrl, supabaseKey);

// بيانات العملاء مع تصحيح أرقام الهواتف
const clientsData = [
  {
    date: '2024-06-03',
    name: 'هارون',
    mobile: '+201062546455',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-06-17',
    name: 'محمد ابراهيم',
    mobile: '+201063131642',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 5,
    remainingCases: 0
  },
  {
    date: '2024-06-18',
    name: 'وسام',
    mobile: '+201001755770',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-06-20',
    name: 'محمد سامى',
    mobile: '+201025333333',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-06-29',
    name: 'محمد ياسين',
    mobile: '+201226996026',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-05-02',
    name: 'محمود محمد ابوالفتوح',
    mobile: '+201289097335',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 3,
    remainingCases: 2
  },
  {
    date: '2024-04-15',
    name: 'خالد',
    mobile: '+201020759107',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 500,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 5,
    remainingCases: 0
  },
  {
    date: '2024-05-31',
    name: 'اسلام',
    mobile: '+201211195381',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 200,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-06-03',
    name: 'عبد الحميد منصور',
    mobile: '+201098262529',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-05-03',
    name: 'محامى طارق',
    mobile: '+201288242805',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-05-05',
    name: 'محمود النمس',
    mobile: '+201141157262',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 1,
    remainingCases: 4
  },
  {
    date: '2024-05-17',
    name: 'احمد شريف',
    mobile: '+201050706027',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 500,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 5,
    remainingCases: 0
  },
  {
    date: '2024-05-19',
    name: 'اكرم مصطفى',
    mobile: '+201008974477',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 550,
    sendMethod: 'واتس',
    totalCases: 6,
    consumedCases: 6,
    remainingCases: 0
  },
  {
    date: '2024-05-27',
    name: 'احمد عبد العزيز',
    mobile: '+201007217898',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 300,
    sendMethod: 'واتس',
    totalCases: 2,
    consumedCases: 2,
    remainingCases: 0
  },
  {
    date: '2024-05-27',
    name: 'اسلام ابو جبل',
    mobile: '+201005533572',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 4,
    remainingCases: 1
  },
  {
    date: '2024-05-30',
    name: 'احمد ابو الوفا',
    mobile: '+201004402485',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 5,
    remainingCases: 0
  },
  {
    date: null,
    name: 'صاحب اشرف',
    mobile: '+201272607926',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-06-29',
    name: 'احمد سلامه',
    mobile: '+201093750911',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 200,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-06-30',
    name: 'عبدالله زينهم',
    mobile: '+201064365320',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-06-30',
    name: 'احمد محمود',
    mobile: '+201276997470',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 5,
    remainingCases: 0
  },
  {
    date: '2024-07-01',
    name: 'شيماء مصطفى بكرى',
    mobile: '+201221914175',
    governorate: 'الاسماعلية',
    gender: 'انثى',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 2,
    remainingCases: 3
  },
  {
    date: '2024-07-04',
    name: 'علاء المالكى',
    mobile: '+201031277891',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 900,
    sendMethod: 'واتس',
    totalCases: 7,
    consumedCases: 7,
    remainingCases: 0
  },
  {
    date: '2024-07-05',
    name: 'محمد فاروق',
    mobile: '+201227490166',
    governorate: 'القاهرة',
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-07-08',
    name: 'محمد علام',
    mobile: '+201112772799',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 5,
    remainingCases: 0
  },
  {
    date: '2024-07-16',
    name: 'صلاح الصاوي',
    mobile: '+201005136764',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 200,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-07-19',
    name: 'صبري عماد',
    mobile: '+201010556923',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 500,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 3,
    remainingCases: 2
  },
  {
    date: '2024-07-21',
    name: 'وحيد الكلاني',
    mobile: '+201276444114',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 300,
    sendMethod: 'واتس',
    totalCases: 2,
    consumedCases: 2,
    remainingCases: 0
  },
  {
    date: '2024-07-25',
    name: 'عماد',
    mobile: '+201120915557',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-07-25',
    name: 'علاء عطالله',
    mobile: '+201022262755',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 4,
    remainingCases: 1
  },
  {
    date: '2024-07-20',
    name: 'صبري',
    mobile: '+201113293409',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-07-20',
    name: 'لينا',
    mobile: '+201032909479',
    governorate: null,
    gender: 'انثى',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-07-31',
    name: 'محمد سيد',
    mobile: '+201002113403',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 4,
    remainingCases: 1
  },
  {
    date: '2024-08-04',
    name: 'فاطمه محمد',
    mobile: '+201001434161',
    governorate: null,
    gender: 'انثى',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 3,
    consumedCases: 3,
    remainingCases: 0
  },
  {
    date: '2024-08-04',
    name: 'ميخائيل شاروبيم',
    mobile: '+201220572262',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 400,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 2,
    remainingCases: 3
  },
  {
    date: '2024-08-05',
    name: 'احمد حسنى',
    mobile: '+201031391972',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 200,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-08-07',
    name: 'ابراهيم حسن',
    mobile: '+201140066926',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 200,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-08-10',
    name: 'محمد الرملي',
    mobile: '+201063083050',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-08-11',
    name: 'محمد ربيع',
    mobile: '+201118102614',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 150,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  },
  {
    date: '2024-08-11',
    name: 'صباح حكيم',
    mobile: '+201069025663',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 200,
    sendMethod: 'واتس',
    totalCases: 5,
    consumedCases: 2,
    remainingCases: 3
  },
  {
    date: '2024-08-11',
    name: 'كاريم جمال',
    mobile: '+201110383629',
    governorate: null,
    gender: 'ذكر',
    subscriptionAmount: 200,
    sendMethod: 'واتس',
    totalCases: 1,
    consumedCases: 1,
    remainingCases: 0
  }
];

// دالة لتحديث بيانات المحامين بناءً على بيانات العملاء
async function updateLawyersWithClientData() {
  try {
    console.log('بدء تحديث بيانات المحامين...');
    
    // الحصول على جميع المحامين الحاليين
    const { data: lawyers, error: lawyersError } = await supabase
      .from('lawyers')
      .select('*');
    
    if (lawyersError) {
      console.error('خطأ في الحصول على بيانات المحامين:', lawyersError);
      return;
    }
    
    console.log(`تم العثور على ${lawyers.length} محامي`);
    
    // تحديث بيانات المحامين بناءً على بيانات العملاء
    for (let i = 0; i < Math.min(lawyers.length, clientsData.length); i++) {
      const lawyer = lawyers[i];
      const client = clientsData[i];
      
      // تحديث بيانات المحامي
      const { data, error } = await supabase
        .from('lawyers')
        .update({
          phone: client.mobile,
          governorate: client.governorate || lawyer.governorate,
          cases: client.totalCases,
          revenue: client.subscriptionAmount,
          subscribed: true,
          subscription_date: client.date
        })
        .eq('id', lawyer.id);
      
      if (error) {
        console.error(`خطأ في تحديث المحامي ${lawyer.name}:`, error);
      } else {
        console.log(`تم تحديث المحامي ${lawyer.name} بنجاح`);
      }
    }
    
    // عرض إجمالي عدد المحامين المحدثين
    const { count, error: countError } = await supabase
      .from('lawyers')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('خطأ في عد المحامين:', countError);
    } else {
      console.log(`إجمالي عدد المحامين في قاعدة البيانات: ${count}`);
    }
    
    console.log('تم تحديث جميع بيانات المحامين بنجاح!');
  } catch (error) {
    console.error('خطأ عام:', error);
  }
}

// تشغيل الدالة
updateLawyersWithClientData();