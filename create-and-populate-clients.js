import { createClient } from '@supabase/supabase-js';

// إعداد Supabase
const supabaseUrl = 'https://vvcwnokwrtyykfjimvgm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Y3dub2t3cnR5eWtmamltdmdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDc1MjEsImV4cCI6MjA3MDMyMzUyMX0.zMWtIECybtDscIO2XMuVHGmECjQgfnX7Z7AeylE7mJY';
const supabase = createClient(supabaseUrl, supabaseKey);

// دالة لإنشاء جدول العملاء
async function createClientsTable() {
  try {
    console.log('إنشاء جدول العملاء...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) UNIQUE NOT NULL,
        governorate VARCHAR(100),
        gender VARCHAR(10),
        subscription_amount INTEGER,
        send_method VARCHAR(50),
        total_cases INTEGER DEFAULT 0,
        consumed_cases INTEGER DEFAULT 0,
        remaining_cases INTEGER DEFAULT 0,
        subscription_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- إنشاء الفهارس
      CREATE INDEX IF NOT EXISTS idx_clients_mobile ON public.clients(mobile);
      CREATE INDEX IF NOT EXISTS idx_clients_governorate ON public.clients(governorate);
      CREATE INDEX IF NOT EXISTS idx_clients_gender ON public.clients(gender);
      CREATE INDEX IF NOT EXISTS idx_clients_subscription_date ON public.clients(subscription_date);
      
      -- تفعيل Row Level Security
      ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
      
      -- إنشاء سياسة للسماح بجميع العمليات
      DROP POLICY IF EXISTS "Enable all operations for clients table" ON public.clients;
      CREATE POLICY "Enable all operations for clients table" ON public.clients
        FOR ALL USING (true);
      
      -- إنشاء دالة لتحديث updated_at
      CREATE OR REPLACE FUNCTION update_clients_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      -- إنشاء المشغل
      DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
      CREATE TRIGGER update_clients_updated_at
        BEFORE UPDATE ON public.clients
        FOR EACH ROW
        EXECUTE FUNCTION update_clients_updated_at();
    `;
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });
    
    if (error) {
      console.error('خطأ في إنشاء الجدول:', error);
      return false;
    }
    
    console.log('تم إنشاء جدول العملاء بنجاح!');
    return true;
  } catch (error) {
    console.error('خطأ عام في إنشاء الجدول:', error);
    return false;
  }
}

// بيانات العملاء
const clientsData = [
  {
    name: 'هارون',
    mobile: '+201062546455',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-06-03'
  },
  {
    name: 'محمد ابراهيم',
    mobile: '+201063131642',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0,
    subscription_date: '2024-06-17'
  },
  {
    name: 'وسام',
    mobile: '+201001755770',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-06-18'
  },
  {
    name: 'محمد سامى',
    mobile: '+201025333333',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-06-20'
  },
  {
    name: 'محمد ياسين',
    mobile: '+201226996026',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-06-29'
  },
  {
    name: 'محمود محمد ابوالفتوح',
    mobile: '+201289097335',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 3,
    remaining_cases: 2,
    subscription_date: '2024-05-02'
  },
  {
    name: 'خالد',
    mobile: '+201020759107',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 500,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0,
    subscription_date: '2024-04-15'
  },
  {
    name: 'اسلام',
    mobile: '+201211195381',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-05-31'
  },
  {
    name: 'عبد الحميد منصور',
    mobile: '+201098262529',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-06-03'
  },
  {
    name: 'محامى طارق',
    mobile: '+201288242805',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-05-03'
  },
  {
    name: 'محمود النمس',
    mobile: '+201141157262',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 1,
    remaining_cases: 4,
    subscription_date: '2024-05-05'
  },
  {
    name: 'احمد شريف',
    mobile: '+201050706027',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 500,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0,
    subscription_date: '2024-05-17'
  },
  {
    name: 'اكرم مصطفى',
    mobile: '+201008974477',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 550,
    send_method: 'واتس',
    total_cases: 6,
    consumed_cases: 6,
    remaining_cases: 0,
    subscription_date: '2024-05-19'
  },
  {
    name: 'احمد عبد العزيز',
    mobile: '+201007217898',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 300,
    send_method: 'واتس',
    total_cases: 2,
    consumed_cases: 2,
    remaining_cases: 0,
    subscription_date: '2024-05-27'
  },
  {
    name: 'اسلام ابو جبل',
    mobile: '+201005533572',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 4,
    remaining_cases: 1,
    subscription_date: '2024-05-27'
  },
  {
    name: 'احمد ابو الوفا',
    mobile: '+201004402485',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0,
    subscription_date: '2024-05-30'
  },
  {
    name: 'صاحب اشرف',
    mobile: '+201272607926',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: null
  },
  {
    name: 'احمد سلامه',
    mobile: '+201093750911',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-06-29'
  },
  {
    name: 'عبدالله زينهم',
    mobile: '+201064365320',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-06-30'
  },
  {
    name: 'احمد محمود',
    mobile: '+201276997470',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0,
    subscription_date: '2024-06-30'
  },
  {
    name: 'شيماء مصطفى بكرى',
    mobile: '+201221914175',
    governorate: 'الاسماعلية',
    gender: 'انثى',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 2,
    remaining_cases: 3,
    subscription_date: '2024-07-01'
  },
  {
    name: 'علاء المالكى',
    mobile: '+201031277891',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 900,
    send_method: 'واتس',
    total_cases: 7,
    consumed_cases: 7,
    remaining_cases: 0,
    subscription_date: '2024-07-04'
  },
  {
    name: 'محمد فاروق',
    mobile: '+201227490166',
    governorate: 'القاهرة',
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-07-05'
  },
  {
    name: 'محمد علام',
    mobile: '+201112772799',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 5,
    remaining_cases: 0,
    subscription_date: '2024-07-08'
  },
  {
    name: 'صلاح الصاوي',
    mobile: '+201005136764',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-07-16'
  },
  {
    name: 'صبري عماد',
    mobile: '+201010556923',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 500,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 3,
    remaining_cases: 2,
    subscription_date: '2024-07-19'
  },
  {
    name: 'وحيد الكلاني',
    mobile: '+201276444114',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 300,
    send_method: 'واتس',
    total_cases: 2,
    consumed_cases: 2,
    remaining_cases: 0,
    subscription_date: '2024-07-21'
  },
  {
    name: 'عماد',
    mobile: '+201120915557',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-07-25'
  },
  {
    name: 'علاء عطالله',
    mobile: '+201022262755',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 4,
    remaining_cases: 1,
    subscription_date: '2024-07-25'
  },
  {
    name: 'صبري',
    mobile: '+201113293409',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-07-20'
  },
  {
    name: 'لينا',
    mobile: '+201032909479',
    governorate: null,
    gender: 'انثى',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-07-20'
  },
  {
    name: 'محمد سيد',
    mobile: '+201002113403',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 4,
    remaining_cases: 1,
    subscription_date: '2024-07-31'
  },
  {
    name: 'فاطمه محمد',
    mobile: '+201001434161',
    governorate: null,
    gender: 'انثى',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 3,
    consumed_cases: 3,
    remaining_cases: 0,
    subscription_date: '2024-08-04'
  },
  {
    name: 'ميخائيل شاروبيم',
    mobile: '+201220572262',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 400,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 2,
    remaining_cases: 3,
    subscription_date: '2024-08-04'
  },
  {
    name: 'احمد حسنى',
    mobile: '+201031391972',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-08-05'
  },
  {
    name: 'ابراهيم حسن',
    mobile: '+201140066926',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-08-07'
  },
  {
    name: 'محمد الرملي',
    mobile: '+201063083050',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-08-10'
  },
  {
    name: 'محمد ربيع',
    mobile: '+201118102614',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 150,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-08-11'
  },
  {
    name: 'صباح حكيم',
    mobile: '+201069025663',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 5,
    consumed_cases: 2,
    remaining_cases: 3,
    subscription_date: '2024-08-11'
  },
  {
    name: 'كاريم جمال',
    mobile: '+201110383629',
    governorate: null,
    gender: 'ذكر',
    subscription_amount: 200,
    send_method: 'واتس',
    total_cases: 1,
    consumed_cases: 1,
    remaining_cases: 0,
    subscription_date: '2024-08-11'
  }
];

// دالة لإدراج البيانات باستخدام SQL
async function insertClientsDataSQL() {
  try {
    console.log('إدراج بيانات العملاء باستخدام SQL...');
    
    let insertSQL = 'INSERT INTO public.clients (name, mobile, governorate, gender, subscription_amount, send_method, total_cases, consumed_cases, remaining_cases, subscription_date) VALUES ';
    
    const values = clientsData.map(client => {
      const name = client.name.replace(/'/g, "''");
      const mobile = client.mobile;
      const governorate = client.governorate ? `'${client.governorate.replace(/'/g, "''")}'` : 'NULL';
      const gender = client.gender.replace(/'/g, "''");
      const subscriptionDate = client.subscription_date ? `'${client.subscription_date}'` : 'NULL';
      
      return `('${name}', '${mobile}', ${governorate}, '${gender}', ${client.subscription_amount}, '${client.send_method}', ${client.total_cases}, ${client.consumed_cases}, ${client.remaining_cases}, ${subscriptionDate})`;
    });
    
    insertSQL += values.join(', ') + ';';
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: insertSQL
    });
    
    if (error) {
      console.error('خطأ في إدراج البيانات:', error);
      return false;
    }
    
    console.log('تم إدراج جميع بيانات العملاء بنجاح!');
    return true;
  } catch (error) {
    console.error('خطأ عام في إدراج البيانات:', error);
    return false;
  }
}

