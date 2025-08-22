import { useState, useMemo, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Summary } from "@/components/Summary";

import { LawyersTab } from "@/components/LawyersTab";
import { MarketingTab } from "@/components/MarketingTab";
import { TasksTab } from "@/components/TasksTab";
import ExpensesTab from "@/components/ExpensesTab";
import { NotificationSystem } from "@/components/NotificationSystem";
import { StatisticsCards } from "@/components/StatisticsCards";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Lawyer, Campaign, Task, Expense, Budget } from "@/types/crm";
import { Scale, BarChart3, Users, FileText, Briefcase, TrendingUp, CheckSquare, Settings, Moon, Sun, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { lawyersService, campaignsService, expensesService, tasksService, initializeDatabase } from "@/lib/database";
import type { Lawyer as SupabaseLawyer, Campaign as SupabaseCampaign, Expense as SupabaseExpense, Task as SupabaseTask } from "@/lib/supabase";

const Index = () => {

  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useLocalStorage<Budget>("crm-budget", {
    id: "1",
    totalBudget: 100000,
    usedBudget: 0,
    remainingBudget: 100000,
    month: new Date().toLocaleString('ar-EG', { month: 'long' }),
    year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  // Function to reload data from Supabase
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize database
        const dbInitialized = await initializeDatabase();
        if (!dbInitialized) {
          setError('الجداول غير موجودة في قاعدة البيانات. يرجى تشغيل ملف database-schema.sql في Supabase أولاً. تحقق من وحدة التحكم للحصول على التعليمات.');
          return;
        }

      // Load data from Supabase
      const [lawyersData, campaignsData, expensesData, tasksData] = await Promise.all([
        lawyersService.getAll(),
        campaignsService.getAll(),
        expensesService.getAll(),
        tasksService.getAll()
      ]);

      // Convert Supabase data to local types using correct column names
       setLawyers(lawyersData.map(lawyer => ({
         id: lawyer.id,
         name: lawyer.name,
         phone: lawyer.phone || lawyer.mobile || '',
         mobile: lawyer.mobile,
         governorate: lawyer.governorate,
         gender: lawyer.gender,
         status: lawyer.participated ? 'active' as const : 'inactive' as const,
         // Use database column names directly
         total_cases: lawyer.total_cases,
         consumed_cases: lawyer.consumed_cases,
         remaining_cases: lawyer.remaining_cases,
         available_cases: lawyer.available_cases,
         price_per_case: lawyer.price_per_case,
         subscription_amount: lawyer.subscription_amount,
         send_method: lawyer.send_method,
         received_free_case: lawyer.received_free_case,
         is_subscribed: lawyer.is_subscribed,
         // Legacy fields for backward compatibility
         maxCases: lawyer.total_cases || 10,
         availableCases: lawyer.available_cases || 0,
         takenCases: lawyer.consumed_cases || 0,
         pricePerCase: lawyer.price_per_case || 0,
         revenue: lawyer.revenue || 0,
         isSubscribed: lawyer.subscribed || lawyer.is_subscribed,
         hasFreeCaseUsed: lawyer.received_free_case || false,
         subscription_date: lawyer.subscription_date,
         reorder_date: lawyer.reorder_date,
         reorders: lawyer.reorders,
         participated: lawyer.participated,
         subscribed: lawyer.subscribed,
         cases: lawyer.cases
       })));
       
       setCampaigns(campaignsData.map(campaign => ({
         id: campaign.id,
         name: campaign.name,
         startDate: campaign.startDate,
         endDate: campaign.endDate,
         budget: campaign.budget,
         clients: campaign.clients,
         responses: campaign.responses,
         subscribers: campaign.subscribers,
         revenue: campaign.revenue,
         reorders: campaign.reorders,
         status: campaign.status === 'نشطة' ? 'active' as const : 
                campaign.status === 'مكتملة' ? 'completed' as const : 'paused' as const
       })));
      
      setExpenses(expensesData.map(expense => ({
         id: expense.id,
         title: expense.description,
         amount: expense.amount,
         category: expense.category,
         date: expense.date,
         description: expense.description,
         type: 'other' as const
       })));
       
       setTasks(tasksData.map(task => ({
         id: task.id,
         title: task.title,
         description: task.description || '',
         assignee: task.assignee,
         status: task.status === 'جديدة' ? 'pending' as const :
                task.status === 'قيد التنفيذ' ? 'in-progress' as const : 'completed' as const,
         dueDate: task.dueDate,
         progress: task.status === 'مكتملة' ? 100 : task.status === 'قيد التنفيذ' ? 50 : 0,
         sprintNumber: 1 // Default sprint number
       })));
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('حدث خطأ في تحميل البيانات من قاعدة البيانات.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize database and load data
  useEffect(() => {
    loadData();
  }, [loadData]);

  // إحصائيات محسّنة مع memoization
  const quickStats = useMemo(() => {
    const totalTakenCases = lawyers.reduce((sum, lawyer) => sum + (lawyer.takenCases || 0), 0);
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasksProgress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalRevenue = campaigns.reduce((sum, campaign) => sum + (campaign.revenue || 0), 0);
    
    return [
      {
        id: 'taken-cases',
        title: 'القضايا المأخوذة',
        value: totalTakenCases,
        subtitle: `من المحامين المشتركين`,
        icon: FileText,
        color: 'primary' as const
      },
      {
        id: 'campaigns',
        title: 'الحملات التسويقية النشطة',
        value: activeCampaigns,
        subtitle: `من إجمالي ${campaigns.length} حملة`,
        icon: TrendingUp,
        color: 'success' as const,
        trend: 'up' as const,
        trendValue: '+12%'
      },
      {
        id: 'lawyers',
        title: 'المحامون',
        value: lawyers.filter(l => l.status === 'active').length,
        subtitle: 'محامي نشط',
        icon: Briefcase,
        color: 'info' as const
      },
      {
        id: 'tasks-progress',
        title: 'تقدم المهام',
        value: `${Math.round(totalTasksProgress)}%`,
        subtitle: `${completedTasks} من ${tasks.length} مهمة`,
        icon: CheckSquare,
        color: 'warning' as const,
        progress: totalTasksProgress
      },
      {
        id: 'revenue',
        title: 'إجمالي الإيرادات',
        value: `${totalRevenue.toLocaleString('ar-EG')} ج.م`,
        subtitle: 'من الحملات التسويقية',
        icon: TrendingUp,
        color: 'success' as const,
        trend: 'up' as const,
        trendValue: '+8%'
      }
    ];
  }, [lawyers, tasks, campaigns]);

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  if (loading) {
    return (
      <div dir="rtl" lang="ar" className="min-h-screen bg-background font-arabic flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" lang="ar" className="min-h-screen bg-background font-arabic flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-destructive mb-4">خطأ في قاعدة البيانات</h2>
            <p className="text-destructive mb-4">{error}</p>
            <div className="bg-muted p-4 rounded-md text-sm text-right">
              <p className="font-semibold mb-2">الخطوات المطلوبة:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>اذهب إلى لوحة تحكم Supabase</li>
                <li>انسخ محتويات ملف database-schema.sql</li>
                <li>الصق الكود في محرر SQL وشغله</li>
                <li>أعد تحميل هذه الصفحة</li>
              </ol>
            </div>
          </div>
          <Button onClick={() => window.location.reload()} className="mr-4">
            إعادة تحميل الصفحة
          </Button>
          <Button variant="outline" onClick={() => window.open('https://vvcwnokwrtyykfjimvgm.supabase.co/project/vvcwnokwrtyykfjimvgm/sql', '_blank')}>
            فتح Supabase SQL Editor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-background font-arabic">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
                <Scale className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent font-arabic-formal">
                  نظام إدارة المحاماة
                </h1>
                <p className="text-sm text-muted-foreground font-arabic">
                  إدارة شاملة ومتطورة للسبونسر والقضايا والمحامين والمهام
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* إحصائيات سريعة */}
              <div className="hidden lg:flex items-center gap-4 px-4 py-2 bg-gradient-subtle rounded-lg border border-border/50">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="font-medium">{campaigns.length}</span>
                  <span className="text-muted-foreground">حملة</span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium">{lawyers.reduce((total, lawyer) => total + (lawyer.takenCases || 0), 0)}</span>
                  <span className="text-muted-foreground">قضية مأخوذة</span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-info" />
                  <span className="font-medium">{lawyers.length}</span>
                  <span className="text-muted-foreground">محامي</span>
                </div>
              </div>

              {/* أدوات التحكم */}
              <div className="flex items-center gap-2">
                <NotificationSystem />
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleThemeToggle}
                  className="relative overflow-hidden"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* إحصائيات سريعة */}
        <StatisticsCards 
          statistics={quickStats} 
          columns={5}
          className="animate-fade-in"
        />

        <Tabs defaultValue="summary" className="space-y-6" dir="rtl">
          <TabsList className="grid w-full grid-cols-5 h-auto p-2 bg-gradient-subtle shadow-lg border border-border/50 rounded-xl">
            <TabsTrigger 
              value="summary" 
              className="flex flex-col gap-2 p-4 transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary data-[state=active]:scale-105 rounded-lg font-arabic text-center"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">الملخص</span>
            </TabsTrigger>

            <TabsTrigger 
              value="lawyers" 
              className="flex flex-col gap-2 p-4 transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary data-[state=active]:scale-105 rounded-lg font-arabic text-center"
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-sm font-medium">المحامون</span>
            </TabsTrigger>
            <TabsTrigger 
              value="marketing" 
              className="flex flex-col gap-2 p-4 transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary data-[state=active]:scale-105 rounded-lg font-arabic text-center"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">التسويق</span>
            </TabsTrigger>

            <TabsTrigger 
              value="tasks" 
              className="flex flex-col gap-2 p-4 transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary data-[state=active]:scale-105 rounded-lg font-arabic text-center"
            >
              <CheckSquare className="h-5 w-5" />
              <span className="text-sm font-medium">المهام</span>
            </TabsTrigger>
            <TabsTrigger 
              value="expenses" 
              className="flex flex-col gap-2 p-4 transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary data-[state=active]:scale-105 rounded-lg font-arabic text-center"
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">المصاريف</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Summary lawyers={lawyers} campaigns={campaigns} />
          </TabsContent>

          <TabsContent value="lawyers">
            <LawyersTab lawyers={lawyers} setLawyers={setLawyers} expenses={expenses} setExpenses={setExpenses} campaigns={campaigns} onDataChange={loadData} />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingTab campaigns={campaigns} setCampaigns={setCampaigns} onDataChange={loadData} />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksTab tasks={tasks} setTasks={setTasks} />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpensesTab expenses={expenses} setExpenses={setExpenses} budget={budget} setBudget={setBudget} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
