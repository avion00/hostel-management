import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const AdminSettingsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Platform Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Commission Rate (%)
              </label>
              <Input type="number" defaultValue="10" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Premium Feature Price
              </label>
              <Input type="number" defaultValue="5000" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Maximum Properties per Owner
              </label>
              <Input type="number" defaultValue="10" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">
                  Auto-approve Properties
                </p>
                <p className="text-sm text-slate-600">
                  Automatically approve verified owners
                </p>
              </div>
              <input type="checkbox" className="rounded border-slate-300" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">
                  Email Notifications
                </p>
                <p className="text-sm text-slate-600">
                  System alerts via email
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">SMS Alerts</p>
                <p className="text-sm text-slate-600">
                  Critical alerts via SMS
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Slack Integration</p>
                <p className="text-sm text-slate-600">Send alerts to Slack</p>
              </div>
              <input type="checkbox" className="rounded border-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="bg-transparent">
          Reset to Default
        </Button>
        <Button className="bg-gradient-to-r from-red-500 to-pink-500">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
