import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UserCog,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axiosInstance";

const EditUserModal = ({ user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    is_active: true,
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "student",
        is_active: user.is_active === 1,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        is_active: formData.is_active,
      };

      // Only include password if it's being changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await axiosInstance.put(
        `/admin/users/${user.id}`,
        updateData
      );

      if (response.data.success) {
        toast.success("User updated successfully");
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "manager":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "student":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <UserCog className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-900">
                  Edit User Profile
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-0.5">
                  Update user information and access permissions
                </DialogDescription>
              </div>
            </div>
            {user && (
              <Badge className={`${getRoleBadgeColor(user.role)} border`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-slate-50/50 h-auto p-0">
              <TabsTrigger 
                value="general" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-6 py-3"
              >
                <User className="w-4 h-4 mr-2" />
                General Information
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-6 py-3"
              >
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="permissions" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-6 py-3"
              >
                <Shield className="w-4 h-4 mr-2" />
                Permissions
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="general" className="mt-0 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      Full Name
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-10"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      Email Address
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-10"
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-10"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <Separator />

                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Account Status</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                        Active Account
                      </Label>
                      <p className="text-xs text-slate-500">
                        User can access the system when account is active
                      </p>
                    </div>
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0 space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-amber-900">Password Change</p>
                      <p className="text-sm text-amber-700">
                        Leave password fields empty to keep the current password unchanged.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-slate-500" />
                      New Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-10"
                      placeholder="Minimum 6 characters"
                    />
                    <p className="text-xs text-slate-500">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="h-10"
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="mt-0 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-slate-500" />
                    User Role
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          Student
                        </div>
                      </SelectItem>
                      <SelectItem value="manager">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          Manager
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          Administrator
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Role determines the user's access level and permissions within the system
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">Role Permissions</h3>
                  {formData.role === "admin" && (
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Full system access and control
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Manage all users and properties
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        View system analytics and reports
                      </li>
                    </ul>
                  )}
                  {formData.role === "manager" && (
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Manage assigned properties
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Handle bookings and payments
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        View property reports
                      </li>
                    </ul>
                  )}
                  {formData.role === "student" && (
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Browse and book accommodations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Manage personal bookings
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        View payment history
                      </li>
                    </ul>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="px-6 py-4 bg-slate-50 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px] bg-slate-900 hover:bg-slate-800"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
