"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  GraduationCap,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  Building2,
  User,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [loginType, setLoginType] = useState("student"); // "student", "institute", or "admin"
  const navigate = useNavigate();
  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Password validation function
  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!regex.test(password)) {
      return "Password must be at least 6 characters long, include uppercase, lowercase, number, and special character";
    }

    return "";
  };

  // Validate all fields
  const validateForm = () => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleChange = (name, value) => {
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (touched[name]) {
      let error = "";
      if (name === "email") {
        error = validateEmail(value);
      } else if (name === "password") {
        error = validatePassword(value);
      }

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Handle field blur to mark as touched
  const handleBlur = (name) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    let error = "";
    if (name === "email") {
      error = validateEmail(formData[name]);
    } else if (name === "password") {
      error = validatePassword(formData[name]);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
    });
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);
    let apiEndpoint;

    if (loginType === "student") {
      apiEndpoint = "/api/v1/student-login";
    } else if (loginType === "institute") {
      apiEndpoint = "/api/v1/institute-login";
    } else {
      apiEndpoint = "/api/v1/admin-login";
    }

    try {
      const response = await axios.post(apiEndpoint, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Login successful!");
        setformData({
          email: "",
          password: "",
        });
      }
      // Reset touched and errors
      setTouched({
        email: false,
        password: false,
      });
      setErrors({
        email: "",
        password: "",
      });

      if (loginType === "student") {
        navigate("/student-dashboard");
      } else if (loginType === "institute") {
        navigate("/institute-dashboard");
      } else {
        navigate("/admin-dashboard");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss();
      toast.error("Login failed. Please check your credentials and try again.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {loginType === "student" ? (
                <GraduationCap className="h-8 w-8 text-blue-600" />
              ) : loginType === "institute" ? (
                <Building2 className="h-8 w-8 text-blue-600" />
              ) : (
                <Shield className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your EduConnect account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-100 p-1 rounded-lg flex">
                  <button
                    onClick={() => setLoginType("student")}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginType === "student"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Student
                  </button>
                  <button
                    onClick={() => setLoginType("institute")}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginType === "institute"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Building2 className="h-4 w-4 mr-1" />
                    Institute
                  </button>
                  <button
                    onClick={() => setLoginType("admin")}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      loginType === "admin"
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </button>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="Enter your email"
                  required
                  className={`h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.email && touched.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
                {errors.email && touched.email && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className={`h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12 ${
                      errors.password && touched.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  (touched.email &&
                    touched.password &&
                    (errors.email || errors.password))
                }
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  `Sign In as ${
                    loginType === "student"
                      ? "Student"
                      : loginType === "institute"
                      ? "Institute"
                      : "Admin"
                  }`
                )}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button asChild variant="outline" className="h-11 text-xs">
                  <Link to="/student/register">Register Student</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 text-xs">
                  <Link to="/institute/register">Register Institute</Link>
                </Button>
                <Button asChild variant="outline" className="h-11 text-xs">
                  <Link to="/admin/register">Register Admin</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-blue-600 hover:text-blue-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
