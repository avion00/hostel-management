import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

const OwnerProfilePage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Profile Management</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-2xl">
                RK
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Photo
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Remove Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  First Name
                </label>
                <Input />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Last Name
                </label>
                <Input />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Email Address
              </label>
              <Input type="email" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Phone Number
              </label>
              <Input type="tel" />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Business Address
              </label>
              <Textarea
                defaultValue="123 Business Park, Sector 15, Noida, UP 201301"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Business Name
              </label>
              <Input />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                GST Number
              </label>
              <Input />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                PAN Number
              </label>
              <Input />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Years in Business
              </label>
              <Select defaultValue="5-10">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Bank Name
              </label>
              <Input />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Account Number
              </label>
              <Input />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                IFSC Code
              </label>
              <Input />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Account Holder Name
              </label>
              <Input />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" className="bg-transparent">
          Cancel
        </Button>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default OwnerProfilePage;
