import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, Mail, Lock, Bed } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axiosInstance";
import apis from "@/lib/api/api";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setAccessToken, setRefreshToken, setUser } from "@/redux/features/authSlice";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(apis.login, form.getValues());
      
      if (response?.status === 200 && response?.data?.success) {
        const { accessToken, refreshToken, ...userData } = response.data.data;
        
        // Store tokens and user data
        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));
        dispatch(setUser(userData));
        dispatch(setIsLoggedIn(true));
        
        toast.success("Login successful!");
        
        // Navigate based on role
        const role = userData.role.toLowerCase();
        if (role === "student") {
          navigate("/");
        } else if (role === "manager") {
          navigate("/dashboard/owner/overview");
        } else if (role === "admin") {
          navigate("/dashboard/admin/overview");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle different error scenarios
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;
        
        if (status === 401) {
          // Invalid credentials
          toast.error(message || "Invalid email or password. Please check your credentials.");
        } else if (status === 423) {
          // Account locked
          toast.error(message || "Account is locked due to too many failed attempts. Please wait 15 minutes.");
        } else if (status === 429) {
          // Rate limit / Too many requests
          toast.error("Too many login attempts. Please wait a few minutes and try again.");
        } else if (status === 403) {
          // Account deactivated
          toast.error(message || "Your account has been deactivated.");
        } else if (status === 400) {
          // Bad request
          toast.error(message || "Please provide valid email and password.");
        } else {
          // Other errors
          toast.error(message || "An error occurred during login.");
        }
      } else if (err.request) {
        // Network error
        toast.error("Cannot connect to server. Please check your internet connection.");
      } else {
        // Other errors
        toast.error("An unexpected error occurred. Please try again.");
      }
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

      <Card className="border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white  focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-slate-600 font-normal">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Link
                  to={"/"}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                Log In
              </Button>
            </form>
          </Form>

          {/* Test Credentials - Remove in production */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-800 mb-2">Test Credentials:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p><strong>Admin:</strong> admin@hostel.com / password123</p>
                <p><strong>Manager:</strong> manager1@hostel.com / password123</p>
                <p><strong>Student:</strong> student1@example.com / password123</p>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Don't have an account? &nbsp;
              <Link
                to={"/signup"}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-4">
              <hr className="flex-grow border-t border-accent-foreground" />
              <span className="text-accent-foreground text-sm">Or</span>
              <hr className="flex-grow border-t border-accent-foreground" />
            </div>
            <div className="flex border border-gray-300 rounded-xs items-center justify-center gap-4 font-medium py-1 cursor-pointer">
              <FcGoogle className="w-8 h-8" />
              Continue With Google
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
