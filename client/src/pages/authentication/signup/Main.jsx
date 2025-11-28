import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, Bed } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full flex flex-col px-6 max-w-md lg:max-w-lg space-y-2">
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Bed className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-primary">HostelHub</span>
      </div>
      <Card className="border-0 shadow-xl">
        <CardHeader className="">
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-slate-700 mb-2 block"
                >
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-slate-700 mb-2 block"
                >
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700 mb-2 block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-slate-700 mb-2 block"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 mb-2 block"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-700 mb-2 block"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-1"
              />
              <span className="ml-2 text-sm text-slate-600">
                I agree to the{" "}
                <Link to={""} className="text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to={""} className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </Link>
              </span>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            >
              Create Account
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Log In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;
