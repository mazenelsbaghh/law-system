import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, FileText, Briefcase, AlertTriangle, CheckCircle, BarChart3, Award } from "lucide-react";
import { Lawyer, Campaign } from "@/types/crm";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SummaryProps {
  lawyers: Lawyer[];
  campaigns: Campaign[];
}

export function Summary({ lawyers, campaigns }: SummaryProps) {
  const totalTakenCases = lawyers.reduce((sum, lawyer) => sum + (lawyer.takenCases || 0), 0);
  const freeCases = 0; // No longer tracking individual cases
  const activeLawyers = lawyers.filter(l => l.status === 'active' && l.isSubscribed).length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalRevenue = lawyers.reduce((sum, l) => sum + ((l.takenCases || 0) * (l.pricePerCase || 0)), 0);
  const safeTotalRevenue = isNaN(totalRevenue) ? 0 : totalRevenue;
  const totalClients = campaigns.reduce((sum, c) => sum + c.clients, 0);
  const safeTotalClients = isNaN(totalClients) ? 0 : totalClients;
  const totalReorders = campaigns.reduce((sum, c) => sum + (c.reorders || 0), 0);
  const safeTotalReorders = isNaN(totalReorders) ? 0 : totalReorders;
  
  const lowPerformanceCampaigns = campaigns.filter(c => {
    const conversionRate = c.clients > 0 ? (c.subscribers / c.clients) * 100 : 0;
    return conversionRate < 20 && c.status === 'active';
  });

  const averageConversionRate = campaigns.length > 0 ? 
    campaigns.reduce((sum, c) => sum + (c.clients > 0 ? (c.subscribers / c.clients) * 100 : 0), 0) / campaigns.length : 0;
  
  const safeAverageConversionRate = isNaN(averageConversionRate) ? 0 : averageConversionRate;

  // تحليل أفضل المحامين حسب المحافظة
  const lawyersByGovernorate = lawyers.reduce((acc, lawyer) => {
    const gov = lawyer.governorate || 'غير محدد';
    if (!acc[gov]) acc[gov] = [];
    acc[gov].push(lawyer);
    return acc;
  }, {} as Record<string, Lawyer[]>);

  const topLawyersByGovernorate = Object.entries(lawyersByGovernorate).map(([governorate, govLawyers]) => {
    const topLawyer = govLawyers
      .filter(l => l.status === 'active')
      .sort((a, b) => (b.takenCases + b.pricePerCase) - (a.takenCases + a.pricePerCase))[0];
    
    const totalCases = govLawyers.reduce((sum, l) => sum + (l.takenCases || 0), 0);
    const totalRevenue = govLawyers.reduce((sum, l) => sum + ((l.takenCases || 0) * (l.pricePerCase || 0)), 0);
    const activeLawyers = govLawyers.filter(l => l.status === 'active').length;
    
    return {
      governorate,
      lawyerCount: govLawyers.length,
      activeLawyers: isNaN(activeLawyers) ? 0 : activeLawyers,
      totalCases: isNaN(totalCases) ? 0 : totalCases,
      totalRevenue: isNaN(totalRevenue) ? 0 : totalRevenue,
      topLawyer: topLawyer ? {
        name: topLawyer.name,
        cases: topLawyer.takenCases || 0,
        revenue: isNaN((topLawyer.takenCases || 0) * (topLawyer.pricePerCase || 0)) ? 0 : (topLawyer.takenCases || 0) * (topLawyer.pricePerCase || 0)
      } : null
    };
  }).sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));

  const chartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  return (
    <div dir="rtl" lang="ar" className="space-y-6 animate-fade-in font-arabic">
      {/* Alerts */}
      {lowPerformanceCampaigns.length > 0 && (
        <Card className="border-warning bg-warning/5">
          <CardHeader className="flex flex-row items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <CardTitle className="text-warning">تنبيه: حملات ضعيفة الأداء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowPerformanceCampaigns.map(campaign => (
                <Badge key={campaign.id} variant="outline" className="border-warning text-warning">
                  {campaign.name} (معدل التحويل: {campaign.clients > 0 ? ((campaign.subscribers / campaign.clients) * 100).toFixed(1) : 0}%)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-primary text-primary-foreground shadow-primary hover:shadow-lg transition-all duration-300 hover:scale-105 border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الحملات النشطة</CardTitle>
            <TrendingUp className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCampaigns}</div>
            <p className="text-xs opacity-90">من إجمالي {campaigns.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-subtle border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">القضايا المأخوذة</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalTakenCases}</div>
            <p className="text-xs text-muted-foreground">{freeCases} مجانية</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-subtle border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المحامون المشتركون</CardTitle>
            <Briefcase className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{activeLawyers}</div>
            <p className="text-xs text-muted-foreground">من إجمالي {lawyers.length}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-subtle border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
            <Users className="h-5 w-5 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-info">{safeTotalClients}</div>
            <p className="text-xs text-muted-foreground">من جميع الحملات</p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-subtle border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إعادة الترتيب</CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{safeTotalReorders}</div>
            <p className="text-xs text-muted-foreground">إجمالي الطلبات المعاد ترتيبها</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              معدل التحويل العام
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">المعدل: {safeAverageConversionRate.toFixed(1)}%</span>
                <span className="text-sm text-muted-foreground">إجمالي الإيرادات: {safeTotalRevenue.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <Progress value={safeAverageConversionRate} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                متوسط معدل التحويل لجميع الحملات
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>أفضل الحملات أداءً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaigns
                .filter(c => c.clients > 0)
                .sort((a, b) => (b.subscribers / b.clients) - (a.subscribers / a.clients))
                .slice(0, 3)
                .map(campaign => {
                  const conversionRate = (campaign.subscribers / campaign.clients) * 100;
                  const safeConversionRate = isNaN(conversionRate) ? 0 : conversionRate;
                  return (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{campaign.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {campaign.subscribers}/{campaign.clients}
                        </span>
                      </div>
                      <Progress value={safeConversionRate} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        معدل التحويل: {safeConversionRate.toFixed(1)}%
                      </p>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تقارير المحامين حسب المحافظة */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              تقرير أداء المحامين حسب المحافظة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* الرسم البياني للإيرادات */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">إجمالي الإيرادات حسب المحافظة</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topLawyersByGovernorate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="governorate" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Number(value).toLocaleString('ar-EG')} ج.م`, 'الإيرادات']} />
                    <Bar dataKey="totalRevenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* الرسم الدائري لتوزيع المحامين */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">توزيع المحامين النشطين</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topLawyersByGovernorate}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ governorate, activeLawyers }) => `${governorate}: ${activeLawyers}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="activeLawyers"
                    >
                      {topLawyersByGovernorate.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* أفضل المحامين في كل محافظة */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-warning" />
              أفضل المحامين في كل محافظة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topLawyersByGovernorate.map((gov, index) => (
                <Card key={gov.governorate} className="border-2 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{gov.governorate}</span>
                      <Badge variant="outline" className="text-xs">
                        {gov.activeLawyers} محامي نشط
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {gov.topLawyer ? (
                      <>
                        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="h-4 w-4 text-warning" />
                            <span className="font-semibold text-sm">أفضل محامي</span>
                          </div>
                          <p className="font-bold text-primary">{gov.topLawyer.name}</p>
                          <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>القضايا: {gov.topLawyer.cases}</span>
                            <span>الإيرادات: {gov.topLawyer.revenue.toLocaleString('ar-EG')} ج.م</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="font-bold text-lg">{gov.totalCases}</div>
                            <div className="text-muted-foreground">إجمالي القضايا</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="font-bold text-lg">{gov.totalRevenue.toLocaleString('ar-EG')}</div>
                            <div className="text-muted-foreground">إجمالي الإيرادات</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        لا يوجد محامين نشطين في هذه المحافظة
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}