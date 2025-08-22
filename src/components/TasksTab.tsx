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
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Task } from "@/types/crm";
import { useToast } from "@/hooks/use-toast";
import { tasksService } from "@/lib/database";

interface TasksTabProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export function TasksTab({ tasks, setTasks }: TasksTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    assignee: "",
    dueDate: "",
    status: "pending",
    progress: 0,
    description: "",
    sprintNumber: Math.ceil(Date.now() / (15 * 24 * 60 * 60 * 1000))
  });
  const { toast } = useToast();

  const currentSprint = Math.ceil(Date.now() / (15 * 24 * 60 * 60 * 1000));
  
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addTask = async () => {
    if (!newTask.title || !newTask.assignee || !newTask.dueDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const taskData = {
        title: newTask.title!,
        description: newTask.description || '',
        assignee: newTask.assignee!,
        priority: 'متوسطة' as const,
        status: 'جديدة' as const,
        dueDate: newTask.dueDate!
      };

      const savedTask = await tasksService.create(taskData);
      
      const localTask: Task = {
        id: savedTask.id,
        title: savedTask.title,
        description: savedTask.description || '',
        assignee: savedTask.assignee,
        status: 'pending',
        dueDate: savedTask.dueDate,
        progress: 0,
        sprintNumber: currentSprint
      };

      setTasks([...tasks, localTask]);
      setNewTask({
        title: "",
        assignee: "",
        dueDate: "",
        status: "pending",
        progress: 0,
        description: "",
        sprintNumber: currentSprint
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المهمة بنجاح",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة المهمة",
        variant: "destructive",
      });
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const currentSprintTasks = tasks.filter(t => t.sprintNumber === currentSprint);

  return (
    <div dir="rtl" lang="ar" className="space-y-6 font-arabic">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">إدارة المهام</h2>
          <p className="text-muted-foreground">مهام كل 15 يوم - السبرنت الحالي: {currentSprint}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="ml-2 h-4 w-4" />
               مهمة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>إضافة مهمة جديدة</DialogTitle>
              <DialogDescription>إضافة مهمة للسبرنت الحالي</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">عنوان المهمة *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="عنوان المهمة"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assignee">المسؤول *</Label>
                <Input
                  id="assignee"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  placeholder="اسم المسؤول"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">تاريخ الاستحقاق *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="وصف المهمة"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addTask}>إضافة المهمة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">مهام السبرنت الحالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{currentSprintTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">المهام المكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">معدل الإنجاز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">
              {tasks.length > 0 ? ((completedTasks / tasks.length) * 100).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="البحث في المهام..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المهام ({filteredTasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العنوان</TableHead>
                  <TableHead>المسؤول</TableHead>
                  <TableHead>تاريخ الاستحقاق</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التقدم</TableHead>
                  <TableHead>السبرنت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell>{new Date(task.dueDate).toLocaleDateString('ar-EG')}</TableCell>
                    <TableCell>
                      <Badge variant={task.status === 'completed' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}>
                        {task.status === 'completed' ? 'مكتملة' : task.status === 'in-progress' ? 'قيد التنفيذ' : 'قيد الانتظار'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={task.progress} className="h-2" />
                        <span className="text-xs text-muted-foreground">{task.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{task.sprintNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}