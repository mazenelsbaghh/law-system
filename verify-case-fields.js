import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://vvcwnokwrtyykfjimvgm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyCaseFields() {
  console.log('التحقق من الحقول الجديدة...');
  
  try {
    // جلب جميع المحامين مع الحقول الجديدة
    const { data: lawyers, error } = await supabase
      .from('lawyers')
      .select('name, cases, revenue, total_cases, taken_cases, remaining_cases')
      .order('revenue', { ascending: false });
    
    if (error) {
      console.error('خطأ في جلب البيانات:', error);
      return;
    }
    
    console.log(`\nتم العثور على ${lawyers.length} محامي`);
    
    // عرض أول 10 محامين
    console.log('\nأول 10 محامين مع الحقول الجديدة:');
    console.log('=' .repeat(80));
    console.log('الاسم\t\t\tالقضايا الأصلية\tالإيرادات\tالإجمالي\tالمأخوذة\tالمتبقية');
    console.log('=' .repeat(80));
    
    lawyers.slice(0, 10).forEach(lawyer => {
      const name = lawyer.name.padEnd(20);
      const cases = (lawyer.cases || 0).toString().padEnd(10);
      const revenue = (lawyer.revenue || 0).toString().padEnd(10);
      const total = (lawyer.total_cases || 0).toString().padEnd(8);
      const taken = (lawyer.taken_cases || 0).toString().padEnd(8);
      const remaining = (lawyer.remaining_cases || 0).toString().padEnd(8);
      
      console.log(`${name}\t${cases}\t${revenue}\t${total}\t${taken}\t${remaining}`);
    });
    
    // إحصائيات عامة
    const totalCasesSum = lawyers.reduce((sum, lawyer) => sum + (lawyer.total_cases || 0), 0);
    const takenCasesSum = lawyers.reduce((sum, lawyer) => sum + (lawyer.taken_cases || 0), 0);
    const remainingCasesSum = lawyers.reduce((sum, lawyer) => sum + (lawyer.remaining_cases || 0), 0);
    
    console.log('\n' + '=' .repeat(80));
    console.log('الإحصائيات العامة:');
    console.log(`إجمالي القضايا الكلي: ${totalCasesSum}`);
    console.log(`إجمالي القضايا المأخوذة: ${takenCasesSum}`);
    console.log(`إجمالي القضايا المتبقية: ${remainingCasesSum}`);
    
    // التحقق من صحة الحسابات
    console.log('\nالتحقق من صحة الحسابات:');
    let correctCalculations = 0;
    let incorrectCalculations = 0;
    
    lawyers.forEach(lawyer => {
      const expectedRemaining = (lawyer.total_cases || 0) - (lawyer.taken_cases || 0);
      if (expectedRemaining === (lawyer.remaining_cases || 0)) {
        correctCalculations++;
      } else {
        incorrectCalculations++;
        console.log(`خطأ في حساب ${lawyer.name}: متوقع ${expectedRemaining}, فعلي ${lawyer.remaining_cases}`);
      }
    });
    
    console.log(`الحسابات الصحيحة: ${correctCalculations}`);
    console.log(`الحسابات الخاطئة: ${incorrectCalculations}`);
    
    // توزيع المحامين حسب إجمالي القضايا
    console.log('\nتوزيع المحامين حسب إجمالي القضايا:');
    const distribution = {
      '5 قضايا': lawyers.filter(l => l.total_cases === 5).length,
      '10 قضايا': lawyers.filter(l => l.total_cases === 10).length,
      '20 قضية': lawyers.filter(l => l.total_cases === 20).length,
      '50 قضية': lawyers.filter(l => l.total_cases === 50).length,
      '100 قضية': lawyers.filter(l => l.total_cases === 100).length
    };
    
    Object.entries(distribution).forEach(([category, count]) => {
      console.log(`${category}: ${count} محامي`);
    });
    
    console.log('\n✅ تم التحقق من الحقول الجديدة بنجاح!');
    
  } catch (error) {
    console.error('خطأ عام:', error);
  }
}

// تشغيل الدالة
verifyCaseFields();