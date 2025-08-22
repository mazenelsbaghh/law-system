import { createClient } from '@supabase/supabase-js';

// قراءة متغيرات البيئة
const supabaseUrl = 'https://vvcwnokwrtyykfjimvgm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// بيانات القضايا المتاحة لكل محامي
const availableCasesData = [
  { name: 'هارون', availableCases: 1 },
  { name: 'محمد ابراهيم', availableCases: 2 },
  { name: 'وسام', availableCases: 1 },
  { name: 'محمد سامى', availableCases: 1 },
  { name: 'محمد ياسين', availableCases: 3 },
  { name: 'محمود محمد ابوالفتوح', availableCases: 1 },
  { name: 'خالد', availableCases: 2 },
  { name: 'اسلام', availableCases: 1 },
  { name: 'عبد الحميد منصور', availableCases: 1 },
  { name: 'محامى طارق', availableCases: 4 },
  { name: 'محمود النمس', availableCases: 1 },
  { name: 'احمد شريف', availableCases: 2 },
  { name: 'اكرم مصطفى', availableCases: 1 },
  { name: 'احمد عبد العزيز', availableCases: 3 },
  { name: 'اسلام ابو جبل', availableCases: 1 },
  { name: 'احمد ابو الوفا', availableCases: 2 },
  { name: 'صاحب اشرف', availableCases: 1 },
  { name: 'احمد سلامه', availableCases: 1 },
  { name: 'عبدالله زينهم', availableCases: 4 },
  { name: 'احمد محمود', availableCases: 1 },
  { name: 'شيماء مصطفى بكرى', availableCases: 2 },
  { name: 'علاء المالكى', availableCases: 1 },
  { name: 'محمد فاروق', availableCases: 3 },
  { name: 'محمد علام', availableCases: 1 },
  { name: 'صلاح الصاوي', availableCases: 2 },
  { name: 'صبري عماد', availableCases: 1 },
  { name: 'وحيد الكلاني', availableCases: 1 },
  { name: 'عماد', availableCases: 4 },
  { name: 'علاء عطالله', availableCases: 1 },
  { name: 'صبري', availableCases: 2 },
  { name: 'لينا', availableCases: 1 },
  { name: 'محمد سيد', availableCases: 3 },
  { name: 'فاطمه محمد', availableCases: 1 },
  { name: 'ميخائيل شاروبيم', availableCases: 3 },
  { name: 'احمد حسنى', availableCases: 1 },
  { name: 'ابراهيم حسن', availableCases: 1 },
  { name: 'محمد الرملي', availableCases: 1 },
  { name: 'محمد ربيع', availableCases: 1 },
  { name: 'صباح حكيم', availableCases: 3 },
  { name: 'كاريم جمال', availableCases: 1 }
];

async function updateAvailableCases() {
  try {
    console.log('بدء عملية تحديث القضايا المتاحة...');
    
    let updatedCount = 0;
    
    for (const lawyer of availableCasesData) {
      const { data, error } = await supabase
        .from('lawyers')
        .update({ availableCases: lawyer.availableCases })
        .eq('name', lawyer.name);
      
      if (error) {
        console.error(`خطأ في تحديث المحامي ${lawyer.name}:`, error);
      } else {
        updatedCount++;
        console.log(`تم تحديث المحامي: ${lawyer.name} - القضايا المتاحة: ${lawyer.availableCases}`);
      }
    }
    
    console.log(`\nتم تحديث ${updatedCount} محامي بنجاح!`);
    
    // التحقق من النتائج
    const { data: lawyers, error: fetchError } = await supabase
      .from('lawyers')
      .select('name, availableCases')
      .order('name');
    
    if (fetchError) {
      console.error('خطأ في جلب البيانات:', fetchError);
    } else {
      console.log('\nالقضايا المتاحة لكل محامي:');
      lawyers.forEach(lawyer => {
        console.log(`${lawyer.name}: ${lawyer.availableCases || 'غير محدد'}`);
      });
    }
    
  } catch (error) {
    console.error('خطأ عام:', error);
  }
}

updateAvailableCases();