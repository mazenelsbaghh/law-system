import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Edit, Trash2, Scale, Phone } from "lucide-react";
import { Lawyer, Expense, Campaign } from "@/types/crm";
import { useToast } from "@/hooks/use-toast";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLawyer, setNewLawyer] = useState<Omit<Lawyer, "id">>({
    name: "",
    phone: "",
    governorate: "",
    campaignId: "",
    status: "active",
    maxCases: 10,
    availableCases: 0,
    takenCases: 0,
    pricePerCase: 0,
    isSubscribed: false,
    hasFreeCaseUsed: false,
    notes: ""
  });
  const { toast } = useToast();
  
  // حالة حوار أخذ قضية مع تاريخ مخصص
  const [takeCaseDialogOpen, setTakeCaseDialogOpen] = useState(false);
  const [selectedLawyerForCase, setSelectedLawyerForCase] = useState<string>("");
  const [customCaseDate, setCustomCaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredLawyers = lawyers.filter(lawyer =>
    lawyer.id.toString().includes(searchTerm)
  );

  const addLawyer = async () => {
    if (!newLawyer.name || !newLawyer.phone || !newLawyer.governorate || !newLawyer.maxCases || newLawyer.maxCases <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، المحافظة) وتحديد عدد صحيح للقضايا المسموح بها",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert local lawyer data to Supabase format using correct column names
      const supabaseLawyer = {
        name: newLawyer.name,
        phone: newLawyer.phone,
        mobile: newLawyer.phone, // Use phone as mobile for now
        governorate: newLawyer.governorate,
        gender: 'male', // Default value
        subscription_amount: 0,
        send_method: 'whatsapp',
        total_cases: newLawyer.maxCases,
        consumed_cases: newLawyer.takenCases,
        remaining_cases: Math.max(0, newLawyer.maxCases - newLawyer.takenCases),
        available_cases: Math.max(0, newLawyer.maxCases - newLawyer.takenCases),
        price_per_case: newLawyer.pricePerCase,
        revenue: newLawyer.takenCases * newLawyer.pricePerCase,
        participated: newLawyer.status === 'active',
        subscribed: newLawyer.isSubscribed,
        received_free_case: newLawyer.hasFreeCaseUsed || false,
        is_subscribed: newLawyer.isSubscribed,
        // Legacy fields for backward compatibility
        cases: newLawyer.takenCases,
        maxcases: newLawyer.maxCases,
        availablecases: Math.max(0, newLawyer.maxCases - newLawyer.takenCases),
        pricepercase: newLawyer.pricePerCase,
        receivedfreecase: newLawyer.hasFreeCaseUsed || false,
        receivedFreeCase: newLawyer.hasFreeCaseUsed || false // For backward compatibility
      };

      const createdLawyer = await lawyersService.create(supabaseLawyer);
      
      // Convert back to local format and add to state using correct column names
      const localLawyer: Lawyer = {
        id: createdLawyer.id,
        name: createdLawyer.name,
        phone: createdLawyer.phone || createdLawyer.mobile || '',
        mobile: createdLawyer.mobile,
        governorate: createdLawyer.governorate,
        gender: createdLawyer.gender,
        status: createdLawyer.participated ? 'active' : 'inactive',
        // Use database column names directly
        total_cases: createdLawyer.total_cases,
        consumed_cases: createdLawyer.consumed_cases,
        remaining_cases: createdLawyer.remaining_cases,
        available_cases: createdLawyer.available_cases,
        price_per_case: createdLawyer.price_per_case,
        subscription_amount: createdLawyer.subscription_amount,
        send_method: createdLawyer.send_method,
        received_free_case: createdLawyer.received_free_case,
        is_subscribed: createdLawyer.is_subscribed,
        // Legacy fields for backward compatibility
        maxCases: createdLawyer.total_cases || newLawyer.maxCases,
        availableCases: createdLawyer.available_cases || Math.max(0, newLawyer.maxCases - (createdLawyer.consumed_cases || 0)),
        takenCases: createdLawyer.consumed_cases || 0,
        pricePerCase: createdLawyer.price_per_case || newLawyer.pricePerCase,
        revenue: createdLawyer.revenue || 0,
        isSubscribed: createdLawyer.subscribed,
        hasFreeCaseUsed: (createdLawyer as any).receivedfreecase || false,
        notes: newLawyer.notes,
        campaignId: newLawyer.campaignId === 'none' ? undefined : newLawyer.campaignId
      };

      setLawyers([...lawyers, localLawyer]);
      setNewLawyer({
        name: "",
        phone: "",
        governorate: "",
        campaignId: "",
        status: "active",
        maxCases: 10,
        availableCases: 0,
        takenCases: 0,
        pricePerCase: 0,
        isSubscribed: false,
        hasFreeCaseUsed: false,
        notes: ""
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المحامي بنجاح",
      });
      
      if (onDataChange) onDataChange();
     } catch (error) {
       console.error('Error adding lawyer:', error);
       toast({
         title: "خطأ",
         description: "حدث خطأ في إضافة المحامي",
         variant: "destructive",
       });
     }
   };

  const deleteLawyer = (id: string) => {
    // Check if lawyer has taken cases
    const lawyer = lawyers.find(l => l.id === id);
    if (lawyer && lawyer.takenCases && lawyer.takenCases > 0) {
      toast({
        title: "لا يمكن الحذف",
        description: `المحامي لديه ${lawyer.takenCases} قضية مأخوذة`,
        variant: "destructive",
      });
      return;
    }

    setLawyers(lawyers.filter(lawyer => lawyer.id !== id));
    toast({
      title: "تم الحذف",
      description: "تم حذف المحامي بنجاح",
    });
  };

  const toggleSubscription = (id: string) => {
    // فتح dialog الاشتراك
    setSelectedLawyerId(id);
    setSubscriptionDialogOpen(true);
  };

  const createSubscription = async () => {
    const lawyer = lawyers.find(l => l.id === selectedLawyerId);
    if (!lawyer) return;

    const totalAmount = subscriptionCases * subscriptionPrice;
    const subscriptionDateISO = new Date(subscriptionDate + 'T00:00:00').toISOString();
    
    try {
      // تحديث بيانات المحامي في قاعدة البيانات
      const updatedLawyer = await lawyersService.update(selectedLawyerId, {
        subscribed: true,
        subscription_date: subscriptionDateISO,
        cases: subscriptionCases,
        maxcases: subscriptionCases,
        availablecases: subscriptionCases,
        pricepercase: subscriptionPrice,
        revenue: totalAmount
      });
      
      // إضافة المصروف إلى قائمة المصروفات
      const newExpense: Expense = {
        id: Date.now().toString(),
        title: `اشتراك المحامي ${lawyer.name}`,
        amount: totalAmount,
        category: "طلبات المحامين",
        date: new Date().toISOString().split('T')[0],
        description: `اشتراك ${subscriptionCases} قضايا بسعر ${subscriptionPrice} ج.م للقضية الواحدة - تاريخ الاشتراك: ${new Date(subscriptionDateISO).toLocaleDateString('ar-EG')}`,
        type: "lawyer_orders"
      };
      
      setExpenses([...expenses, newExpense]);
      
      // تحديث بيانات المحامي محلياً
      setLawyers(lawyers.map(l => 
        l.id === selectedLawyerId 
          ? { ...l, isSubscribed: true, subscription_date: subscriptionDateISO, revenue: totalAmount, availableCases: subscriptionCases, pricePerCase: subscriptionPrice }
          : l
      ));
      
      toast({
        title: "تم الاشتراك",
        description: `تم اشتراك المحامي ${lawyer.name} بـ ${subscriptionCases} قضايا بمبلغ ${totalAmount.toLocaleString('ar-EG')} جنيه في ${new Date(subscriptionDateISO).toLocaleDateString('ar-EG')}`,
      });
      
      setSubscriptionDialogOpen(false);
      setSubscriptionCases(1);
      setSubscriptionPrice(0);
      setSubscriptionDate(new Date().toISOString().split('T')[0]);
      setSelectedLawyerId("");
      
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث الاشتراك",
        variant: "destructive",
      });
    }
  };

  // دالة أخذ قضية مع تاريخ مخصص
  const takeCaseWithCustomDate = async () => {
    if (!selectedLawyerForCase || !customCaseDate) {
      toast({
        title: "خطأ",
        description: "يرجى تحديد المحامي والتاريخ",
        variant: "destructive",
      });
      return;
    }

    const lawyer = lawyers.find(l => l.id === selectedLawyerForCase);
    if (!lawyer) {
      toast({
        title: "خطأ",
        description: "المحامي غير موجود",
        variant: "destructive",
      });
      return;
    }

    if (lawyer.availableCases <= 0) {
      toast({
        title: "خطأ",
        description: "لا توجد قضايا متاحة لهذا المحامي",
        variant: "destructive",
      });
      return;
    }

    try {
      const newAvailableCases = lawyer.availableCases - 1;
      const newTakenCases = lawyer.takenCases + 1;
      
      // تحديث بيانات المحامي في قاعدة البيانات
       await lawyersService.update(selectedLawyerForCase, {
         cases: newTakenCases,
         availablecases: newAvailableCases,
         lastCaseDate: customCaseDate
       });

      setLawyers(lawyers.map(l => 
        l.id === selectedLawyerForCase 
          ? { ...l, availableCases: newAvailableCases, takenCases: newTakenCases, lastCaseDate: customCaseDate }
          : l
      ));
      
      toast({
        title: "تم أخذ قضية",
        description: `تم أخذ قضية من ${lawyer.name} بتاريخ ${new Date(customCaseDate).toLocaleDateString('ar-EG')}. القضايا المتبقية: ${newAvailableCases}`,
      });
      
      // إغلاق الحوار وإعادة تعيين القيم
      setTakeCaseDialogOpen(false);
      setSelectedLawyerForCase("");
      setCustomCaseDate(new Date().toISOString().split('T')[0]);
      
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error taking case with custom date:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في أخذ القضية",
        variant: "destructive",
      });
    }
  };

  const takeCase = async (id: string) => {
    const lawyer = lawyers.find(l => l.id === id);
    if (!lawyer || !lawyer.isSubscribed || lawyer.availableCases <= 0) {
      toast({
        title: "لا يمكن أخذ قضية",
        description: lawyer?.isSubscribed ? "لا توجد قضايا متاحة" : "المحامي غير مشترك",
        variant: "destructive",
      });
      return;
    }

    try {
      const newAvailableCases = lawyer.availableCases - 1;
      const newTakenCases = (lawyer.takenCases || 0) + 1;
      const caseDate = new Date().toISOString().split('T')[0];
      
      // تحديث بيانات المحامي في قاعدة البيانات
         await lawyersService.update(id, {
           cases: newAvailableCases,
           lastCaseDate: caseDate
         });

      setLawyers(lawyers.map(l => 
        l.id === id 
          ? { ...l, availableCases: newAvailableCases, takenCases: newTakenCases, lastCaseDate: caseDate }
          : l
      ));
      
      toast({
         title: "تم أخذ قضية",
         description: `تم أخذ قضية من ${lawyer.name} بتاريخ ${new Date().toLocaleDateString('ar-EG')}. القضايا المتبقية: ${newAvailableCases}`,
       });
       
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error taking case:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في أخذ القضية",
        variant: "destructive",
      });
    }
  };

  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>("");
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);
  const [orderCases, setOrderCases] = useState(1);
  const [subscriptionCases, setSubscriptionCases] = useState(1);
  const [subscriptionPrice, setSubscriptionPrice] = useState(0);
  const [subscriptionDate, setSubscriptionDate] = useState(new Date().toISOString().split('T')[0]);

  const createOrder = async () => {
    const lawyer = lawyers.find(l => l.id === selectedLawyerId);
    if (!lawyer) return;

    const totalAmount = orderCases * lawyer.pricePerCase;
    const reorderDate = orderDate ? new Date(orderDate).toISOString() : new Date().toISOString();
    
    try {
      // تحديث بيانات المحامي في قاعدة البيانات
      const updatedLawyer = await lawyersService.update(selectedLawyerId, {
        reorder_date: reorderDate
      });
      
      // إضافة المصروف إلى قائمة المصروفات
      const newExpense: Expense = {
        id: Date.now().toString(),
        title: `طلب قضايا للمحامي ${lawyer.name}`,
        amount: totalAmount,
        category: "طلبات المحامين",
        date: orderDate || new Date().toISOString().split('T')[0],
        description: `طلب ${orderCases} قضايا بسعر ${lawyer.pricePerCase} ج.م للقضية الواحدة - تاريخ إعادة الطلب: ${new Date(reorderDate).toLocaleDateString('ar-EG')}`,
        type: "lawyer_orders"
      };
      
      setExpenses([...expenses, newExpense]);
      
      // تحديث القضايا المتاحة للمحامي محلياً
      setLawyers(lawyers.map(l => 
        l.id === selectedLawyerId 
          ? { ...l, availableCases: l.availableCases + orderCases, reorder_date: reorderDate }
          : l
      ));
      
      toast({
        title: "تم إنشاء الطلب",
        description: `طلب ${orderCases} قضايا للمحامي ${lawyer.name} بمبلغ ${totalAmount.toLocaleString('ar-EG')} جنيه في ${new Date(reorderDate).toLocaleDateString('ar-EG')}`,
      });
      
      setOrderDialogOpen(false);
      setOrderCases(1);
      setSelectedLawyerId("");
      
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error updating reorder:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إنشاء الطلب",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (lawyer: Lawyer) => {
    setEditingLawyer({ ...lawyer });
    setEditDialogOpen(true);
  };

  const saveEditedLawyer = async () => {
    if (!editingLawyer) return;

    try {
      // تحديث بيانات المحامي في قاعدة البيانات
      await lawyersService.update(editingLawyer.id, {
        name: editingLawyer.name,
        phone: editingLawyer.phone,
        governorate: editingLawyer.governorate,
        cases: editingLawyer.takenCases || 0,
        maxcases: editingLawyer.maxCases || 0,
        availablecases: editingLawyer.availableCases || 0,
        pricepercase: editingLawyer.pricePerCase || 0,
        revenue: (editingLawyer.takenCases || 0) * (editingLawyer.pricePerCase || 0),
        participated: editingLawyer.status === 'active',
        subscribed: editingLawyer.isSubscribed,
        receivedfreecase: editingLawyer.hasFreeCaseUsed || false,
        receivedFreeCase: editingLawyer.hasFreeCaseUsed || false
      });

      const updatedLawyer = {
        ...editingLawyer,
        revenue: (editingLawyer.takenCases || 0) * (editingLawyer.pricePerCase || 0)
      };
      
      setLawyers(lawyers.map(l => 
        l.id === editingLawyer.id ? updatedLawyer : l
      ));
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات المحامي وحفظها في قاعدة البيانات",
      });
      
      setEditDialogOpen(false);
      setEditingLawyer(null);
      
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error updating lawyer:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث بيانات المحامي",
        variant: "destructive",
      });
    }
  };

  const cancelSubscription = async () => {
    if (!editingLawyer) return;

    try {
      // تحديث بيانات المحامي في قاعدة البيانات
      await lawyersService.update(editingLawyer.id, {
        subscribed: false,
        cases: 0,
        maxcases: 0,
        availablecases: 0,
        pricepercase: 0,
        revenue: 0
      });

      const updatedLawyer = {
        ...editingLawyer,
        isSubscribed: false,
        availableCases: 0,
        takenCases: 0,
        pricePerCase: 0
      };

      // تحديث قائمة المحامين الأساسية
      setLawyers(lawyers.map(l => 
        l.id === editingLawyer.id ? updatedLawyer : l
      ));
      
      setEditingLawyer(updatedLawyer);
      
      toast({
        title: "تم إلغاء الاشتراك",
        description: "تم إلغاء اشتراك المحامي وحفظ التغييرات في قاعدة البيانات",
      });
      
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إلغاء الاشتراك",
        variant: "destructive",
      });
    }
  };

  const activateSubscription = async () => {
    if (!editingLawyer) return;

    try {
      const currentCases = editingLawyer.availableCases || 0;
      const newTotalCases = currentCases + subscriptionCases;
      const currentRevenue = editingLawyer.revenue || 0;
      const additionalRevenue = subscriptionCases * subscriptionPrice;
      const totalRevenue = currentRevenue + additionalRevenue;
      
      // تحديث بيانات المحامي في قاعدة البيانات
      await lawyersService.update(editingLawyer.id, {
        subscribed: true,
        cases: newTotalCases,
        maxcases: newTotalCases,
        availablecases: newTotalCases,
        pricepercase: subscriptionPrice,
        revenue: totalRevenue
      });

      const updatedLawyer = {
        ...editingLawyer,
        isSubscribed: true,
        availableCases: newTotalCases,
        pricePerCase: subscriptionPrice,
        revenue: totalRevenue
      };

      // تحديث قائمة المحامين الأساسية
      setLawyers(lawyers.map(l => 
        l.id === editingLawyer.id ? updatedLawyer : l
      ));
      
      setEditingLawyer(updatedLawyer);
      
      toast({
        title: "تم تفعيل الاشتراك",
        description: `تم إضافة ${subscriptionCases} قضايا جديدة. إجمالي القضايا المتاحة: ${newTotalCases}`,
      });
      
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error activating subscription:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تفعيل الاشتراك",
        variant: "destructive",
      });
    }
  };

  const addReorder = async () => {
    if (!editingLawyer) return;

    try {
      const newReorders = (editingLawyer.reorders || 0) + 1;
      
      // تحديث بيانات المحامي في قاعدة البيانات
      await lawyersService.update(editingLawyer.id, {
        reorders: newReorders
      });

      const updatedLawyer = {
        ...editingLawyer,
        reorders: newReorders
      };

      setLawyers(lawyers.map(l => 
        l.id === editingLawyer.id ? updatedLawyer : l
      ));
      
      setEditingLawyer(updatedLawyer);
      
      toast({
        title: "تم إضافة إعادة طلب",
        description: "تم إضافة إعادة طلب للمحامي وحفظ التغييرات في قاعدة البيانات",
      });
      
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error adding reorder:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة إعادة الطلب",
        variant: "destructive",
      });
    }
  };





  return (
    <div dir="rtl" lang="ar" className="space-y-6 font-arabic">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">إدارة المحامين</h2>
          <p className="text-muted-foreground">إدارة فريق المحامين والمستشارين</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="ml-2 h-4 w-4" />
              إضافة محامي جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>إضافة محامي جديد</DialogTitle>
              <DialogDescription>
                إضافة محامي أو مستشار جديد للفريق
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">اسم المحامي *</Label>
                <Input
                  id="name"
                  value={newLawyer.name}
                  onChange={(e) => setNewLawyer({ ...newLawyer, name: e.target.value })}
                  placeholder="الاسم الكامل"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <Input
                  id="phone"
                  value={newLawyer.phone}
                  onChange={(e) => setNewLawyer({ ...newLawyer, phone: e.target.value })}
                  placeholder="رقم الهاتف"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="governorate">المحافظة</Label>
                <Select
                  value={newLawyer.governorate}
                  onValueChange={(value) => setNewLawyer({ ...newLawyer, governorate: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المحافظة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="القاهرة">القاهرة</SelectItem>
                    <SelectItem value="الجيزة">الجيزة</SelectItem>
                    <SelectItem value="الإسكندرية">الإسكندرية</SelectItem>
                    <SelectItem value="الدقهلية">الدقهلية</SelectItem>
                    <SelectItem value="الشرقية">الشرقية</SelectItem>
                    <SelectItem value="القليوبية">القليوبية</SelectItem>
                    <SelectItem value="كفر الشيخ">كفر الشيخ</SelectItem>
                    <SelectItem value="الغربية">الغربية</SelectItem>
                    <SelectItem value="المنوفية">المنوفية</SelectItem>
                    <SelectItem value="البحيرة">البحيرة</SelectItem>
                    <SelectItem value="الإسماعيلية">الإسماعيلية</SelectItem>
                    <SelectItem value="بورسعيد">بورسعيد</SelectItem>
                    <SelectItem value="السويس">السويس</SelectItem>
                    <SelectItem value="المنيا">المنيا</SelectItem>
                    <SelectItem value="بني سويف">بني سويف</SelectItem>
                    <SelectItem value="الفيوم">الفيوم</SelectItem>
                    <SelectItem value="أسيوط">أسيوط</SelectItem>
                    <SelectItem value="سوهاج">سوهاج</SelectItem>
                    <SelectItem value="قنا">قنا</SelectItem>
                    <SelectItem value="أسوان">أسوان</SelectItem>
                    <SelectItem value="الأقصر">الأقصر</SelectItem>
                    <SelectItem value="البحر الأحمر">البحر الأحمر</SelectItem>
                    <SelectItem value="الوادي الجديد">الوادي الجديد</SelectItem>
                    <SelectItem value="مطروح">مطروح</SelectItem>
                    <SelectItem value="شمال سيناء">شمال سيناء</SelectItem>
                    <SelectItem value="جنوب سيناء">جنوب سيناء</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="campaignId">الحملة التسويقية</Label>
                <Select
                  value={newLawyer.campaignId}
                  onValueChange={(value) => setNewLawyer({ ...newLawyer, campaignId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحملة التسويقية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون حملة</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxCases">عدد القضايا المسموح بها *</Label>
                <Input
                  id="maxCases"
                  type="number"
                  min="1"
                  value={newLawyer.maxCases}
                  onChange={(e) => setNewLawyer({ ...newLawyer, maxCases: parseInt(e.target.value) || 10 })}
                  placeholder="عدد القضايا التي يمكن للمحامي التعامل معها"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">الحالة</Label>
                <Select
                  value={newLawyer.status}
                  onValueChange={(value: "active" | "inactive") => setNewLawyer({ ...newLawyer, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasFreeCaseUsed"
                  checked={newLawyer.hasFreeCaseUsed}
                  onCheckedChange={(checked) => setNewLawyer({ ...newLawyer, hasFreeCaseUsed: !!checked })}
                />
                <Label htmlFor="hasFreeCaseUsed">استخدم القضية المجانية</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addLawyer}>إضافة المحامي</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="البحث برقم المحامي..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          type="number"
        />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المحامين</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{lawyers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المحامون النشطون</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {lawyers.filter(l => l.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">القضايا النشطة</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">
              {lawyers.reduce((sum, lawyer) => sum + (lawyer.takenCases || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {lawyers.reduce((total, lawyer) => {
                return total + (lawyer.revenue || 0);
              }, 0).toLocaleString('ar-EG')} ج.م
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              من {lawyers.reduce((total, lawyer) => total + (lawyer.takenCases || 0), 0)} قضية
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المشتركون مؤخراً</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {lawyers.filter(l => l.isSubscribed && l.subscription_date).length}
            </div>
            <div className="text-xs text-muted-foreground mt-1 space-y-1">
              {lawyers
                .filter(l => l.isSubscribed && l.subscription_date)
                .sort((a, b) => new Date(b.subscription_date!).getTime() - new Date(a.subscription_date!).getTime())
                .slice(0, 2)
                .map(lawyer => (
                  <div key={lawyer.id} className="flex justify-between">
                    <span className="truncate max-w-[80px]">{lawyer.name}</span>
                    <span>{new Date(lawyer.subscription_date!).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lawyers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
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
                  <TableHead>الحالة</TableHead>
                  <TableHead>القضايا المتاحة</TableHead>
                  <TableHead>القضايا المأخوذة</TableHead>
                  <TableHead>الاشتراك</TableHead>
                  <TableHead>تاريخ الاشتراك</TableHead>
                  <TableHead>تاريخ إعادة الطلب</TableHead>
                  <TableHead>الملاحظات</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLawyers.map((lawyer) => (
                  <TableRow key={lawyer.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{lawyer.name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {lawyer.phone}
                    </TableCell>
                    <TableCell>
                      <Badge variant={lawyer.status === 'active' ? 'default' : 'secondary'}>
                        {lawyer.status === 'active' ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {lawyer.isSubscribed ? lawyer.availableCases : 0} قضية متاحة
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {lawyer.takenCases || 0} قضية مأخوذة
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {lawyer.isSubscribed ? (
                          <Badge variant="default" className="bg-green-600 text-white">
                            مشترك
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => toggleSubscription(lawyer.id)}
                            className="w-20"
                          >
                            اشترك
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lawyer.subscription_date ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-green-700">
                            {new Date(lawyer.subscription_date).toLocaleDateString('ar-EG')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            تاريخ الاشتراك
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">لم يشترك بعد</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lawyer.reorder_date ? (
                        <span className="text-sm text-muted-foreground">
                          {new Date(lawyer.reorder_date).toLocaleDateString('ar-EG')}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {lawyer.notes || "لا توجد ملاحظات"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {lawyer.isSubscribed && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => takeCase(lawyer.id)}
                              disabled={lawyer.availableCases <= 0}
                              className="text-xs px-2 py-1"
                            >
                              أخذ قضية
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedLawyerForCase(lawyer.id);
                                setTakeCaseDialogOpen(true);
                              }}
                              disabled={lawyer.availableCases <= 0}
                              className="text-xs px-2 py-1"
                            >
                              أخذ قضية بتاريخ
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedLawyerId(lawyer.id);
                                setOrderDialogOpen(true);
                              }}
                              className="text-xs px-2 py-1"
                            >
                              إعداد طلب
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(lawyer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteLawyer(lawyer.id)}
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

      {/* Dialog إعداد الطلب */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إعداد طلب قضايا جديدة</DialogTitle>
            <DialogDescription>
              {selectedLawyerId && (
                `إضافة قضايا جديدة للمحامي ${lawyers.find(l => l.id === selectedLawyerId)?.name}`
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="orderDate">تاريخ الطلب</Label>
              <Input
                id="orderDate"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                placeholder="تاريخ الطلب"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="orderCases">عدد القضايا المطلوبة</Label>
              <Input
                id="orderCases"
                type="number"
                min="1"
                value={orderCases}
                onChange={(e) => setOrderCases(parseInt(e.target.value) || 1)}
                placeholder="عدد القضايا"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="orderTotalAmount">المبلغ الإجمالي (ج.م)</Label>
              <Input
                id="orderTotalAmount"
                type="number"
                min="0"
                step="0.01"
                value={selectedLawyerId ? ((lawyers.find(l => l.id === selectedLawyerId)?.pricePerCase || 0) * orderCases) : 0}
                onChange={(e) => {
                  const totalAmount = parseFloat(e.target.value) || 0;
                  const newPricePerCase = orderCases > 0 ? totalAmount / orderCases : 0;
                  if (selectedLawyerId) {
                    setLawyers(lawyers.map(l => 
                      l.id === selectedLawyerId 
                        ? { ...l, pricePerCase: newPricePerCase }
                        : l
                    ));
                  }
                }}
                placeholder="المبلغ الإجمالي لجميع القضايا"
              />
            </div>
            {selectedLawyerId && (
              <div className="grid gap-2">
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-blue-800">سعر القضية الواحدة: {(orderCases > 0 ? ((lawyers.find(l => l.id === selectedLawyerId)?.pricePerCase || 0) * orderCases) / orderCases : 0).toLocaleString('ar-EG')} ج.م</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={createOrder}>
              إنشاء الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog الاشتراك */}
      <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>اشتراك المحامي</DialogTitle>
            <DialogDescription>
              {selectedLawyerId && (
                `تحديد عدد القضايا والسعر للمحامي ${lawyers.find(l => l.id === selectedLawyerId)?.name}`
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subscriptionCases">عدد القضايا</Label>
              <Input
                id="subscriptionCases"
                type="number"
                min="1"
                value={subscriptionCases}
                onChange={(e) => setSubscriptionCases(parseInt(e.target.value) || 1)}
                placeholder="عدد القضايا"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalAmount">المبلغ الإجمالي (ج.م)</Label>
              <Input
                id="totalAmount"
                type="number"
                min="0"
                step="0.01"
                value={subscriptionCases * subscriptionPrice}
                onChange={(e) => {
                  const totalAmount = parseFloat(e.target.value) || 0;
                  setSubscriptionPrice(subscriptionCases > 0 ? totalAmount / subscriptionCases : 0);
                }}
                placeholder="المبلغ الإجمالي"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pricePerCase">سعر القضية الواحدة (ج.م)</Label>
              <Input
                id="pricePerCase"
                type="number"
                min="0"
                step="0.01"
                value={subscriptionPrice}
                placeholder="سعر القضية الواحدة"
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subscriptionDate">تاريخ الاشتراك</Label>
              <Input
                id="subscriptionDate"
                type="date"
                value={subscriptionDate}
                onChange={(e) => setSubscriptionDate(e.target.value)}
                className="text-right"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubscriptionDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={createSubscription} disabled={subscriptionCases * subscriptionPrice <= 0}>
              تأكيد الاشتراك
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة تعديل المحامي */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المحامي</DialogTitle>
            <DialogDescription>
              يمكنك تعديل بيانات المحامي أو إلغاء اشتراكه
            </DialogDescription>
          </DialogHeader>
          {editingLawyer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  الاسم
                </Label>
                <Input
                  id="edit-name"
                  value={editingLawyer.name}
                  onChange={(e) => setEditingLawyer({ ...editingLawyer, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  الهاتف
                </Label>
                <Input
                  id="edit-phone"
                  value={editingLawyer.phone}
                  onChange={(e) => setEditingLawyer({ ...editingLawyer, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-governorate" className="text-right">
                  المحافظة
                </Label>
                <Select
                  value={editingLawyer.governorate || ""}
                  onValueChange={(value) => setEditingLawyer({ ...editingLawyer, governorate: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر المحافظة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="القاهرة">القاهرة</SelectItem>
                    <SelectItem value="الجيزة">الجيزة</SelectItem>
                    <SelectItem value="الإسكندرية">الإسكندرية</SelectItem>
                    <SelectItem value="الدقهلية">الدقهلية</SelectItem>
                    <SelectItem value="الشرقية">الشرقية</SelectItem>
                    <SelectItem value="القليوبية">القليوبية</SelectItem>
                    <SelectItem value="كفر الشيخ">كفر الشيخ</SelectItem>
                    <SelectItem value="الغربية">الغربية</SelectItem>
                    <SelectItem value="المنوفية">المنوفية</SelectItem>
                    <SelectItem value="البحيرة">البحيرة</SelectItem>
                    <SelectItem value="الإسماعيلية">الإسماعيلية</SelectItem>
                    <SelectItem value="بورسعيد">بورسعيد</SelectItem>
                    <SelectItem value="السويس">السويس</SelectItem>
                    <SelectItem value="المنيا">المنيا</SelectItem>
                    <SelectItem value="بني سويف">بني سويف</SelectItem>
                    <SelectItem value="الفيوم">الفيوم</SelectItem>
                    <SelectItem value="أسيوط">أسيوط</SelectItem>
                    <SelectItem value="سوهاج">سوهاج</SelectItem>
                    <SelectItem value="قنا">قنا</SelectItem>
                    <SelectItem value="أسوان">أسوان</SelectItem>
                    <SelectItem value="الأقصر">الأقصر</SelectItem>
                    <SelectItem value="البحر الأحمر">البحر الأحمر</SelectItem>
                    <SelectItem value="الوادي الجديد">الوادي الجديد</SelectItem>
                    <SelectItem value="مطروح">مطروح</SelectItem>
                    <SelectItem value="شمال سيناء">شمال سيناء</SelectItem>
                    <SelectItem value="جنوب سيناء">جنوب سيناء</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-campaignId" className="text-right">
                  الحملة التسويقية
                </Label>
                <Select
                  value={editingLawyer.campaignId || ""}
                  onValueChange={(value) => setEditingLawyer({ ...editingLawyer, campaignId: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر الحملة التسويقية" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون حملة</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-hasFreeCaseUsed" className="text-right">
                  القضية المجانية
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="edit-hasFreeCaseUsed"
                    checked={editingLawyer.hasFreeCaseUsed || false}
                    onCheckedChange={(checked) => setEditingLawyer({ ...editingLawyer, hasFreeCaseUsed: !!checked })}
                  />
                  <Label htmlFor="edit-hasFreeCaseUsed">استخدم القضية المجانية</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-available-cases" className="text-right">
                  القضايا المتاحة
                </Label>
                <Input
                  id="edit-available-cases"
                  type="number"
                  value={editingLawyer.availableCases}
                  onChange={(e) => setEditingLawyer({ ...editingLawyer, availableCases: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                  disabled={!editingLawyer.isSubscribed}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-taken-cases" className="text-right">
                  القضايا المأخوذة
                </Label>
                <Input
                  id="edit-taken-cases"
                  type="number"
                  value={editingLawyer.takenCases}
                  onChange={(e) => setEditingLawyer({ ...editingLawyer, takenCases: parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                  disabled={!editingLawyer.isSubscribed}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-total-revenue" className="text-right">
                  المبلغ الإجمالي
                </Label>
                <Input
                  id="edit-total-revenue"
                  type="number"
                  value={(editingLawyer.takenCases || 0) * (editingLawyer.pricePerCase || 0)}
                  onChange={(e) => {
                    const totalRevenue = parseFloat(e.target.value) || 0;
                    const takenCases = editingLawyer.takenCases || 0;
                    const pricePerCase = takenCases > 0 ? totalRevenue / takenCases : 0;
                    setEditingLawyer({ ...editingLawyer, pricePerCase });
                  }}
                  className="col-span-3"
                  disabled={!editingLawyer.isSubscribed}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">
                  سعر القضية الواحدة
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingLawyer.pricePerCase}
                  onChange={(e) => setEditingLawyer({ ...editingLawyer, pricePerCase: parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                  disabled={!editingLawyer.isSubscribed}
                  readOnly
                />
              </div>
              <div className="flex justify-center pt-2">
                {editingLawyer.isSubscribed ? (
                  <Button
                    variant="destructive"
                    onClick={cancelSubscription}
                    className="w-full"
                  >
                    إلغاء الاشتراك
                  </Button>
                ) : (
                   <Button
                     variant="default"
                     onClick={activateSubscription}
                     className="w-full"
                   >
                     تفعيل الاشتراك
                   </Button>
                 )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={saveEditedLawyer}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* حوار أخذ قضية مع تاريخ مخصص */}
      <Dialog open={takeCaseDialogOpen} onOpenChange={setTakeCaseDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>أخذ قضية بتاريخ مخصص</DialogTitle>
            <DialogDescription>
              حدد التاريخ الذي تم أخذ القضية فيه
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="case-date" className="text-right">
                تاريخ أخذ القضية
              </Label>
              <Input
                id="case-date"
                type="date"
                value={customCaseDate}
                onChange={(e) => setCustomCaseDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTakeCaseDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={takeCaseWithCustomDate}>
              أخذ القضية
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}