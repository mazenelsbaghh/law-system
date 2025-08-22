import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { Plus, Search, Users, UserCheck, UserX, Gift, Phone, Edit, Trash2, RefreshCw, Download, Upload, AlertCircle } from "lucide-react";
import { Lawyer, Campaign, Expense } from "@/types/crm";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "@/hooks/useSearch";
import { lawyersService } from "@/lib/database";

interface LawyersTabProps {
  lawyers: Lawyer[];
  setLawyers: (lawyers: Lawyer[]) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  campaigns: Campaign[];
  onDataChange?: () => void;
}

export function LawyersTab({ lawyers, setLawyers, expenses, setExpenses, campaigns, onDataChange }: LawyersTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);
  const [reorderingLawyer, setReorderingLawyer] = useState<Lawyer | null>(null);
  const [reorderCases, setReorderCases] = useState(1);
  const [newLawyer, setNewLawyer] = useState<Partial<Lawyer>>({
    name: "",
    phone: "",
    governorate: "غير محدد",
    gender: "ذكر",
    status: "active",
    maxCases: 10,
    availableCases: 10,
    takenCases: 0,
    pricePerCase: 150,
    revenue: 0,
    isSubscribed: false,
    hasFreeCaseUsed: false,
    notes: ""
  });
  const { toast } = useToast();

  const searchConfig = {
    searchFields: ['name', 'phone', 'governorate'],
    filterFields: {
      governorate: lawyers.map(l => l.governorate).filter(Boolean),
      status: ['active', 'inactive'],
      isSubscribed: [true, false]
    }
  };

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    filteredData: filteredLawyers,
    hasActiveFilters,
    resultCount,
    totalCount
  } = useSearch(lawyers, searchConfig);

  const filterOptions = [
    {
      label: "المحافظة",
      field: "governorate",
      options: [...new Set(lawyers.map(l => l.governorate).filter(Boolean))].map(gov => ({
        value: gov!,
        label: gov!
      }))
    },
    {
      label: "الحالة",
      field: "status",
      options: [
        { value: "active", label: "نشط" },
        { value: "inactive", label: "غير نشط" }
      ]
    },
    {
      label: "الاشتراك",
      field: "isSubscribed",
      options: [
        { value: "true", label: "مشترك" },
        { value: "false", label: "غير مشترك" }
      ]
    }
  ];

  const addLawyer = async () => {
    if (!newLawyer.name || !newLawyer.phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الاسم ورقم الهاتف على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      const lawyerData = {
        name: newLawyer.name!,
        mobile: newLawyer.phone!,
        governorate: newLawyer.governorate || 'غير محدد',
        gender: newLawyer.gender || 'ذكر',
        subscription_amount: newLawyer.pricePerCase || 150,
        send_method: 'واتس',
        total_cases: newLawyer.maxCases || 10,
        consumed_cases: newLawyer.takenCases || 0,
        remaining_cases: (newLawyer.maxCases || 10) - (newLawyer.takenCases || 0),
        available_cases: (newLawyer.maxCases || 10) - (newLawyer.takenCases || 0),
        price_per_case: newLawyer.pricePerCase || 150,
        revenue: newLawyer.revenue || 0,
        participated: newLawyer.status === 'active',
        subscribed: newLawyer.isSubscribed || false,
        is_subscribed: newLawyer.isSubscribed || false,
        received_free_case: newLawyer.hasFreeCaseUsed || false,
        subscription_date: new Date().toISOString().split('T')[0]
      };

      const savedLawyer = await lawyersService.create(lawyerData);
      
      const localLawyer: Lawyer = {
        id: savedLawyer.id,
        name: savedLawyer.name,
        phone: savedLawyer.mobile,
        mobile: savedLawyer.mobile,
        governorate: savedLawyer.governorate,
        gender: savedLawyer.gender,
        status: savedLawyer.participated ? 'active' : 'inactive',
        maxCases: savedLawyer.total_cases,
        availableCases: savedLawyer.available_cases,
        takenCases: savedLawyer.consumed_cases,
        pricePerCase: savedLawyer.price_per_case,
        revenue: savedLawyer.revenue,
        isSubscribed: savedLawyer.is_subscribed,
        hasFreeCaseUsed: savedLawyer.received_free_case,
        subscription_date: savedLawyer.subscription_date,
        notes: newLawyer.notes || ''
      };

      setLawyers([...lawyers, localLawyer]);
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المحامي بنجاح",
      });
    } catch (error) {
      console.error('Error adding lawyer:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة المحامي",
        variant: "destructive",
      });
      return;
    }

    setNewLawyer({
      name: "",
      phone: "",
      governorate: "غير محدد",
      gender: "ذكر",
      status: "active",
      maxCases: 10,
      availableCases: 10,
      takenCases: 0,
      pricePerCase: 150,
      revenue: 0,
      isSubscribed: false,
      hasFreeCaseUsed: false,
      notes: ""
    });
    setIsAddDialogOpen(false);
  };

  const editLawyer = (lawyer: Lawyer) => {
    setEditingLawyer(lawyer);
    setIsEditDialogOpen(true);
  };

  const updateLawyer = async () => {
    if (!editingLawyer?.name || !editingLawyer?.phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الاسم ورقم الهاتف على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateData = {
        name: editingLawyer.name,
        mobile: editingLawyer.phone,
        governorate: editingLawyer.governorate || 'غير محدد',
        gender: editingLawyer.gender || 'ذكر',
        subscription_amount: editingLawyer.pricePerCase || 150,
        total_cases: editingLawyer.maxCases || 10,
        consumed_cases: editingLawyer.takenCases || 0,
        remaining_cases: (editingLawyer.maxCases || 10) - (editingLawyer.takenCases || 0),
        available_cases: (editingLawyer.maxCases || 10) - (editingLawyer.takenCases || 0),
        price_per_case: editingLawyer.pricePerCase || 150,
        revenue: editingLawyer.revenue || 0,
        participated: editingLawyer.status === 'active',
        subscribed: editingLawyer.isSubscribed || false,
        is_subscribed: editingLawyer.isSubscribed || false,
        received_free_case: editingLawyer.hasFreeCaseUsed || false
      };

      await lawyersService.update(editingLawyer.id, updateData);

      const updatedLawyers = lawyers.map(lawyer => 
        lawyer.id === editingLawyer.id ? editingLawyer : lawyer
      );
      setLawyers(updatedLawyers);
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات المحامي بنجاح",
      });
    } catch (error) {
      console.error('Error updating lawyer:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث بيانات المحامي",
        variant: "destructive",
      });
      return;
    }

    setEditingLawyer(null);
    setIsEditDialogOpen(false);
  };

  const deleteLawyer = async (lawyerId: string) => {
    try {
      await lawyersService.delete(lawyerId);
      const updatedLawyers = lawyers.filter(lawyer => lawyer.id !== lawyerId);
      setLawyers(updatedLawyers);
      
      toast({
        title: "تم بنجاح",
        description: "تم حذف المحامي بنجاح",
      });
    } catch (error) {
      console.error('Error deleting lawyer:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف المحامي",
        variant: "destructive",
      });
    }
  };

  const handleReorder = (lawyer: Lawyer) => {
    setReorderingLawyer(lawyer);
    setReorderCases(1);
    setIsReorderDialogOpen(true);
  };

  const processReorder = async () => {
    if (!reorderingLawyer || reorderCases <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عدد صحيح من القضايا",
        variant: "destructive",
      });
      return;
    }

    try {
      // حساب القيم الجديدة
      const newTotalCases = (reorderingLawyer.maxCases || 0) + reorderCases;
      const newAvailableCases = (reorderingLawyer.availableCases || 0) + reorderCases;
      const additionalRevenue = reorderCases * (reorderingLawyer.pricePerCase || 0);
      const newRevenue = (reorderingLawyer.revenue || 0) + additionalRevenue;
      const newReorders = (reorderingLawyer.reorders || 0) + 1;

      // تحديث البيانات في قاعدة البيانات
      const updateData = {
        total_cases: newTotalCases,
        available_cases: newAvailableCases,
        remaining_cases: newAvailableCases,
        revenue: newRevenue,
        reorders: newReorders,
        reorder_date: new Date().toISOString().split('T')[0]
      };

      await lawyersService.update(reorderingLawyer.id, updateData);

      // تحديث البيانات المحلية
      const updatedLawyers = lawyers.map(lawyer => {
        if (lawyer.id === reorderingLawyer.id) {
          return {
            ...lawyer,
            maxCases: newTotalCases,
            availableCases: newAvailableCases,
            revenue: newRevenue,
            reorders: newReorders,
            reorder_date: new Date().toISOString().split('T')[0]
          };
        }
        return lawyer;
      });

      setLawyers(updatedLawyers);

      // إضافة مصروف إعادة الطلب
      const reorderExpense: Expense = {
        id: Date.now().toString(),
        title: `إعادة طلب - ${reorderingLawyer.name}`,
        amount: additionalRevenue,
        category: 'طلبات المحامين',
        date: new Date().toISOString().split('T')[0],
        description: `إعادة طلب ${reorderCases} قضية للمحامي ${reorderingLawyer.name}`,
        type: 'lawyer_orders'
      };

      setExpenses([...expenses, reorderExpense]);

      toast({
        title: "تم بنجاح",
        description: `تم إضافة ${reorderCases} قضية للمحامي ${reorderingLawyer.name} وتحديث الإيرادات بمبلغ ${additionalRevenue} جنيه`,
      });

      setIsReorderDialogOpen(false);
      setReorderingLawyer(null);
      setReorderCases(1);

    } catch (error) {
      console.error('Error processing reorder:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في معالجة إعادة الطلب",
        variant: "destructive",
      });
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(lawyers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'lawyers-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          setLawyers(importedData);
          toast({
            title: "تم بنجاح",
            description: `تم استيراد ${importedData.length} محامي`,
          });
        }
      } catch (error) {
        toast({
          title: "خطأ",
          description: "خطأ في قراءة الملف",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  // إحصائيات محسّنة
  const stats = useMemo(() => {
    const totalLawyers = lawyers.length;
    const activeLawyers = lawyers.filter(l => l.status === 'active').length;
    const subscribedLawyers = lawyers.filter(l => l.isSubscribed).length;
    const totalTakenCases = lawyers.reduce((sum, l) => sum + (l.takenCases || 0), 0);
    const totalAvailableCases = lawyers.reduce((sum, l) => sum + (l.availableCases || 0), 0);
    const totalRevenue = lawyers.reduce((sum, l) => sum + (l.revenue || 0), 0);
    const freeCasesUsed = lawyers.filter(l => l.hasFreeCaseUsed).length;
    const totalReorders = lawyers.reduce((sum, l) => sum + (l.reorders || 0), 0);

    return {
      totalLawyers,
      activeLawyers,
      subscribedLawyers,
      totalTakenCases,
      totalAvailableCases,
      totalRevenue,
      freeCasesUsed,
      totalReorders
    };
  }, [lawyers]);

  return (
    <div dir="rtl" lang="ar" className="space-y-6 font-arabic">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">إدارة المحامين</h2>
          <p className="text-muted-foreground">إدارة بيانات المحامين والسبونسر</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="ml-2 h-4 w-4" />
                محامي جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة محامي جديد</DialogTitle>
                <DialogDescription>إضافة محامي جديد إلى النظام</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-2">
                  <Label htmlFor="name">الاسم *</Label>
                  <Input
                    id="name"
                    value={newLawyer.name}
                    onChange={(e) => setNewLawyer({ ...newLawyer, name: e.target.value })}
                    placeholder="اسم المحامي"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    value={newLawyer.phone}
                    onChange={(e) => setNewLawyer({ ...newLawyer, phone: e.target.value })}
                    placeholder="+20 1XX XXX XXXX"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="governorate">المحافظة</Label>
                    <Input
                      id="governorate"
                      value={newLawyer.governorate}
                      onChange={(e) => setNewLawyer({ ...newLawyer, governorate: e.target.value })}
                      placeholder="المحافظة"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gender">النوع</Label>
                    <Select value={newLawyer.gender} onValueChange={(value) => setNewLawyer({ ...newLawyer, gender: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ذكر">ذكر</SelectItem>
                        <SelectItem value="انثى">انثى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="maxCases">عدد القضايا</Label>
                    <Input
                      id="maxCases"
                      type="number"
                      value={newLawyer.maxCases}
                      onChange={(e) => setNewLawyer({ ...newLawyer, maxCases: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="pricePerCase">سعر القضية</Label>
                    <Input
                      id="pricePerCase"
                      type="number"
                      value={newLawyer.pricePerCase}
                      onChange={(e) => setNewLawyer({ ...newLawyer, pricePerCase: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea
                    id="notes"
                    value={newLawyer.notes}
                    onChange={(e) => setNewLawyer({ ...newLawyer, notes: e.target.value })}
                    placeholder="ملاحظات إضافية"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addLawyer}>إضافة المحامي</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={exportData}>
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>

          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="ml-2 h-4 w-4" />
              استيراد
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المحامين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLawyers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">النشطون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.activeLawyers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">المشتركون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{stats.subscribedLawyers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">القضايا المأخوذة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.totalTakenCases}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">القضايا المتاحة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalAvailableCases}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-success">{stats.totalRevenue.toLocaleString('ar-EG')} ج.م</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">القضايا المجانية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.freeCasesUsed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إعادة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalReorders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        filterOptions={filterOptions}
        placeholder="البحث في المحامين..."
        hasActiveFilters={hasActiveFilters}
        resultCount={resultCount}
        totalCount={totalCount}
      />

      {/* Lawyers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            قائمة المحامين ({filteredLawyers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>المحافظة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>القضايا</TableHead>
                  <TableHead>المتاحة</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>الإيرادات</TableHead>
                  <TableHead>إعادة الطلبات</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLawyers.map((lawyer) => (
                  <TableRow key={lawyer.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{lawyer.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {lawyer.phone}
                      </div>
                    </TableCell>
                    <TableCell>{lawyer.governorate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={lawyer.status === 'active' ? 'default' : 'secondary'}>
                          {lawyer.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                        {lawyer.isSubscribed && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            <UserCheck className="h-3 w-3 mr-1" />
                            مشترك
                          </Badge>
                        )}
                        {lawyer.hasFreeCaseUsed && (
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                            <Gift className="h-3 w-3 mr-1" />
                            قضية مجانية
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-bold">{lawyer.takenCases || 0}/{lawyer.maxCases || 0}</div>
                        <div className="text-xs text-muted-foreground">مأخوذة/إجمالي</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          (lawyer.availableCases || 0) > 0 ? 'default' : 'secondary'
                        }
                        className={
                          (lawyer.availableCases || 0) > 0 
                            ? 'bg-success text-success-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {lawyer.availableCases || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>{(lawyer.pricePerCase || 0).toLocaleString('ar-EG')} ج.م</TableCell>
                    <TableCell className="font-bold text-success">
                      {(lawyer.revenue || 0).toLocaleString('ar-EG')} ج.م
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-info/10 text-info border-info/20">
                        {lawyer.reorders || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editLawyer(lawyer)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorder(lawyer)}
                          className="h-8 w-8 p-0 text-primary hover:text-primary"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteLawyer(lawyer.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المحامي</DialogTitle>
            <DialogDescription>تعديل بيانات المحامي في النظام</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="editName">الاسم *</Label>
              <Input
                id="editName"
                value={editingLawyer?.name || ""}
                onChange={(e) => setEditingLawyer(editingLawyer ? { ...editingLawyer, name: e.target.value } : null)}
                placeholder="اسم المحامي"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPhone">رقم الهاتف *</Label>
              <Input
                id="editPhone"
                value={editingLawyer?.phone || ""}
                onChange={(e) => setEditingLawyer(editingLawyer ? { ...editingLawyer, phone: e.target.value } : null)}
                placeholder="+20 1XX XXX XXXX"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editGovernorate">المحافظة</Label>
                <Input
                  id="editGovernorate"
                  value={editingLawyer?.governorate || ""}
                  onChange={(e) => setEditingLawyer(editingLawyer ? { ...editingLawyer, governorate: e.target.value } : null)}
                  placeholder="المحافظة"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editGender">النوع</Label>
                <Select 
                  value={editingLawyer?.gender || "ذكر"} 
                  onValueChange={(value) => setEditingLawyer(editingLawyer ? { ...editingLawyer, gender: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ذكر">ذكر</SelectItem>
                    <SelectItem value="انثى">انثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editMaxCases">إجمالي القضايا</Label>
                <Input
                  id="editMaxCases"
                  type="number"
                  value={editingLawyer?.maxCases || 0}
                  onChange={(e) => setEditingLawyer(editingLawyer ? { 
                    ...editingLawyer, 
                    maxCases: parseInt(e.target.value) || 0,
                    availableCases: (parseInt(e.target.value) || 0) - (editingLawyer.takenCases || 0)
                  } : null)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editTakenCases">القضايا المأخوذة</Label>
                <Input
                  id="editTakenCases"
                  type="number"
                  value={editingLawyer?.takenCases || 0}
                  onChange={(e) => setEditingLawyer(editingLawyer ? { 
                    ...editingLawyer, 
                    takenCases: parseInt(e.target.value) || 0,
                    availableCases: (editingLawyer.maxCases || 0) - (parseInt(e.target.value) || 0)
                  } : null)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editPricePerCase">سعر القضية</Label>
                <Input
                  id="editPricePerCase"
                  type="number"
                  value={editingLawyer?.pricePerCase || 0}
                  onChange={(e) => setEditingLawyer(editingLawyer ? { ...editingLawyer, pricePerCase: parseFloat(e.target.value) || 0 } : null)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editNotes">ملاحظات</Label>
              <Textarea
                id="editNotes"
                value={editingLawyer?.notes || ""}
                onChange={(e) => setEditingLawyer(editingLawyer ? { ...editingLawyer, notes: e.target.value } : null)}
                placeholder="ملاحظات إضافية"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
            <Button onClick={updateLawyer}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reorder Dialog */}
      <Dialog open={isReorderDialogOpen} onOpenChange={setIsReorderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إعادة طلب قضايا</DialogTitle>
            <DialogDescription>
              إضافة قضايا جديدة للمحامي {reorderingLawyer?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>القضايا الحالية:</span>
                <span className="font-bold">{reorderingLawyer?.maxCases || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>القضايا المتاحة:</span>
                <span className="font-bold text-success">{reorderingLawyer?.availableCases || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>سعر القضية:</span>
                <span className="font-bold">{(reorderingLawyer?.pricePerCase || 0).toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>الإيرادات الحالية:</span>
                <span className="font-bold text-success">{(reorderingLawyer?.revenue || 0).toLocaleString('ar-EG')} ج.م</span>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="reorderCases">عدد القضايا الجديدة</Label>
              <Input
                id="reorderCases"
                type="number"
                min="1"
                value={reorderCases}
                onChange={(e) => setReorderCases(parseInt(e.target.value) || 1)}
                placeholder="عدد القضايا المطلوب إضافتها"
              />
            </div>

            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">ملخص إعادة الطلب:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>القضايا الجديدة:</span>
                  <span className="font-bold">+{reorderCases}</span>
                </div>
                <div className="flex justify-between">
                  <span>إجمالي القضايا بعد الإضافة:</span>
                  <span className="font-bold">{(reorderingLawyer?.maxCases || 0) + reorderCases}</span>
                </div>
                <div className="flex justify-between">
                  <span>القضايا المتاحة الجديدة:</span>
                  <span className="font-bold text-success">{(reorderingLawyer?.availableCases || 0) + reorderCases}</span>
                </div>
                <div className="flex justify-between">
                  <span>التكلفة الإضافية:</span>
                  <span className="font-bold text-primary">
                    {(reorderCases * (reorderingLawyer?.pricePerCase || 0)).toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>إجمالي الإيرادات الجديدة:</span>
                  <span className="font-bold text-success">
                    {((reorderingLawyer?.revenue || 0) + (reorderCases * (reorderingLawyer?.pricePerCase || 0))).toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReorderDialogOpen(false)}>إلغاء</Button>
            <Button onClick={processReorder} className="bg-primary">
              <RefreshCw className="ml-2 h-4 w-4" />
              إنشاء الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}