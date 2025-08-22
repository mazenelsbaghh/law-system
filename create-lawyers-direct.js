import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ متغيرات Supabase غير موجودة في ملف .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createLawyersTableDirect() {
    try {
        console.log('🚀 بدء إنشاء جدول المحامين مباشرة...');
        
        // محاولة إنشاء الجدول باستخدام SQL مباشر
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS public.lawyers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                mobile VARCHAR(20),
                governorate VARCHAR(100),
                gender VARCHAR(10),
                subscription_amount DECIMAL(10,2) DEFAULT 0,
                send_method VARCHAR(50),
                total_cases INTEGER DEFAULT 0,
                consumed_cases INTEGER DEFAULT 0,
                remaining_cases INTEGER DEFAULT 0,
                available_cases INTEGER DEFAULT 0,
                price_per_case DECIMAL(10,2) DEFAULT 0,
                revenue DECIMAL(10,2) DEFAULT 0,
                participated BOOLEAN DEFAULT false,
                subscribed BOOLEAN DEFAULT false,
                received_free_case BOOLEAN DEFAULT false,
                is_subscribed BOOLEAN DEFAULT false,
                subscription_date DATE,
                reorder_date DATE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        // تنفيذ إنشاء الجدول
        const { data, error } = await supabase.rpc('exec', {
            sql: createTableSQL
        });
        
        if (error) {
            console.log('⚠️ فشل في استخدام exec، محاولة طريقة أخرى...');
            console.log('خطأ exec:', error.message);
            
            // محاولة إنشاء الجدول عبر REST API
            const { error: restError } = await supabase
                .from('_realtime')
                .select('*')
                .limit(0);
            
            console.log('✅ تم إنشاء اتصال مع قاعدة البيانات');
        } else {
            console.log('✅ تم تنفيذ SQL بنجاح');
        }
        
        // التحقق من وجود الجدول
        console.log('🔍 التحقق من إنشاء الجدول...');
        const { data: testData, error: testError } = await supabase
            .from('lawyers')
            .select('count', { count: 'exact', head: true });
        
        if (testError) {
            console.error('❌ الجدول غير موجود:', testError.message);
            
            // محاولة إنشاء الجدول بطريقة مختلفة
            console.log('🔄 محاولة إنشاء الجدول بطريقة مختلفة...');
            
            // إنشاء جدول بسيط أولاً
            const simpleCreateSQL = `
                CREATE TABLE public.lawyers (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    mobile TEXT,
                    governorate TEXT,
                    gender TEXT,
                    subscription_amount NUMERIC DEFAULT 0,
                    send_method TEXT,
                    total_cases INTEGER DEFAULT 0,
                    consumed_cases INTEGER DEFAULT 0,
                    remaining_cases INTEGER DEFAULT 0,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            `;
            
            try {
                const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseKey}`,
                        'apikey': supabaseKey
                    },
                    body: JSON.stringify({ sql: simpleCreateSQL })
                });
                
                if (response.ok) {
                    console.log('✅ تم إنشاء الجدول بنجاح عبر REST API');
                } else {
                    console.log('⚠️ فشل في إنشاء الجدول عبر REST API');
                }
            } catch (fetchError) {
                console.log('⚠️ خطأ في استخدام fetch:', fetchError.message);
            }
            
            return false;
        } else {
            console.log('✅ تم إنشاء جدول المحامين بنجاح!');
            console.log(`📊 عدد السجلات الحالية: ${testData?.length || 0}`);
            return true;
        }
        
    } catch (error) {
        console.error('❌ خطأ في إنشاء الجدول:', error.message);
        return false;
    }
}

// تشغيل الدالة
createLawyersTableDirect().then(success => {
    if (success) {
        console.log('🎉 تم إنشاء جدول المحامين بنجاح!');
        process.exit(0);
    } else {
        console.log('❌ فشل في إنشاء جدول المحامين');
        process.exit(1);
    }
});