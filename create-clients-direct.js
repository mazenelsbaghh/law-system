import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// قراءة متغيرات البيئة
const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');
const url = lines.find(line => line.startsWith('VITE_SUPABASE_URL=')).split('=')[1];
const key = lines.find(line => line.startsWith('VITE_SUPABASE_ANON_KEY=')).split('=')[1];

const supabase = createClient(url, key);

async function createClientsTable() {
  try {
    console.log('إنشاء جدول العملاء...');
    
    // محاولة إنشاء الجدول مباشرة باستخدام SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS clients (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        governorate TEXT,
        gender TEXT CHECK (gender IN ('ذكر', 'انثى', 'انثي')) NOT NULL,
        subscription_amount DECIMAL(10,2) NOT NULL,
        send_method TEXT DEFAULT 'واتس',
        total_cases INTEGER DEFAULT 1,
        consumed_cases INTEGER DEFAULT 0,
        remaining_cases INTEGER DEFAULT 1,
        subscription_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // محاولة تنفيذ SQL مباشرة
    const response = await fetch(`${url}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'apikey': key
      },
      body: JSON.stringify({ sql: createTableSQL })
    });
    
    if (response.ok) {
      console.log('تم إنشاء جدول العملاء بنجاح!');
    } else {
      const error = await response.text();
      console.log('خطأ في إنشاء الجدول:', error);
      
      // محاولة بديلة: إنشاء الجدول باستخدام migration
      console.log('محاولة إنشاء الجدول باستخدام طريقة بديلة...');
      
      // إنشاء الجدول باستخدام Supabase client مباشرة
      const { error: insertError } = await supabase
        .from('clients')
        .insert({
          name: 'test',
          mobile: '123',
          gender: 'ذكر',
          subscription_amount: 0
        });
      
      if (insertError) {
        console.log('الجدول غير موجود، سأحاول إنشاؤه عبر migration...');
        
        // تشغيل migration
        const { error: migrationError } = await supabase.rpc('create_clients_table');
        
        if (migrationError) {
          console.log('خطأ في migration:', migrationError.message);
        } else {
          console.log('تم إنشاء الجدول عبر migration!');
        }
      } else {
        console.log('الجدول موجود بالفعل!');
        // حذف البيانات التجريبية
        await supabase.from('clients').delete().eq('name', 'test');
      }
    }
    
    // التحقق من وجود الجدول
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('الجدول لا يزال غير متاح:', error.message);
    } else {
      console.log('تم التحقق من وجود جدول العملاء بنجاح!');
    }
    
  } catch (err) {
    console.error('خطأ عام:', err.message);
  }
}

createClientsTable();