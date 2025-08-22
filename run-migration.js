import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://vvcwnokwrtyykfjimvgm.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY'
);

async function runMigration() {
  try {
    console.log('قراءة ملف migration...');
    
    // قراءة ملف SQL
    const migrationSQL = readFileSync('./supabase/migrations/20241217000003_create_all_tables.sql', 'utf8');
    
    console.log('تشغيل migration...');
    
    // تقسيم الأوامر SQL
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const command of commands) {
      try {
        console.log(`تنفيذ: ${command.substring(0, 50)}...`);
        
        // محاولة تنفيذ الأمر باستخدام rpc
        const { data, error } = await supabase.rpc('exec', { sql: command });
        
        if (error) {
          console.warn(`تحذير في الأمر: ${error.message}`);
          // محاولة تنفيذ مباشر للجداول
          if (command.includes('CREATE TABLE')) {
            console.log('محاولة إنشاء الجدول مباشرة...');
            // استخراج اسم الجدول
            const tableMatch = command.match(/CREATE TABLE.*?public\.(\w+)/i);
            if (tableMatch) {
              const tableName = tableMatch[1];
              console.log(`محاولة إنشاء جدول: ${tableName}`);
            }
          }
          errorCount++;
        } else {
          console.log('✓ تم تنفيذ الأمر بنجاح');
          successCount++;
        }
      } catch (err) {
        console.error(`خطأ في تنفيذ الأمر: ${err.message}`);
        errorCount++;
      }
    }
    
    console.log('\nملخص النتائج:');
    console.log(`الأوامر المنفذة بنجاح: ${successCount}`);
    console.log(`الأوامر التي فشلت: ${errorCount}`);
    console.log(`إجمالي الأوامر: ${commands.length}`);
    
    // التحقق من الجداول المنشأة
    console.log('\nالتحقق من الجداول المنشأة...');
    
    const tables = ['lawyers', 'campaigns', 'expenses', 'tasks'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ جدول ${table}: غير موجود (${error.message})`);
        } else {
          console.log(`✅ جدول ${table}: موجود`);
        }
      } catch (err) {
        console.log(`❌ جدول ${table}: خطأ في التحقق (${err.message})`);
      }
    }
    
  } catch (error) {
    console.error('خطأ في تشغيل migration:', error);
  }
}

runMigration();