// دالة لإدراج البيانات باستخدام Supabase client
async function insertClientsDataClient() {
  try {
    console.log('إدراج بيانات العملاء باستخدام Supabase client...');
    
    const { data, error } = await supabase
      .from('clients')
      .insert(clientsData);
    
    if (error) {
      console.error('خطأ في إدراج البيانات:', error);
      return false;
    }
    
    console.log('تم إدراج جميع بيانات العملاء بنجاح!');
    return true;
  } catch (error) {
    console.error('خطأ عام في إدراج البيانات:', error);
    return false;
  }
}

// الدالة الرئيسية
async function main() {
  try {
    // إنشاء الجدول أولاً
    const tableCreated = await createClientsTable();
    
    if (!tableCreated) {
      console.log('فشل في إنشاء الجدول، سنحاول إدراج البيانات مباشرة...');
    }
    
    // محاولة إدراج البيانات باستخدام client
    const clientInserted = await insertClientsDataClient();
    
    if (!clientInserted) {
      console.log('فشل في إدراج البيانات باستخدام client، سنحاول باستخدام SQL...');
      await insertClientsDataSQL();
    }
    
    // التحقق من النتائج
    const { count, error: countError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('خطأ في عد العملاء:', countError);
    } else {
      console.log(`إجمالي عدد العملاء في قاعدة البيانات: ${count}`);
    }
    
  } catch (error) {
    console.error('خطأ عام:', error);
  }
}

// تشغيل الدالة الرئيسية
main();