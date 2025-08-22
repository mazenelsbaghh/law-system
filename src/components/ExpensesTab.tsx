import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Expense, Budget } from '@/types/crm';
import { Plus, Trash2, DollarSign, TrendingDown, Calendar } from 'lucide-react';
import { expensesService } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';

interface ExpensesTabProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  budget: Budget;
  setBudget: React.Dispatch<React.SetStateAction<Budget>>;
}

const ExpensesTab: React.FC<ExpensesTabProps> = ({ expenses, setExpenses, budget, setBudget }) => {
  const { toast } = useToast();
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    title: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'operational'
  });

  const [newBudget, setNewBudget] = useState<Partial<Budget>>({
    totalBudget: budget.totalBudget || 0,
    month: new Date().toLocaleString('ar-EG', { month: 'long' }),
    year: new Date().getFullYear()
  });

  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);

  const addExpense = async () => {
    if (newExpense.title && newExpense.amount && newExpense.category) {
      try {
        const expenseData = {
          description: newExpense.title,
          amount: newExpense.amount,
          category: newExpense.category,
          date: newExpense.date || new Date().toISOString().split('T')[0]
        };

        const savedExpense = await expensesService.create(expenseData);
        
        const localExpense: Expense = {
          id: savedExpense.id,
          title: savedExpense.description,
          amount: savedExpense.amount,
          category: savedExpense.category,
          date: savedExpense.date,
          description: newExpense.description,
          type: newExpense.type as 'operational' | 'marketing' | 'legal' | 'lawyer_orders' | 'other'
        };

        setExpenses([...expenses, localExpense]);
        
        // Update budget
        const updatedUsedBudget = budget.usedBudget + localExpense.amount;
        setBudget({
          ...budget,
          usedBudget: updatedUsedBudget,
          remainingBudget: budget.totalBudget - updatedUsedBudget
        });

        toast({
          title: "تم بنجاح",
          description: "تم إضافة المصروف بنجاح",
        });
      } catch (error) {
        console.error('Error adding expense:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ في إضافة المصروف",
          variant: "destructive",
        });
        return;
      }

      setNewExpense({
        title: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'operational'
      });
      setIsExpenseDialogOpen(false);
    }
  };

  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(e => e.id === id);
    if (expenseToDelete) {
      setExpenses(expenses.filter(e => e.id !== id));
      
      // Update budget
      const updatedUsedBudget = budget.usedBudget - expenseToDelete.amount;
      setBudget({
        ...budget,
        usedBudget: updatedUsedBudget,
        remainingBudget: budget.totalBudget - updatedUsedBudget
      });
    }
  };

  const updateBudget = () => {
    if (newBudget.totalBudget && newBudget.month && newBudget.year) {
      const updatedBudget: Budget = {
        id: budget.id || Date.now().toString(),
        totalBudget: newBudget.totalBudget,
        usedBudget: budget.usedBudget,
        remainingBudget: newBudget.totalBudget - budget.usedBudget,
        month: newBudget.month,
        year: newBudget.year
      };
      setBudget(updatedBudget);
      setIsBudgetDialogOpen(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'operational': return 'bg-blue-100 text-blue-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'operational': return 'تشغيلي';
      case 'marketing': return 'تسويق';
      case 'legal': return 'قانوني';
      case 'other': return 'أخرى';
      default: return 'غير محدد';
    }
  };

  const budgetUsagePercentage = budget.totalBudget > 0 ? (budget.usedBudget / budget.totalBudget) * 100 : 0;
  const safeBudgetUsagePercentage = isNaN(budgetUsagePercentage) ? 0 : budgetUsagePercentage;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByType = expenses.reduce((acc, expense) => {
    acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الميزانية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budget.totalBudget.toLocaleString('ar-EG')} ج.م</div>
            <p className="text-xs text-muted-foreground">
              {budget.month} {budget.year}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المصاريف المستخدمة</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budget.usedBudget.toLocaleString('ar-EG')} ج.م</div>
            <Progress value={safeBudgetUsagePercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {safeBudgetUsagePercentage.toFixed(1)}% من الميزانية
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الميزانية المتبقية</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budget.remainingBudget.toLocaleString('ar-EG')} ج.م</div>
            <p className="text-xs text-muted-foreground">
              {((budget.remainingBudget / budget.totalBudget) * 100).toFixed(1)}% متبقية
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              إضافة مصروف جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>إضافة مصروف جديد</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">العنوان</Label>
                <Input
                  id="title"
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">المبلغ</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">الفئة</Label>
                <Input
                  id="category"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">النوع</Label>
                <Select value={newExpense.type} onValueChange={(value) => setNewExpense({ ...newExpense, type: value as any })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">تشغيلي</SelectItem>
                    <SelectItem value="marketing">تسويق</SelectItem>
                    <SelectItem value="legal">قانوني</SelectItem>
                    <SelectItem value="lawyer_orders">طلبات المحامين</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">التاريخ</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">الوصف</Label>
                <Textarea
                  id="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>إلغاء</Button>
              <Button onClick={addExpense}>إضافة</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              تحديث الميزانية
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>تحديث الميزانية</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalBudget" className="text-right">إجمالي الميزانية</Label>
                <Input
                  id="totalBudget"
                  type="number"
                  value={newBudget.totalBudget}
                  onChange={(e) => setNewBudget({ ...newBudget, totalBudget: parseFloat(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="month" className="text-right">الشهر</Label>
                <Input
                  id="month"
                  value={newBudget.month}
                  onChange={(e) => setNewBudget({ ...newBudget, month: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">السنة</Label>
                <Input
                  id="year"
                  type="number"
                  value={newBudget.year}
                  onChange={(e) => setNewBudget({ ...newBudget, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)}>إلغاء</Button>
              <Button onClick={updateBudget}>تحديث</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>تاريخ المصاريف</CardTitle>
          <CardDescription>
            إجمالي المصاريف: {totalExpenses.toLocaleString('ar-EG')} ج.م
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">المبلغ</TableHead>
                <TableHead className="text-right">الفئة</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.title}</TableCell>
                  <TableCell>{expense.amount.toLocaleString('ar-EG')} ج.م</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(expense.type)}>
                      {getTypeLabel(expense.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString('ar-EG')}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesTab;