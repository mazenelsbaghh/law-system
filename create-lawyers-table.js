import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
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

async function createLawyersTable() {
    try {
        console.log('🚀 بدء إنشاء جدول المحامين...');
        
        // قراءة ملف SQL
        const sqlContent = fs.readFileSync('./create-lawyers-table.sql', 'utf8');
        
        // تقسيم الأوامر SQL
        const sqlCommands = sqlContent
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
        
        console.log(`📝 سيتم تنفيذ ${sqlCommands.length} أمر SQL`);
        
        // تنفيذ كل أمر SQL
        for (let i = 0; i < sqlCommands.length; i++) {
            const command = sqlCommands[i];
            console.log(`⏳ تنفيذ الأمر ${i + 1}/${sqlCommands.length}...`);
            
            try {
                const { error } = await supabase.rpc('exec', { sql: command });
                if (error) {
                    console.log(`⚠️ خطأ في الأمر ${i + 1}: ${error.message}`);
                    // محاولة تنفيذ الأمر مباشرة إذا فشل exec
                    const { error: directError } = await supabase
                        .from('_sql')
                        .select('*')
                        .limit(0);
                    
                    if (directError) {
                        console.log(`❌ فشل في تنفيذ الأمر: ${command.substring(0, 100)}...`);
                    }
                } else {
                    console.log(`✅ تم تنفيذ الأمر ${i + 1} بنجاح`);
                }
            } catch (err) {
                console.log(`⚠️ استثناء في الأمر ${i + 1}: ${err.message}`);
            }
        }
        
        // التحقق من وجود الجدول
        console.log('🔍 التحقق من إنشاء الجدول...');
        const { data, error } = await supabase
            .from('lawyers')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.error('❌ الجدول غير موجود:', error.message);
            return false;
        } else {
            console.log('✅ تم إنشاء جدول المحامين بنجاح!');
            console.log(`📊 عدد السجلات الحالية: ${data?.length || 0}`);
            return true;
        }
        
    } catch (error) {
        console.error('❌ خطأ في إنشاء الجدول:', error.message);
        return false;
    }
}

// تشغيل الدالة
createLawyersTable().then(success => {
    if (success) {
        console.log('🎉 تم إنشاء جدول المحامين بنجاح!');
        process.exit(0);
    } else {
        console.log('❌ فشل في إنشاء جدول المحامين');
        process.exit(1);
    }
});