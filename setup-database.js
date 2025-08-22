import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// قراءة متغيرات البيئة
const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');
const url = lines.find(line => line.startsWith('VITE_SUPABASE_URL=')).split('=')[1];
const key = lines.find(line => line.startsWith('VITE_SUPABASE_ANON_KEY=')).split('=')[1];

const supabase = createClient(url, key);

async function setupDatabase() {
  try {
    console.log('إعداد قاعدة البيانات...');
    
    // قراءة ملف database-schema.sql
    const schemaSQL = fs.readFileSync('database-schema.sql', 'utf8');
    
    // تقسيم SQL إلى أوامر منفصلة
    const sqlCommands = schemaSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`سيتم تنفيذ ${sqlCommands.length} أمر SQL...`);
    
    // تنفيذ كل أمر SQL منفصل
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      
      if (command.includes('CREATE TABLE') || command.includes('CREATE INDEX') || 
          command.includes('CREATE TRIGGER') || command.includes('CREATE POLICY') ||
          command.includes('CREATE OR REPLACE FUNCTION') || command.includes('ALTER TABLE')) {
        
        try {
          console.log(`تنفيذ الأمر ${i + 1}: ${command.substring(0, 50)}...`);
          
          // محاولة تنفيذ الأمر باستخدام fetch مباشرة
          const response = await fetch(`${url}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`,
              'apikey': key
            },
            body: JSON.stringify({ sql: command })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.log(`خطأ في الأمر ${i + 1}:`, errorText);
          } else {
            console.log(`نجح الأمر ${i + 1}`);
          }
          
        } catch (err) {
          console.log(`خطأ في تنفيذ الأمر ${i + 1}:`, err.message);
        }
        
        // انتظار قصير بين الأوامر
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('\nانتهاء إعداد قاعدة البيانات. التحقق من الجداول...');
    
    // التحقق من وجود الجداول
    const tables = ['lawyers', 'clients', 'campaigns', 'cases', 'expenses', 'tasks'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ جدول ${table}: ${error.message}`);
        } else {
          console.log(`✅ جدول ${table}: متاح`);
        }
      } catch (err) {
        console.log(`❌ جدول ${table}: خطأ في الوصول`);
      }
    }
    
  } catch (err) {
    console.error('خطأ عام في إعداد قاعدة البيانات:', err.message);
  }
}

setupDatabase();