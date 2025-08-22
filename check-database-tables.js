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

async function checkDatabaseTables() {
  console.log('🔍 فحص الجداول الموجودة في قاعدة البيانات...');
  
  try {
    // فحص جدول المحامين
    console.log('\n📋 فحص جدول المحامين (lawyers):');
    const { data: lawyers, error: lawyersError } = await supabase
      .from('lawyers')
      .select('*')
      .limit(1);
    
    if (lawyersError) {
      console.error('❌ خطأ في جدول المحامين:', lawyersError.message);
    } else {
      console.log('✅ جدول المحامين موجود');
      if (lawyers && lawyers.length > 0) {
        console.log('📊 أعمدة جدول المحامين:', Object.keys(lawyers[0]));
        console.log('📈 عدد المحامين:', lawyers.length);
      }
    }
    
    // فحص جدول الحملات
    console.log('\n📋 فحص جدول الحملات (campaigns):');
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .limit(1);
    
    if (campaignsError) {
      console.error('❌ خطأ في جدول الحملات:', campaignsError.message);
    } else {
      console.log('✅ جدول الحملات موجود');
      if (campaigns && campaigns.length > 0) {
        console.log('📊 أعمدة جدول الحملات:', Object.keys(campaigns[0]));
      }
    }
    
    // فحص جدول القضايا
    console.log('\n📋 فحص جدول القضايا (cases):');
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('*')
      .limit(1);
    
    if (casesError) {
      console.error('❌ خطأ في جدول القضايا:', casesError.message);
    } else {
      console.log('✅ جدول القضايا موجود');
      if (cases && cases.length > 0) {
        console.log('📊 أعمدة جدول القضايا:', Object.keys(cases[0]));
      }
    }
    
    // فحص جدول المصروفات
    console.log('\n📋 فحص جدول المصروفات (expenses):');
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .limit(1);
    
    if (expensesError) {
      console.error('❌ خطأ في جدول المصروفات:', expensesError.message);
    } else {
      console.log('✅ جدول المصروفات موجود');
      if (expenses && expenses.length > 0) {
        console.log('📊 أعمدة جدول المصروفات:', Object.keys(expenses[0]));
      }
    }
    
    // فحص جدول المهام
    console.log('\n📋 فحص جدول المهام (tasks):');
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (tasksError) {
      console.error('❌ خطأ في جدول المهام:', tasksError.message);
    } else {
      console.log('✅ جدول المهام موجود');
      if (tasks && tasks.length > 0) {
        console.log('📊 أعمدة جدول المهام:', Object.keys(tasks[0]));
      }
    }
    
    // فحص عدد السجلات في كل جدول
    console.log('\n📊 إحصائيات الجداول:');
    
    const { count: lawyersCount } = await supabase
      .from('lawyers')
      .select('*', { count: 'exact', head: true });
    console.log(`👥 عدد المحامين: ${lawyersCount || 0}`);
    
    const { count: campaignsCount } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true });
    console.log(`📢 عدد الحملات: ${campaignsCount || 0}`);
    
    const { count: casesCount } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true });
    console.log(`⚖️ عدد القضايا: ${casesCount || 0}`);
    
    const { count: expensesCount } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true });
    console.log(`💰 عدد المصروفات: ${expensesCount || 0}`);
    
    const { count: tasksCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true });
    console.log(`📝 عدد المهام: ${tasksCount || 0}`);
    
  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

checkDatabaseTables();