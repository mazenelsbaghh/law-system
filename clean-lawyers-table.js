import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanLawyersTable() {
  console.log('🧹 تنظيف جدول المحامين من الأعمدة المكررة...');
  
  try {
    // Get all lawyers first
    const { data: lawyers, error: fetchError } = await supabase
      .from('lawyers')
      .select('*');
    
    if (fetchError) {
      console.error('❌ خطأ في جلب بيانات المحامين:', fetchError.message);
      return;
    }
    
    console.log(`📊 تم العثور على ${lawyers.length} محامي`);
    
    // Update each lawyer to use the correct column names
    for (const lawyer of lawyers) {
      console.log(`🔄 تحديث بيانات المحامي: ${lawyer.name}`);
      
      const updateData = {
        // Use snake_case as primary
        total_cases: lawyer.maxcases || lawyer.maxCases || lawyer.total_cases || 10,
        consumed_cases: lawyer.cases || lawyer.consumed_cases || 0,
        remaining_cases: Math.max(0, (lawyer.maxcases || lawyer.maxCases || lawyer.total_cases || 10) - (lawyer.cases || lawyer.consumed_cases || 0)),
        available_cases: lawyer.availablecases || lawyer.availableCases || lawyer.available_cases || Math.max(0, (lawyer.maxcases || lawyer.maxCases || lawyer.total_cases || 10) - (lawyer.cases || lawyer.consumed_cases || 0)),
        price_per_case: lawyer.pricepercase || lawyer.pricePerCase || lawyer.price_per_case || 0,
        received_free_case: lawyer.receivedfreecase || lawyer.receivedFreeCase || lawyer.received_free_case || false,
        is_subscribed: lawyer.subscribed || lawyer.isSubscribed || lawyer.is_subscribed || false,
        mobile: lawyer.mobile || lawyer.phone || '',
        gender: lawyer.gender || 'male',
        subscription_amount: lawyer.subscription_amount || 0,
        send_method: lawyer.send_method || 'whatsapp'
      };
      
      const { error: updateError } = await supabase
        .from('lawyers')
        .update(updateData)
        .eq('id', lawyer.id);
      
      if (updateError) {
        console.error(`❌ خطأ في تحديث المحامي ${lawyer.name}:`, updateError.message);
      } else {
        console.log(`✅ تم تحديث المحامي ${lawyer.name} بنجاح`);
      }
    }
    
    console.log('\n🎉 تم تنظيف جدول المحامين بنجاح!');
    console.log('\n📋 الأعمدة الأساسية المستخدمة الآن:');
    console.log('- total_cases: إجمالي القضايا المسموح بها');
    console.log('- consumed_cases: القضايا المستهلكة');
    console.log('- remaining_cases: القضايا المتبقية');
    console.log('- available_cases: القضايا المتاحة');
    console.log('- price_per_case: سعر القضية الواحدة');
    console.log('- received_free_case: تم استخدام القضية المجانية');
    console.log('- is_subscribed: مشترك');
    console.log('- mobile: رقم الهاتف المحمول');
    console.log('- gender: الجنس');
    console.log('- subscription_amount: مبلغ الاشتراك');
    console.log('- send_method: طريقة الإرسال');
    
  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

cleanLawyersTable();