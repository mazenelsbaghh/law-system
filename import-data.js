import { createClient } from '@supabase/supabase-js';

// قراءة متغيرات البيئة
const supabaseUrl = 'https://vvcwnokwrtyykfjimvgm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// بيانات المحامين مع القضايا المتاحة
const lawyersData = [
  { name: 'هارون', phone: '+20 10 01234567', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, availableCases: 1, subscription_date: '2024-04-15' },
  { name: 'محمد ابراهيم', phone: '+20 11 98765432', governorate: 'غير محدد', cases: 2, revenue: 300, participated: true, subscribed: true, subscription_date: '2024-04-20' },
  { name: 'وسام', phone: '+20 12 11223344', governorate: 'غير محدد', cases: 0, revenue: 150, participated: true, subscribed: true, subscription_date: '2024-04-25' },
  { name: 'محمد سامى', phone: '+20 10 55667788', governorate: 'غير محدد', cases: 1, revenue: 250, participated: true, subscribed: true, subscription_date: '2024-05-01' },
  { name: 'محمد ياسين', phone: '+20 11 99887766', governorate: 'غير محدد', cases: 3, revenue: 450, participated: true, subscribed: true, subscription_date: '2024-05-05' },
  { name: 'محمود محمد ابوالفتوح', phone: '+20 12 33445566', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-05-10' },
  { name: 'خالد', phone: '+20 10 77889900', governorate: 'غير محدد', cases: 2, revenue: 350, participated: true, subscribed: true, subscription_date: '2024-05-15' },
  { name: 'اسلام', phone: '+20 11 22334455', governorate: 'غير محدد', cases: 1, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-05-20' },
  { name: 'عبد الحميد منصور', phone: '+20 12 66778899', governorate: 'غير محدد', cases: 0, revenue: 150, participated: true, subscribed: true, subscription_date: '2024-05-25' },
  { name: 'محامى طارق', phone: '+20 10 44556677', governorate: 'غير محدد', cases: 4, revenue: 600, participated: true, subscribed: true, subscription_date: '2024-06-01' },
  { name: 'محمود النمس', phone: '+20 11 88990011', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-06-05' },
  { name: 'احمد شريف', phone: '+20 12 55443322', governorate: 'غير محدد', cases: 2, revenue: 300, participated: true, subscribed: true, subscription_date: '2024-06-10' },
  { name: 'اكرم مصطفى', phone: '+20 10 99887755', governorate: 'غير محدد', cases: 1, revenue: 150, participated: true, subscribed: true, subscription_date: '2024-06-15' },
  { name: 'احمد عبد العزيز', phone: '+20 11 33221100', governorate: 'غير محدد', cases: 3, revenue: 450, participated: true, subscribed: true, subscription_date: '2024-06-20' },
  { name: 'اسلام ابو جبل', phone: '+20 12 77665544', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-06-25' },
  { name: 'احمد ابو الوفا', phone: '+20 10 11009988', governorate: 'غير محدد', cases: 2, revenue: 350, participated: true, subscribed: true, subscription_date: '2024-07-01' },
  { name: 'صاحب اشرف', phone: '+20 11 55443366', governorate: 'غير محدد', cases: 1, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-07-05' },
  { name: 'احمد سلامه', phone: '+20 12 99776655', governorate: 'غير محدد', cases: 0, revenue: 150, participated: true, subscribed: true, subscription_date: '2024-07-10' },
  { name: 'عبدالله زينهم', phone: '+20 10 33445577', governorate: 'غير محدد', cases: 4, revenue: 600, participated: true, subscribed: true, subscription_date: '2024-07-15' },
  { name: 'احمد محمود', phone: '+20 11 77889911', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-07-20' },
  { name: 'شيماء مصطفى بكرى', phone: '+20 12 22113344', governorate: 'غير محدد', cases: 2, revenue: 300, participated: true, subscribed: true, subscription_date: '2024-07-25' },
  { name: 'علاء المالكى', phone: '+20 10 66554433', governorate: 'غير محدد', cases: 1, revenue: 150, participated: true, subscribed: true, subscription_date: '2024-08-01' },
  { name: 'محمد فاروق', phone: '+20 11 00998877', governorate: 'غير محدد', cases: 3, revenue: 450, participated: true, subscribed: true, subscription_date: '2024-08-02' },
  { name: 'محمد علام', phone: '+20 12 44332211', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-08-03' },
  { name: 'صلاح الصاوي', phone: '+20 10 88776655', governorate: 'غير محدد', cases: 2, revenue: 350, participated: true, subscribed: true, subscription_date: '2024-08-04' },
  { name: 'صبري عماد', phone: '+20 11 22110099', governorate: 'غير محدد', cases: 1, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-08-04' },
  { name: 'وحيد الكلاني', phone: '+20 12 66554477', governorate: 'غير محدد', cases: 0, revenue: 150, participated: true, subscribed: true, subscription_date: '2024-08-04' },
  { name: 'عماد', phone: '+20 10 00887766', governorate: 'غير محدد', cases: 4, revenue: 600, participated: true, subscribed: true, subscription_date: '2024-08-04' },
  { name: 'علاء عطالله', phone: '+20 11 44221100', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-08-04' },
  { name: 'صبري', phone: '+20 12 88665544', governorate: 'غير محدد', cases: 2, revenue: 300, participated: true, subscribed: true, subscription_date: '2024-08-04' },
  { name: 'لينا', phone: '+20 10 22009988', governorate: 'غير محدد', cases: 1, revenue: 150, participated: true, subscribed: true, subscription_date: '2024-08-04' },
  { name: 'محمد سيد', phone: '+20 11 66443322', governorate: 'غير محدد', cases: 3, revenue: 450, participated: true, subscribed: true, subscription_date: '2024-08-04' },
  { name: 'فاطمه محمد', phone: '+20 12 00776655', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-08-04' },
  { name: 'ميخائيل شاروبيم', phone: '+20 12 20572262', governorate: 'غير محدد', cases: 3, revenue: 400, participated: true, subscribed: true, subscription_date: '2024-08-04' },
  { name: 'احمد حسنى', phone: '+20 10 31391972', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-08-05' },
  { name: 'ابراهيم حسن', phone: '+20 114 006 6926', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-08-07' },
  { name: 'محمد الرملي', phone: '+20 10 63083050', governorate: 'غير محدد', cases: 0, revenue: 150, participated: true, subscribed: true, subscription_date: '2024-08-10' },
  { name: 'محمد ربيع', phone: '+20 11 18102614', governorate: 'غير محدد', cases: 0, revenue: 150, participated: true, subscribed: true, subscription_date: '2024-08-11' },
  { name: 'صباح حكيم', phone: '+20 10 69025663', governorate: 'غير محدد', cases: 3, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-08-11' },
  { name: 'كاريم جمال', phone: '+20 11 10383629', governorate: 'غير محدد', cases: 0, revenue: 200, participated: true, subscribed: true, subscription_date: '2024-08-11' }
];

async function importLawyers() {
  try {
    console.log('بدء عملية إدراج البيانات...');
    
    const { data, error } = await supabase
      .from('lawyers')
      .insert(lawyersData);
    
    if (error) {
      console.error('خطأ في إدراج البيانات:', error);
      return;
    }
    
    console.log('تم إدراج البيانات بنجاح!');
    
    // التحقق من عدد المحامين في قاعدة البيانات
    const { count, error: countError } = await supabase
      .from('lawyers')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('خطأ في عد المحامين:', countError);
    } else {
      console.log(`إجمالي عدد المحامين في قاعدة البيانات: ${count}`);
    }
    
  } catch (error) {
    console.error('خطأ عام:', error);
  }
}

importLawyers();