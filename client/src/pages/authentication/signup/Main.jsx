import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, Bed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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
import authService from "@/services/authService";
import { toast } from "sonner";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.userType) {
      setError("Please select user type (Student or Hostel Partner)");
      toast.error("Missing information", {
        description: "Please select whether you are a Student or Hostel Partner"
      });
      return;
    }

    try {
      setLoading(true);
      
      console.log("Attempting signup with:", {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.userType
      });
      
      const response = await authService.signup({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.userType,
      });

      console.log("Signup successful:", response);
      
      toast.success("Account created successfully!", {
        description: "Redirecting to home page..."
      });
      
      // Small delay for toast to show
      setTimeout(() => {
        // Redirect based on user role
        if (response.data.role === "partner") {
          navigate("/for-partners");
        } else {
          navigate("/");
        }
      }, 500);
    } catch (err) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response);
      
      const errorMessage = err.response?.data?.message || "Failed to create account";
      setError(errorMessage);
      
      toast.error("Signup failed", {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label
                htmlFor="userType"
                className="text-sm font-medium text-slate-700 mb-2 block"
              >
                User Type
              </label>
              <Select
                value={formData.userType}
                onValueChange={(value) => handleInputChange("userType", value)}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="partner">Hostel Partner</SelectItem>
                </SelectContent>
              </Select>
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
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
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
