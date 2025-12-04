import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Download,
  Globe,
  Lock,
  RefreshCw,
  Settings,
} from "lucide-react";

const systemActivities = [
  {
    id: 1,
    type: "user_registration",
    description: "New student registered: Arjun Mehta",
    timestamp: "2 minutes ago",
    severity: "info",
  },
  {
    id: 2,
    type: "property_approval",
    description: "Property approved: Elite Student Residence",
    timestamp: "15 minutes ago",
    severity: "success",
  },
  {
    id: 3,
    type: "payment_failed",
    description: "Payment failed for booking BK12345",
    timestamp: "1 hour ago",
    severity: "warning",
  },
  {
    id: 4,
    type: "security_alert",
    description: "Multiple failed login attempts detected",
    timestamp: "2 hours ago",
    severity: "error",
  },
];

const getSeverityColor = (severity) => {
  switch (severity) {
    case "error":
      return "text-red-600";
    case "warning":
      return "text-amber-600";
    case "success":
      return "text-emerald-600";
    case "info":
      return "text-blue-600";
    default:
      return "text-slate-600";
  }
};

const getSeverityIcon = (severity) => {
  switch (severity) {
    case "error":
      return <AlertTriangle className="w-4 h-4" />;
    case "warning":
      return <Clock className="w-4 h-4" />;
    case "success":
      return <CheckCircle className="w-4 h-4" />;
    case "info":
      return <Activity className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const AdminSystemPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">System Management</h2>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-600">99.9%</p>
            <p className="text-sm text-slate-600">System Uptime</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">2.4TB</p>
            <p className="text-sm text-slate-600">Database Size</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-600">45ms</p>
            <p className="text-sm text-slate-600">Avg Response Time</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">0</p>
            <p className="text-sm text-slate-600">Security Breaches</p>
          </CardContent>
        </Card>
      </div>

      {/* System Controls */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>System Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Maintenance Mode</p>
                <p className="text-sm text-slate-600">
                  Enable system maintenance
                </p>
              </div>
              <Button variant="outline" className="bg-transparent">
                <Settings className="w-4 h-4 mr-2" />
                Enable
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Cache Refresh</p>
                <p className="text-sm text-slate-600">Clear system cache</p>
              </div>
              <Button variant="outline" className="bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Database Backup</p>
                <p className="text-sm text-slate-600">Create system backup</p>
              </div>
              <Button variant="outline" className="bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemActivities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-3 text-sm"
                >
                  <div className={getSeverityColor(activity.severity)}>
                    {getSeverityIcon(activity.severity)}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900">{activity.description}</p>
                    <p className="text-slate-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSystemPage;
