"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Upload,
  Building2,
  Phone,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Hash,
  School,
} from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
export default function InstituteRegister() {
  const [formData, setFormData] = useState({
    instituteName: "",
    establishmentYear: "",
    instituteType: "",
    registrationDate: null,
    department: "",
    registrationNumber: "",
    instituteCode: "",
    contact: {
      phone: "",
      email: "",
    },
    password: "",
    confirmPassword: "",
    instituteLogo: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        instituteLogo: "File size should be less than 5MB",
      });
      return;
    }
    setFormData({
      ...formData,
      instituteLogo: file,
    });
    setErrors({
      ...errors,
      instituteLogo: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.instituteName.trim()) {
      newErrors.instituteName = "Institute name is required";
    } else if (formData.instituteName.trim().length < 3) {
      newErrors.instituteName = "Institute name must be at least 3 characters";
    } else if (formData.instituteName.trim().length > 60) {
      newErrors.instituteName = "Institute name must be at most 60 characters";
    }

    // establishmentYear validation
    if (!formData.establishmentYear || formData.establishmentYear < 3) {
      newErrors.establishmentYear = "establishmentYear must be at least 3";
    }

    // instituteType validation
    if (!formData.instituteType)
      newErrors.instituteType = "Please select instituteType";
    if (!formData.registrationDate)
      newErrors.registrationDate = "Date of birth is required";

    // Institute Code validation
    if (!formData.instituteCode.trim()) {
      newErrors.instituteCode = "Institute code is required";
    } else if (formData.instituteCode.trim().length < 3) {
      newErrors.instituteCode = "Institute code must be at least 3 characters";
    } else if (formData.instituteCode.trim().length > 10) {
      newErrors.instituteCode = "Institute code must be at most 10 characters";
    }

    if (formData.department.trim() && formData.department.trim().length < 3) {
      newErrors.department = "department must be at least 3 characters";
    } else if (formData.department.trim().length > 50) {
      newErrors.department = "department must be at most 50 characters";
    }

    if (
      formData.registrationNumber.trim() &&
      formData.registrationNumber.trim().length < 3
    ) {
      newErrors.registrationNumber =
        "Registration number must be at least 3 characters";
    } else if (formData.registrationNumber.trim().length > 15) {
      newErrors.registrationNumber =
        "Registration number must be at most 15 characters";
    } else if (
      formData.registrationNumber.trim() &&
      !/^[A-Za-z0-9]+$/.test(formData.registrationNumber.trim())
    ) {
      newErrors.registrationNumber =
        "Registration number can only contain letters and numbers";
    }

    // Contact validation
    if (!formData.contact.phone.trim()) {
      newErrors["contact.phone"] = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.contact.phone.replace(/\D/g, ""))) {
      newErrors["contact.phone"] = "Phone number must be 10 digits";
    }

    if (!formData.contact.email.trim()) {
      newErrors["contact.email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contact.email)) {
      newErrors["contact.email"] = "Valid email is required";
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 20) {
      newErrors.password = "Password must be at most 20 characters";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special character";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword.length < 6) {
      newErrors.confirmPassword =
        "Confirm password must be at least 6 characters";
    } else if (formData.confirmPassword.length > 20) {
      newErrors.confirmPassword =
        "Confirm password must be at most 20 characters";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    try {
      const loadingToast = toast.loading("Registering...");
      // Prepare data for submission (matching schema structure)
      const formDataToSend = new FormData();
      formDataToSend.append("instituteName", formData.instituteName);
      formDataToSend.append("establishmentYear", formData.establishmentYear);
      formDataToSend.append("instituteType", formData.instituteType);
      formDataToSend.append("registrationDate", formData.registrationDate);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("registrationNumber", formData.registrationNumber);
      formDataToSend.append("instituteCode", formData.instituteCode);
      formDataToSend.append("contact[phone]", formData.contact.phone);
      formDataToSend.append("contact[email]", formData.contact.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("confirmPassword", formData.confirmPassword);

      if (formData.instituteLogo) {
        formDataToSend.append("instituteLogo", formData.instituteLogo);
      }
      // Handle form submission here
      const response = await axios.post(
        "/api/v1/institute-register",
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.dismiss(loadingToast);
      if (response.status === 201 || response.status === 200) {
        toast.success("Institute registered successfully!");
        setFormData({
          instituteName: "",
          establishmentYear: "",
          instituteType: "",
          registrationDate: null,
          department: "",
          registrationNumber: "",
          instituteCode: "",
          contact: {
            phone: "",
            email: "",
          },
          password: "",
          confirmPassword: "",
          instituteLogo: null,
        });
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Registration failed");
      console.error("Registration error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-lg mb-4">
            <School className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Institute Registration
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto mb-4">
            Register your educational institute to manestablishmentYear
            students, courses, and academic resources. Join our platform to
            streamline your educational operations.
          </p>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 px-3 py-1 text-sm"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Trusted & Secure
          </Badge>
        </div>

        {/* Main Form */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-1"></div>

          <CardContent className="p-6 lg:p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-8"
              encType="multipart/form-data"
            >
              {/* Profile Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-1 text-center lg:text-left">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-center lg:justify-start gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-green-600" />
                    Institute Information
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload institute logo and basic information
                  </p>

                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 border-3 border-white shadow-lg flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                        {formData.instituteLogo ? (
                          <img
                            src={
                              URL.createObjectURL(formData.instituteLogo) ||
                              "/placeholder.svg"
                            }
                            alt="Institute logo preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors" />
                        )}
                      </div>
                      <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="w-full max-w-sm">
                      <Label
                        htmlFor="instituteLogo"
                        className="text-xs font-medium text-gray-700 mb-1 block"
                      >
                        Institute Logo (Optional)
                      </Label>
                      <Input
                        id="instituteLogo"
                        type="file"
                        name="instituteLogo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer text-xs file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {errors.instituteLogo && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.instituteLogo}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Max file size: 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label
                        htmlFor="instituteName"
                        className="text-xs font-medium text-gray-700"
                      >
                        Institute Name *
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="instituteName"
                          type="text"
                          name="instituteName"
                          placeholder="Enter institute name"
                          value={formData.instituteName}
                          onChange={(e) =>
                            handleChange("instituteName", e.target.value)
                          }
                          className={`pl-9 h-10 text-sm ${
                            errors.instituteName
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-green-500"
                          }`}
                        />
                      </div>
                      {errors.instituteName && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.instituteName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="establishmentYear"
                        className="text-xs font-medium text-gray-700"
                      >
                        Establishment Year *
                      </Label>
                      <Input
                        id="establishmentYear"
                        type="number"
                        name="establishmentYear"
                        placeholder="Enter establishment year"
                        value={formData.establishmentYear}
                        onChange={(e) =>
                          handleChange("establishmentYear", e.target.value)
                        }
                        min="1800"
                        max={new Date().getFullYear()}
                        className={`h-10 text-sm ${
                          errors.establishmentYear
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-green-500"
                        }`}
                      />
                      {errors.establishmentYear && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.establishmentYear}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700">
                        Institute Type *
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleChange("instituteType", value)
                        }
                      >
                        <SelectTrigger
                          className={`h-10 text-sm ${
                            errors.instituteType ? "border-red-500" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select institute type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="School" name="School">
                            School
                          </SelectItem>
                          <SelectItem value="College" name="College">
                            College
                          </SelectItem>
                          <SelectItem value="University" name="University">
                            University
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.instituteType && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.instituteType}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700">
                        Registration Date *
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full h-10 justify-start text-left font-normal text-sm ${
                              errors.registrationDate ? "border-red-500" : ""
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.registrationDate ? (
                              format(formData.registrationDate, "PPP")
                            ) : (
                              <span className="text-gray-500">
                                Select registration date
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            name="registrationDate"
                            selected={formData.registrationDate}
                            onSelect={(date) =>
                              handleChange("registrationDate", date)
                            }
                            disabled={(date) =>
                              date > new Date() || date < new Date("1800-01-01")
                            }
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.registrationDate && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.registrationDate}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="instituteCode"
                        className="text-xs font-medium text-gray-700"
                      >
                        Institute Code *
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="instituteCode"
                          type="text"
                          name="instituteCode"
                          placeholder="Enter unique institute code"
                          value={formData.instituteCode}
                          onChange={(e) =>
                            handleChange("instituteCode", e.target.value)
                          }
                          className={`pl-9 h-10 text-sm ${
                            errors.instituteCode
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-green-500"
                          }`}
                        />
                      </div>
                      {errors.instituteCode && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.instituteCode}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        3-10 characters, must be unique
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="department"
                        className="text-xs font-medium text-gray-700"
                      >
                        Department/Branch (Optional)
                      </Label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="department"
                          type="text"
                          name="department"
                          placeholder="e.g., Science, Commerce, Arts"
                          value={formData.department}
                          onChange={(e) =>
                            handleChange("department", e.target.value)
                          }
                          className="pl-9 h-10 text-sm focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="registrationNumber"
                        className="text-xs font-medium text-gray-700"
                      >
                        Registration Number (Optional)
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="registrationNumber"
                          name="registrationNumber"
                          type="text"
                          placeholder="Enter registration number"
                          value={formData.registrationNumber}
                          onChange={(e) =>
                            handleChange("registrationNumber", e.target.value)
                          }
                          className="pl-9 h-10 text-sm focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-medium text-gray-700"
                    >
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="Enter 10-digit phone number"
                        value={formData.contact.phone}
                        onChange={(e) =>
                          handleChange("contact.phone", e.target.value)
                        }
                        className={`pl-9 h-10 text-sm ${
                          errors["contact.phone"]
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-green-500"
                        }`}
                      />
                    </div>
                    {errors["contact.phone"] && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors["contact.phone"]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="email"
                      className="text-xs font-medium text-gray-700"
                    >
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter institute email address"
                        value={formData.contact.email}
                        onChange={(e) =>
                          handleChange("contact.email", e.target.value)
                        }
                        className={`pl-9 h-10 text-sm ${
                          errors["contact.email"]
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-green-500"
                        }`}
                      />
                    </div>
                    {errors["contact.email"] && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors["contact.email"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Security Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  Account Security
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="password"
                      className="text-xs font-medium text-gray-700"
                    >
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        className={`pl-9 pr-9 h-10 text-sm ${
                          errors.password
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-green-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      6-20 characters required
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs font-medium text-gray-700"
                    >
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleChange("confirmPassword", e.target.value)
                        }
                        className={`pl-9 pr-9 h-10 text-sm ${
                          errors.confirmPassword
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-green-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Submit Section */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] h-11 text-sm"
                >
                  <School className="w-4 h-4 mr-2" />
                  Register Institute
                </Button>

                <div className="text-center text-xs text-gray-600 space-y-2">
                  <p>
                    By registering your institute, you agree to our{" "}
                    <a
                      href="#"
                      className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2"
                    >
                      Privacy Policy
                    </a>
                  </p>
                  <p className="text-xs text-gray-500">
                    Already have an account?{" "}
                    <a
                      href="#"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Sign in here
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>
            © 2024 Institute Portal. All rights reserved. | Need help? Contact
            support@instituteportal.com
          </p>
        </div>
      </div>
    </div>
  );
}
