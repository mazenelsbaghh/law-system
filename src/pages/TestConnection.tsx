import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');
  const [hasAnonymousKey, setHasAnonymousKey] = useState<boolean>(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      
      // Check environment variables
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      setSupabaseUrl(url || 'غير محدد');
      setHasAnonymousKey(!!key);
      
      if (!url || !key) {
        throw new Error('متغيرات البيئة غير مضبوطة بشكل صحيح');
      }
      
      // Test basic connection
      const { data, error } = await supabase.from('lawyers').select('count').limit(1);
      
      if (error) {
        if (error.message.includes('relation "lawyers" does not exist')) {
          setErrorMessage('الجداول غير موجودة - يجب تشغيل database-schema.sql');
        } else {
          setErrorMessage(`خطأ في الاتصال: ${error.message}`);
        }
        setConnectionStatus('error');
      } else {
        setConnectionStatus('connected');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطأ غير معروف');
      setConnectionStatus('error');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">اختبار الاتصال بـ Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">رابط Supabase:</label>
                <p className="text-sm text-muted-foreground break-all">{supabaseUrl}</p>
              </div>
              <div>
                <label className="font-semibold">المفتاح السري:</label>
                <p className="text-sm text-muted-foreground">
                  {hasAnonymousKey ? '✅ موجود' : '❌ غير موجود'}
                </p>
              </div>
            </div>
            
            <div className="text-center">
              {connectionStatus === 'testing' && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>جاري اختبار الاتصال...</span>
                </div>
              )}
              
              {connectionStatus === 'connected' && (
                <div className="text-green-600">
                  <div className="text-2xl mb-2">✅</div>
                  <p className="font-semibold">الاتصال ناجح!</p>
                  <p className="text-sm">قاعدة البيانات متصلة والجداول موجودة</p>
                </div>
              )}
              
              {connectionStatus === 'error' && (
                <div className="text-red-600">
                  <div className="text-2xl mb-2">❌</div>
                  <p className="font-semibold">فشل في الاتصال</p>
                  <p className="text-sm bg-red-50 p-2 rounded mt-2">{errorMessage}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button onClick={testConnection}>
                إعادة اختبار الاتصال
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                العودة للصفحة الرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestConnection;