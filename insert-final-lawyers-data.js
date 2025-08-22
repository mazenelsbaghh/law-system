import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vvcwnokwrtyykfjimvgm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY'
);

// بيانات المحامين النهائية
const lawyersData = [
  { date: '3-Jun', name: 'هارون', phone: '+20 106 254 6455', province: '', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '17-Jun', name: 'محمد ابراهيم', phone: '+20 106 313 1642', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 5, remaining_cases: 0 },
  { date: '18-Jun', name: 'وسام', phone: '10 01755770', province: '', gender: 'ذكر', subscription: 150, method: 'وااتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '20-Jun', name: 'محمد سامى', phone: '10 25333333', province: '', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '29-Jun', name: 'محمد ياسين', phone: '+20 122 699 6026', province: '', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '2-May', name: 'محمود محمد ابوالفتوح', phone: '+20 128 909 7335', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 3, remaining_cases: 2 },
  { date: '15-Apr', name: 'خالد', phone: '+20 102 075 9107', province: '', gender: 'ذكر', subscription: 500, method: 'واتس', total_cases: 5, taken_cases: 5, remaining_cases: 0 },
  { date: '31-May', name: 'اسلام', phone: '+20 121 119 5381', province: '', gender: 'ذكر', subscription: 200, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '3-Jun', name: 'عبد الحميد منصور', phone: '-20 109 826 2529', province: '', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '3-May', name: 'محامى طارق', phone: '20 128 824 2805', province: '', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '5-May', name: 'محمود النمس', phone: '-20 114 115 7262', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 1, remaining_cases: 4 },
  { date: '17-May', name: 'احمد شريف', phone: '20 105 070 6027', province: '', gender: 'ذكر', subscription: 500, method: 'ةاتس', total_cases: 5, taken_cases: 5, remaining_cases: 0 },
  { date: '19-May', name: 'اكرم مصطفى', phone: '20 100 897 4477', province: '', gender: 'ذكر', subscription: 550, method: 'واتس', total_cases: 6, taken_cases: 6, remaining_cases: 0 },
  { date: '27-May', name: 'احمد عبد العزيز', phone: '0100 721 7898', province: '', gender: 'ذكر', subscription: 300, method: 'واتس', total_cases: 2, taken_cases: 2, remaining_cases: 0 },
  { date: '27-May', name: 'اسلام ابو جبل', phone: '+20 100 553 3572', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 4, remaining_cases: 1 },
  { date: '30-May', name: 'احمد ابو الوفا', phone: '+20 10 04402485', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 5, remaining_cases: 0 },
  { date: '', name: 'صاحب اشرف', phone: '201272607926', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '29-Jun', name: 'احمد سلامه', phone: '+20 109 375 0911', province: '', gender: 'ذكر', subscription: 200, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '30-Jun', name: 'عبدالله زينهم', phone: '+20 106 436 5320', province: '', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '30-Jun', name: 'احمد محمود', phone: '+20 127 699 7470', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 5, remaining_cases: 0 },
  { date: '1-Jul', name: 'شيماء مصطفى بكرى', phone: '+20 122 191 4175', province: 'الاسماعلية', gender: 'انثى', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 2, remaining_cases: 3 },
  { date: '4-Jul', name: 'علاء المالكى', phone: '+20 10 31277891', province: '', gender: 'ذكر', subscription: 900, method: 'واتس', total_cases: 7, taken_cases: 7, remaining_cases: 0 },
  { date: '5-Jul', name: 'محمد فاروق', phone: '+20 122 749 0166', province: 'القاهرة', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '8-Jul', name: 'محمد علام', phone: '+20 111 277 2799', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 5, remaining_cases: 0 },
  { date: '16-Jul', name: 'صلاح الصاوي', phone: '+20 100 513 6764', province: '', gender: 'ذكر', subscription: 200, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '19-Jul', name: 'صبري عماد', phone: '+20 101 055 6923', province: '', gender: 'ذكر', subscription: 500, method: 'واتس', total_cases: 5, taken_cases: 3, remaining_cases: 2 },
  { date: '21-Jul', name: 'وحيد الكلاني', phone: '+20 127 644 4114', province: '', gender: 'ذكر', subscription: 300, method: 'واتس', total_cases: 2, taken_cases: 2, remaining_cases: 0 },
  { date: '25-Jul', name: 'عماد', phone: '+20 112 091 5557', province: '', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '25-Jul', name: 'علاء عطالله', phone: '+20 102 226 2755', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 4, remaining_cases: 1 },
  { date: '20-Jul', name: 'صبري', phone: '+20 111 329 3409', province: '', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '20-Jul', name: 'لينا', phone: '+20 103 290 9479', province: '', gender: 'انثي', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '31-Jul', name: 'محمد سيد', phone: '+20 100 211 3403', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 4, remaining_cases: 1 },
  { date: '4-Aug', name: 'فاطمه محمد', phone: '+20 10 01434161', province: '', gender: 'انثى', subscription: 400, method: 'واتس', total_cases: 3, taken_cases: 3, remaining_cases: 0 },
  { date: '4-Aug', name: 'ميخائيل شاروبيم', phone: '+20 12 20572262', province: '', gender: 'ذكر', subscription: 400, method: 'واتس', total_cases: 5, taken_cases: 2, remaining_cases: 3 },
  { date: '5-Aug', name: 'احمد حسنى', phone: '+20 10 31391972', province: '', gender: 'ذكر', subscription: 200, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '7-Aug', name: 'ابراهيم حسن', phone: '+20 114 006 6926', province: '', gender: 'ذكر', subscription: 200, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '10-Aug', name: 'محمد الرملي', phone: '+20 10 63083050', province: '', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '11-Aug', name: 'محمد ربيع', phone: '+20 11 18102614', province: '', gender: 'ذكر', subscription: 150, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 },
  { date: '11-Aug', name: 'صباح حكيم', phone: '+20 10 69025663', province: '', gender: 'ذكر', subscription: 200, method: 'واتس', total_cases: 5, taken_cases: 2, remaining_cases: 3 },
  { date: '11-Aug', name: 'كاريم جمال', phone: '+20 11 10383629', province: '', gender: 'ذكر', subscription: 200, method: 'واتس', total_cases: 1, taken_cases: 1, remaining_cases: 0 }
];

async function clearAndInsertLawyers() {
  try {
    console.log('إدراج المحامين الجدد...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const lawyer of lawyersData) {
      try {
        // تنسيق رقم الهاتف
        let formattedPhone = lawyer.phone.replace(/\s+/g, '');
        if (!formattedPhone.startsWith('+')) {
          if (formattedPhone.startsWith('20')) {
            formattedPhone = '+' + formattedPhone;
          } else if (formattedPhone.startsWith('10') || formattedPhone.startsWith('11') || formattedPhone.startsWith('12')) {
            formattedPhone = '+20' + formattedPhone;
          } else if (formattedPhone.startsWith('0')) {
            formattedPhone = '+2' + formattedPhone;
          }
        }
        
        // حساب السعر الإجمالي للقضايا
        const pricePerCase = lawyer.subscription; // السعر الإجمالي وليس لكل قضية
        
        const { error } = await supabase
          .from('lawyers')
          .insert({
            name: lawyer.name,
            mobile: formattedPhone,
            governorate: lawyer.province || 'غير محدد',
            gender: lawyer.gender,
            subscription_amount: lawyer.subscription,
            send_method: lawyer.method,
            total_cases: lawyer.total_cases,
            consumed_cases: lawyer.taken_cases,
            remaining_cases: lawyer.remaining_cases,
            available_cases: lawyer.remaining_cases,
            price_per_case: pricePerCase,
            revenue: lawyer.subscription,
            participated: false,
            subscribed: true,
            received_free_case: false,
            is_subscribed: true,
            subscription_date: lawyer.date ? new Date(lawyer.date + ', 2024').toISOString() : null
          });
        
        if (error) {
          console.error(`خطأ في إدراج المحامي ${lawyer.name}:`, error);
          errorCount++;
        } else {
          console.log(`تم إدراج المحامي ${lawyer.name} بنجاح`);
          successCount++;
        }
      } catch (err) {
        console.error(`خطأ في معالجة المحامي ${lawyer.name}:`, err);
        errorCount++;
      }
    }
    
    console.log('\nملخص النتائج:');
    console.log(`عدد المحامين المدرجين بنجاح: ${successCount}`);
    console.log(`عدد الأخطاء: ${errorCount}`);
    console.log(`إجمالي المحامين: ${lawyersData.length}`);
    
    // التحقق من البيانات المدرجة
    console.log('\nالتحقق من البيانات المدرجة...');
    const { data: lawyers, error: selectError } = await supabase
      .from('lawyers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (selectError) {
      console.error('خطأ في جلب البيانات:', selectError);
    } else {
      console.log(`عدد المحامين في قاعدة البيانات: ${lawyers.length}`);
      
      // عرض إحصائيات
      const totalCases = lawyers.reduce((sum, l) => sum + (l.total_cases || 0), 0);
      const takenCases = lawyers.reduce((sum, l) => sum + (l.taken_cases || 0), 0);
      const remainingCases = lawyers.reduce((sum, l) => sum + (l.remaining_cases || 0), 0);
      const totalRevenue = lawyers.reduce((sum, l) => sum + (l.revenue || 0), 0);
      
      console.log('\nالإحصائيات:');
      console.log(`إجمالي القضايا: ${totalCases}`);
      console.log(`القضايا المأخوذة: ${takenCases}`);
      console.log(`القضايا المتبقية: ${remainingCases}`);
      console.log(`إجمالي الإيرادات: ${totalRevenue} جنيه`);
      console.log(`جميع المحامين مشتركين: ${lawyers.filter(l => l.is_subscribed).length}/${lawyers.length}`);
      
      // عرض أحدث 5 محامين
      console.log('\nأحدث 5 محامين:');
      lawyers.slice(0, 5).forEach(lawyer => {
        console.log(`- ${lawyer.name} (${lawyer.phone}) - القضايا: ${lawyer.total_cases}/${lawyer.taken_cases}/${lawyer.remaining_cases}`);
      });
    }
    
    console.log('\nتم إكمال جميع العمليات!');
    
  } catch (error) {
    console.error('خطأ عام:', error);
  }
}

clearAndInsertLawyers();