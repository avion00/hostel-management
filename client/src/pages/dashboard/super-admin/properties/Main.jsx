import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import AlertDialog from "@/components/common/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  MapPin,
  MoreVertical,
  Star,
  Loader2,
  Search,
  TrendingUp,
  Building2,
  Users,
  Calendar,
  Phone,
  Mail,
  X,
  Check,
  Trash2,
  Plus,
  Edit,
  Ban,
  Settings,
  User,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axiosInstance";

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
      return "bg-orange-100 text-orange-700";
    case "rejected":
    case "failed":
      return "bg-red-100 text-red-700";
    case "inactive":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const AdminPropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [stats, setStats] = useState({
    approvedProperties: 0,
    pendingApproval: 0,
    rejectedProperties: 0,
    monthlyCommission: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    confirmLabel: "Confirm",
    onConfirm: null,
  });
  const [reactivateDialog, setReactivateDialog] = useState({
    open: false,
    propertyId: null,
    status: "approved",
  });

  // Get token from Redux store
  const token = useSelector((state) => state.auth.accessToken);

  // Fetch dashboard statistics
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Fetch properties when filter changes
  useEffect(() => {
    fetchProperties();
  }, [pagination.page]);

  // Filter properties based on search and status
  useEffect(() => {
    let filtered = [...properties];

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "suspended") {
        // Filter by is_active = 0 for suspended properties
        filtered = filtered.filter(p => p.is_active === 0);
      } else {
        // Filter by status and exclude suspended (is_active = 0)
        filtered = filtered.filter(p => p.status === statusFilter && p.is_active !== 0);
      }
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.manager_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  }, [properties, statusFilter, searchQuery]);

  const fetchDashboardStats = async () => {
    if (!token) {
      toast.error("Please login to continue");
      return;
    }

    try {
      const response = await axiosInstance.get('/admin/analytics/overview');

      if (response.data.success) {
        const { overview } = response.data.data;
        setStats({
          approvedProperties: overview.approvedHostels,
          pendingApproval: overview.pendingHostels,
          rejectedProperties: overview.rejectedHostels,
          monthlyCommission: overview.monthlyCommission,
        });
      } else {
        toast.error(response.data.message || "Failed to fetch statistics");
      }
    } catch (error) {
      toast.error("Failed to fetch dashboard statistics");
      console.error(error);
    }
  };

  const fetchProperties = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch all properties, we'll filter on frontend
      const response = await axiosInstance.get(
        `/admin/hostels?page=${pagination.page}&limit=100`
      );

      if (response.data.success) {
        setProperties(response.data.data.hostels);
        setPagination((prev) => ({
          ...prev,
          total: response.data.data.pagination.total,
          pages: response.data.data.pagination.pages,
        }));
      } else {
        toast.error(response.data.message || "Failed to fetch properties");
      }
    } catch (error) {
      toast.error("Failed to fetch properties");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveProperty = async (propertyId) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/hostels/${propertyId}/approve`
      );

      if (response.data.success) {
        toast.success("Property approved successfully!");
        fetchProperties();
        fetchDashboardStats();
      } else {
        toast.error(response.data.message || "Failed to approve property");
      }
    } catch (error) {
      toast.error("Failed to approve property");
      console.error(error);
    }
  };

  const rejectProperty = async (propertyId, reason) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/hostels/${propertyId}/reject`,
        { reason }
      );

      if (response.data.success) {
        toast.success("Property rejected successfully!");
        fetchProperties();
        fetchDashboardStats();
      } else {
        toast.error(response.data.message || "Failed to reject property");
      }
    } catch (error) {
      toast.error("Failed to reject property");
      console.error(error);
    }
  };

  const deleteProperty = (propertyId) => {
    setConfirmDialog({
      open: true,
      title: "Delete property?",
      description:
        "Are you sure you want to delete this property? This action cannot be undone.",
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          const response = await axiosInstance.delete(
            `/admin/hostels/${propertyId}`
          );

          if (response.data.success) {
            toast.success("Property deleted successfully!");
            fetchProperties();
            fetchDashboardStats();
          } else {
            toast.error(response.data.message || "Failed to delete property");
          }
        } catch (error) {
          toast.error("Failed to delete property");
          console.error(error);
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  const suspendProperty = (propertyId) => {
    setConfirmDialog({
      open: true,
      title: "Suspend property?",
      description: "Are you sure you want to suspend this property?",
      confirmLabel: "Suspend",
      onConfirm: async () => {
        try {
          const response = await axiosInstance.patch(
            `/admin/hostels/${propertyId}/suspend`
          );

          if (response.data.success) {
            toast.success("Property suspended successfully!");
            fetchProperties();
            fetchDashboardStats();
          } else {
            toast.error(response.data.message || "Failed to suspend property");
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to suspend property"
          );
          console.error(error);
        } finally {
          setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  const openReactivateDialog = (propertyId) => {
    setReactivateDialog({
      open: true,
      propertyId,
      status: "approved",
    });
  };

  const handleConfirmReactivate = async () => {
    if (!reactivateDialog.propertyId) return;

    try {
      const response = await axiosInstance.patch(
        `/admin/hostels/${reactivateDialog.propertyId}/reactivate`,
        { status: reactivateDialog.status }
      );

      if (response.data.success) {
        toast.success(`Property reactivated as ${reactivateDialog.status}!`);
        fetchProperties();
        fetchDashboardStats();
      } else {
        toast.error(response.data.message || "Failed to reactivate property");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reactivate property");
      console.error(error);
    } finally {
      setReactivateDialog({ open: false, propertyId: null, status: "approved" });
    }
  };

  return (
    <div className="space-y-6">
      <AlertDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() =>
          setConfirmDialog((prev) => ({ ...prev, open: false, onConfirm: null }))
        }
        confirmVariant="destructive"
      />
      <Dialog
        open={reactivateDialog.open}
        onOpenChange={(open) =>
          setReactivateDialog((prev) => ({
            ...prev,
            open,
            ...(open ? {} : { propertyId: null, status: "approved" }),
          }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reactivate property</DialogTitle>
            <DialogDescription>
              Choose the new status for this property after reactivation.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              New status
            </label>
            <select
              value={reactivateDialog.status}
              onChange={(e) =>
                setReactivateDialog((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() =>
                setReactivateDialog({ open: false, propertyId: null, status: "approved" })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmReactivate}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Property Management
          </h2>
          <Button
            onClick={() => navigate("/dashboard/admin/properties/add")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Property
          </Button>
        </div>

         <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.approvedProperties}
            </p>
            <p className="text-sm text-slate-600">Approved Properties</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.pendingApproval}
            </p>
            <p className="text-sm text-slate-600">Pending Approval</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {stats.rejectedProperties}
            </p>
            <p className="text-sm text-slate-600">Rejected Properties</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              Rs.{(stats.monthlyCommission / 100000).toFixed(2)}L
            </p>
            <p className="text-sm text-slate-600">Monthly Commission</p>
          </CardContent>
        </Card>
      </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by property name, owner, address, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Properties</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

     

      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-slate-600">Loading properties...</span>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">
                {searchQuery || statusFilter !== "all" 
                  ? "No properties found matching your criteria" 
                  : "No properties found"}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Property Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((property) => (
                    <TableRow key={property.id} className="hover:bg-slate-50">
                      <TableCell>
                        <img
                          src={
                            property.images && property.images.length > 0
                              ? `http://localhost:5000${property.images[0]}`
                              : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect fill='%23f0f0f0' width='50' height='50'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='8' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                          }
                          alt={property.name}
                          className="rounded-lg object-cover w-12 h-12"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect fill='%23f0f0f0' width='50' height='50'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='8' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{property.name}</p>
                          <p className="text-xs text-slate-500">ID: {property.id.substring(0, 8)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium">{property.manager_name}</p>
                            <p className="text-xs text-slate-500">Manager</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-1">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-sm">{property.address}</p>
                            <p className="text-xs text-slate-500">{property.city}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium">
                            {property.average_rating ? property.average_rating.toFixed(1) : '0.0'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={property.is_active === 0 ? "bg-orange-100 text-orange-700" : getStatusColor(property.status)}>
                          {property.is_active === 0 ? 'suspended' : property.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {property.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="h-8 px-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                                onClick={() => approveProperty(property.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  const reason = prompt("Enter rejection reason:");
                                  if (reason) rejectProperty(property.id, reason);
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => navigate(`/dashboard/admin/properties/${property.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => navigate(`/dashboard/admin/properties/${property.id}/edit`)}
                                className="cursor-pointer"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Property
                              </DropdownMenuItem>
                              {/* Check if property is suspended (is_active = 0) */}
                              {property.is_active === 0 ? (
                                <DropdownMenuItem
                                  onClick={() => openReactivateDialog(property.id)}
                                  className="cursor-pointer text-emerald-600"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Reactivate Property
                                </DropdownMenuItem>
                              ) : property.status !== 'rejected' ? (
                                <DropdownMenuItem
                                  onClick={() => suspendProperty(property.id)}
                                  className="cursor-pointer text-amber-600"
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspend Property
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem
                                onClick={() => navigate(`/dashboard/admin/properties/${property.id}/settings`)}
                                className="cursor-pointer"
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => deleteProperty(property.id)}
                                className="cursor-pointer text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Property
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPropertiesPage;
