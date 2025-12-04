import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Ban,
  Building,
  Download,
  Edit,
  Eye,
  Filter,
  Mail,
  Phone,
  Plus,
  Unlock,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddUserForm from "./components/add-user-form";
import { useEffect, useState } from "react";
import axios from "axios";
import apis from "@/lib/api/api";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const getStatusColor = (status) => {
  switch (status) {
    case "active":
    case "approved":
    case "completed":
    case "verified":
      return "bg-emerald-100 text-emerald-700";
    case "pending":
      return "bg-amber-100 text-amber-700";
    case "suspended":
    case "rejected":
    case "failed":
      return "bg-red-100 text-red-700";
    case "inactive":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const { token } = useSelector((state) => state?.auth);

  const fetchUsers = async () => {
    try {
      if (!token) {
        toast.error("No token found, please login");
        return;
      }

      const res = await axios.get(apis.listUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res?.data?.data);
    } catch (err) {
      console.log(err);
      toast.error("Error fetching Users.");
    }
  };

  const toggleApproval = async (userId) => {
    try {
      if (!token) {
        toast.error("No token found, please login");
        return;
      }

      const res = await axios.patch(
        `${apis.approveUser}${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, approved: !user.approved } : user
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Error updating user status.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
        <div className="flex space-x-3">
          <AddUserForm />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {users?.filter((user) => user.role === "User").length}
            </p>
            <p className="text-sm text-slate-600">Total Students</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {users?.filter((user) => user.role === "Owner").length}
            </p>
            <p className="text-sm text-slate-600">Property Owners</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {users?.filter((user) => user.approved).length}
            </p>
            <p className="text-sm text-slate-600">Active Users</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {users?.filter((user) => !user.approved).length}
            </p>
            <p className="text-sm text-slate-600">Suspended Users</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {users?.map((user) => (
          <Card
            key={user.id}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {user.firstName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {user.firstName}
                      </h3>
                      <Badge className={getStatusColor(user.status)}>
                        {user.approved ? "Active" : "De-Active"}
                      </Badge>
                      <Badge variant="secondary">{user.role}</Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <p className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {user.email}
                        </p>
                        <p className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {user.phoneNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:items-end space-y-3">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {user.approved ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent text-emerald-600"
                        onClick={() => toggleApproval(user._id)}
                      >
                        <Unlock className="w-4 h-4 mr-1" />
                        Activate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent text-red-600"
                        onClick={() => toggleApproval(user._id)}
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
