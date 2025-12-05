import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Key,
  Power,
  Mail,
  Phone,
  Calendar,
  Shield,
  Building2,
  GraduationCap,
  Loader2,
  Eye,
  X,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axiosInstance";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";

const UserManagement = () => {
  const token = useSelector((state) => state.auth.accessToken);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    byRole: {
      admin: { total: 0, active: 0, inactive: 0 },
      manager: { total: 0, active: 0, inactive: 0 },
      student: { total: 0, active: 0, inactive: 0 },
    },
    recentSignups: 0,
  });

  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    search: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    fetchUserStats();
    fetchUsers();
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      fetchUsers();
    }
  }, [filters.role, filters.status, filters.search, pagination.page]);

  const fetchUserStats = async () => {
    try {
      const response = await axiosInstance.get("/admin/users/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        ...(filters.role !== "all" && { role: filters.role }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await axiosInstance.get(`/admin/users?${params}`);
      if (response.data.success) {
        setUsers(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/users/${userId}/toggle-status`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
        fetchUserStats();
      }
    } catch (error) {
      toast.error("Failed to toggle user status");
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        toast.success("User deleted successfully");
        fetchUsers();
        fetchUserStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
      console.error(error);
    }
  };

  const handleResetPassword = async (userId) => {
    const password = window.prompt("Enter new password (min 6 characters):");
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/admin/users/${userId}/reset-password`,
        { password }
      );
      if (response.data.success) {
        toast.success("Password reset successfully");
      }
    } catch (error) {
      toast.error("Failed to reset password");
      console.error(error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-3.5 h-3.5 mr-1.5" />;
      case "manager":
        return <Building2 className="w-3.5 h-3.5 mr-1.5" />;
      case "student":
        return <GraduationCap className="w-3.5 h-3.5 mr-1.5" />;
      default:
        return <Users className="w-3.5 h-3.5 mr-1.5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
      case "manager":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
      case "student":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100";
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-2">Manage system users, roles, and access permissions.</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 transition-all"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-white ring-1 ring-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-slate-50 text-slate-600 font-medium">Total</Badge>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500 mt-1">Registered users</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white ring-1 ring-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-right">
                 <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    {stats.byRole.admin?.active || 0} active
                 </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.byRole.admin?.total || 0}</p>
              <p className="text-sm text-slate-500 mt-1">Administrators</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white ring-1 ring-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-right">
                 <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    {stats.byRole.manager?.active || 0} active
                 </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.byRole.manager?.total || 0}</p>
              <p className="text-sm text-slate-500 mt-1">Managers</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white ring-1 ring-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
              </div>
               <div className="text-right">
                 <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    {stats.byRole.student?.active || 0} active
                 </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.byRole.student?.total || 0}</p>
              <p className="text-sm text-slate-500 mt-1">Students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-sm bg-white ring-1 ring-slate-100">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <CardTitle className="text-lg font-semibold text-slate-900">All Users</CardTitle>
             <div className="flex flex-col sm:flex-row gap-3">
               <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input 
                    placeholder="Search users..." 
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  />
               </div>
               <select
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="student">Student</option>
                </select>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {(filters.role !== "all" || filters.status !== "all" || filters.search) && (
                   <Button 
                     variant="ghost" 
                     onClick={() => setFilters({ role: "all", status: "all", search: "" })}
                     className="text-slate-500 hover:text-slate-900"
                   >
                     Reset
                   </Button>
                )}
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[300px] pl-6">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   <TableRow>
                     <TableCell colSpan={6} className="h-32 text-center">
                       <div className="flex items-center justify-center text-slate-500">
                         <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                         Loading users...
                       </div>
                     </TableCell>
                   </TableRow>
                ) : users.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                       No users found matching your filters.
                     </TableCell>
                   </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-slate-100 text-slate-600 font-semibold">
                              {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getRoleColor(user.role)} border px-2.5 py-0.5`}>
                          {getRoleIcon(user.role)}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                           <div className={`w-2 h-2 rounded-full mr-2 ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                           <span className={`text-sm font-medium ${user.is_active ? 'text-slate-700' : 'text-slate-500'}`}>
                             {user.is_active ? "Active" : "Inactive"}
                           </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-slate-600">
                          {user.phone ? (
                            <>
                              <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                              {user.phone}
                            </>
                          ) : (
                            <span className="text-slate-400 italic">No phone</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {new Date(user.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                              <MoreVertical className="w-4 h-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setShowEditModal(true); }}>
                              <Edit className="w-4 h-4 mr-2" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                              <Key className="w-4 h-4 mr-2" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                              <Power className="w-4 h-4 mr-2" /> 
                              {user.is_active ? "Deactivate Account" : "Activate Account"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600 focus:bg-red-50 focus:text-red-700">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer / Pagination */}
          {pagination.pages > 1 && (
            <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between bg-slate-50/50">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-900">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                <span className="font-medium text-slate-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
                <span className="font-medium text-slate-900">{pagination.total}</span> users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="h-8 px-3 bg-white"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="h-8 px-3 bg-white"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchUsers();
            fetchUserStats();
            setShowCreateModal(false);
          }}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            fetchUsers();
            fetchUserStats();
            setShowEditModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
