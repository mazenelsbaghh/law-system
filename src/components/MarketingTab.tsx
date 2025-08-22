import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, TrendingUp, Target, DollarSign, Users, MessageCircle, Calendar, Edit, Trash2 } from "lucide-react";
import { Campaign } from "@/types/crm";
import { useToast } from "@/hooks/use-toast";
import { campaignsService } from "@/lib/database";

interface MarketingTabProps {
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[]) => void;
  onDataChange?: () => void;
}

export function MarketingTab({ campaigns, setCampaigns, onDataChange }: MarketingTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    budget: 0,
    clients: 0,
    responses: 0,
    subscribers: 0,
    revenue: 0,
    status: "active",
    reorders: 0,
    lawyersData: []
  });
  const { toast } = useToast();

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        if (jsonData.participants && jsonData.nonParticipants && jsonData.freeCases) {
          setNewCampaign({
            ...newCampaign,
            lawyersData: [
              ...jsonData.participants.map((lawyer: any) => ({ ...lawyer, participated: true })),
              ...jsonData.nonParticipants.map((lawyer: any) => ({ ...lawyer, participated: false })),
              ...jsonData.freeCases.map((lawyer: any) => ({ ...lawyer, receivedFreeCase: true }))
            ]
          });
          toast({
            title: "تم رفع الملف بنجاح",
            description: `تم تحميل بيانات ${jsonData.participants.length + jsonData.nonParticipants.length + jsonData.freeCases.length} محامي`,
          });
        } else {
          toast({
            title: "خطأ في تنسيق الملف",
            description: "يجب أن يحتوي الملف على participants و nonParticipants و freeCases",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "خطأ في قراءة الملف",
          description: "تأكد من أن الملف بتنسيق JSON صحيح",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const addCampaign = () => {
    if (!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const campaign: Campaign = {
      ...newCampaign as Campaign,
      id: Date.now().toString(),
      reorders: newCampaign.reorders || 0,
      lawyersData: newCampaign.lawyersData || [],
    };

    setCampaigns([...campaigns, campaign]);
    setNewCampaign({
      name: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      budget: 0,
      clients: 0,
      responses: 0,
      subscribers: 0,
      revenue: 0,
      status: "active",
      reorders: 0,
      lawyersData: []
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "تم بنجاح",
      description: "تم إضافة الحملة بنجاح",
    });
  };

  const editCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsEditDialogOpen(true);
  };

  const updateCampaign = () => {
    if (!editingCampaign?.name || !editingCampaign?.startDate || !editingCampaign?.endDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const updatedCampaigns = campaigns.map(campaign => 
      campaign.id === editingCampaign.id ? editingCampaign : campaign
    );
    
    setCampaigns(updatedCampaigns);
    setEditingCampaign(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "تم بنجاح",
      description: "تم تحديث الحملة بنجاح",
    });
  };

  const deleteCampaign = (campaignId: string) => {
    const updatedCampaigns = campaigns.filter(campaign => campaign.id !== campaignId);
    setCampaigns(updatedCampaigns);
    
    toast({
      title: "تم بنجاح",
      description: "تم حذف الحملة بنجاح",
    });
  };

  const calculateCampaignDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateROI = (revenue: number, budget: number) => {
    if (budget === 0) return 0;
    return ((revenue - budget) / budget) * 100;
  };

  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const totalClients = campaigns.reduce((sum, c) => sum + c.clients, 0);
  const totalResponses = campaigns.reduce((sum, c) => sum + c.responses, 0);
  const totalSubscribers = campaigns.reduce((sum, c) => sum + c.subscribers, 0);

  return (
    <div dir="rtl" lang="ar" className="space-y-6 font-arabic">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">إدارة التسويق</h2>
          <p className="text-muted-foreground">تتبع الحملات التسويقية والنتائج</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="ml-2 h-4 w-4" />
              حملة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>إضافة حملة تسويقية جديدة</DialogTitle>
              <DialogDescription>
                إضافة حملة تسويقية جديدة لتتبع النتائج
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="campaignName">اسم الحملة *</Label>
                <Input
                  id="campaignName"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="اسم الحملة التسويقية"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">تاريخ البداية *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">تاريخ النهاية *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="budget">الميزانية</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: parseFloat(e.target.value) || 0 })}
                  placeholder="الميزانية المخصصة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="clients">عدد العملاء</Label>
                  <Input
                    id="clients"
                    type="number"
                    value={newCampaign.clients}
                    onChange={(e) => setNewCampaign({ ...newCampaign, clients: parseInt(e.target.value) || 0 })}
                    placeholder="العملاء المستهدفين"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="responses">الردود</Label>
                  <Input
                    id="responses"
                    type="number"
                    value={newCampaign.responses}
                    onChange={(e) => setNewCampaign({ ...newCampaign, responses: parseInt(e.target.value) || 0 })}
                    placeholder="عدد الردود"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subscribers">المشتركين</Label>
                  <Input
                    id="subscribers"
                    type="number"
                    value={newCampaign.subscribers}
                    onChange={(e) => setNewCampaign({ ...newCampaign, subscribers: parseInt(e.target.value) || 0 })}
                    placeholder="عدد المشتركين"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="revenue">الإيراد</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={newCampaign.revenue}
                    onChange={(e) => setNewCampaign({ ...newCampaign, revenue: parseFloat(e.target.value) || 0 })}
                    placeholder="الإيراد المحقق"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reorders">إعادة الترتيب</Label>
                <Input
                  id="reorders"
                  type="number"
                  value={newCampaign.reorders}
                  onChange={(e) => setNewCampaign({ ...newCampaign, reorders: parseInt(e.target.value) || 0 })}
                  placeholder="عدد إعادة الترتيب"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">حالة الحملة</Label>
                <Select
                  value={newCampaign.status}
                  onValueChange={(value: "active" | "completed" | "paused") => setNewCampaign({ ...newCampaign, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشطة</SelectItem>
                    <SelectItem value="paused">متوقفة</SelectItem>
                    <SelectItem value="completed">مكتملة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jsonFile">رفع ملف JSON لبيانات المحامين</Label>
                <Input
                  id="jsonFile"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  يجب أن يحتوي الملف على: participants (المشاركين)، nonParticipants (غير المشاركين)، freeCases (القضايا المجانية)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addCampaign}>إضافة الحملة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Campaign Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>تعديل الحملة التسويقية</DialogTitle>
              <DialogDescription>
                تعديل بيانات الحملة التسويقية
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="editCampaignName">اسم الحملة *</Label>
                <Input
                  id="editCampaignName"
                  value={editingCampaign?.name || ""}
                  onChange={(e) => setEditingCampaign(editingCampaign ? { ...editingCampaign, name: e.target.value } : null)}
                  placeholder="اسم الحملة التسويقية"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editStartDate">تاريخ البداية *</Label>
                  <Input
                    id="editStartDate"
                    type="date"
                    value={editingCampaign?.startDate || ""}
                    onChange={(e) => setEditingCampaign(editingCampaign ? { ...editingCampaign, startDate: e.target.value } : null)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editEndDate">تاريخ النهاية *</Label>
                  <Input
                    id="editEndDate"
                    type="date"
                    value={editingCampaign?.endDate || ""}
                    onChange={(e) => setEditingCampaign(editingCampaign ? { ...editingCampaign, endDate: e.target.value } : null)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editBudget">الميزانية</Label>
                <Input
                  id="editBudget"
                  type="number"
                  value={editingCampaign?.budget || 0}
                  onChange={(e) => setEditingCampaign(editingCampaign ? { ...editingCampaign, budget: parseFloat(e.target.value) || 0 } : null)}
                  placeholder="الميزانية المخصصة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editClients">عدد العملاء</Label>
                  <Input
                    id="editClients"
                    type="number"
                    value={editingCampaign?.clients || 0}
                    onChange={(e) => setEditingCampaign(editingCampaign ? { ...editingCampaign, clients: parseInt(e.target.value) || 0 } : null)}
                    placeholder="العملاء المستهدفين"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editResponses">الردود</Label>
                  <Input
                    id="editResponses"
                    type="number"
                    value={editingCampaign?.responses || 0}
                    onChange={(e) => setEditingCampaign(editingCampaign ? { ...editingCampaign, responses: parseInt(e.target.value) || 0 } : null)}
                    placeholder="عدد الردود"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editSubscribers">المشتركين</Label>
                  <Input
                    id="editSubscribers"
                    type="number"
                    value={editingCampaign?.subscribers || 0}
                    onChange={(e) => setEditingCampaign(editingCampaign ? { ...editingCampaign, subscribers: parseInt(e.target.value) || 0 } : null)}
                    placeholder="عدد المشتركين"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editRevenue">الإيراد</Label>
                  <Input
                    id="editRevenue"
                    type="number"
                    value={editingCampaign?.revenue || 0}
                    onChange={(e) => setEditingCampaign(editingCampaign ? { ...editingCampaign, revenue: parseFloat(e.target.value) || 0 } : null)}
                    placeholder="الإيراد المحقق"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editReorders">إعادة الترتيب</Label>
                <Input
                  id="editReorders"
                  type="number"
                  value={editingCampaign?.reorders || 0}
                  onChange={(e) => setEditingCampaign(editingCampaign ? { ...editingCampaign, reorders: parseInt(e.target.value) || 0 } : null)}
                  placeholder="عدد إعادة الترتيب"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editStatus">حالة الحملة</Label>
                <Select
                  value={editingCampaign?.status || "active"}
                  onValueChange={(value: "active" | "completed" | "paused") => setEditingCampaign(editingCampaign ? { ...editingCampaign, status: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">نشطة</SelectItem>
                    <SelectItem value="paused">متوقفة</SelectItem>
                    <SelectItem value="completed">مكتملة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>إلغاء</Button>
              <Button onClick={updateCampaign}>حفظ التغييرات</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Marketing KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-accent text-accent-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الميزانية</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBudget.toLocaleString()}</div>
            <p className="text-xs opacity-90">{campaigns.length} حملة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيراد</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ROI: {calculateROI(totalRevenue, totalBudget).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalClients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">عبر جميع الحملات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الردود</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{totalResponses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              معدل الرد: {totalClients > 0 ? ((totalResponses / totalClients) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشتركين</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{totalSubscribers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              معدل التحويل: {totalResponses > 0 ? ((totalSubscribers / totalResponses) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="البحث في الحملات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            الحملات التسويقية ({filteredCampaigns.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الحملة</TableHead>
                  <TableHead>المدة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الميزانية</TableHead>
                  <TableHead>العملاء</TableHead>
                  <TableHead>الردود</TableHead>
                  <TableHead>المشتركين</TableHead>
                  <TableHead>الإيراد</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => {
                  const duration = calculateCampaignDuration(campaign.startDate, campaign.endDate);
                  const roi = calculateROI(campaign.revenue || 0, campaign.budget || 0);
                  const responseRate = campaign.clients > 0 ? (campaign.responses / campaign.clients) * 100 : 0;
                  const conversionRate = campaign.responses > 0 ? (campaign.subscribers / campaign.responses) * 100 : 0;
                  
                  return (
                    <TableRow key={campaign.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {duration} يوم
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            campaign.status === 'active' ? 'default' :
                            campaign.status === 'completed' ? 'secondary' : 'outline'
                          }
                        >
                          {campaign.status === 'active' ? 'نشطة' :
                           campaign.status === 'completed' ? 'مكتملة' : 'متوقفة'}
                        </Badge>
                      </TableCell>
                      <TableCell>{(campaign.budget || 0).toLocaleString()}</TableCell>
                      <TableCell>{campaign.clients.toLocaleString()}</TableCell>
                      <TableCell>
                        <div>
                          {campaign.responses.toLocaleString()}
                          <div className="text-xs text-muted-foreground">
                            {responseRate.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {campaign.subscribers.toLocaleString()}
                          <div className="text-xs text-muted-foreground">
                            {conversionRate.toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{(campaign.revenue || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={roi > 0 ? 'default' : 'destructive'}
                          className={roi > 0 ? 'bg-success text-success-foreground' : ''}
                        >
                          {roi.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editCampaign(campaign)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteCampaign(campaign.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}