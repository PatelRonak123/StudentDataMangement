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
    User,
    Phone,
    Lock,
    MapPin,
    Mail,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    GraduationCap,
    Hash,
  } from "lucide-react";
  import { format } from "date-fns";
  import axios from "axios";
  import toast from "react-hot-toast";
  export default function StudnetRegister() {
    const [formData, setFormData] = useState({
      fullName: "",
      age: "",
      gender: "",
      dateOfBirth: null,
      address: {
        street: "",
        city: "",
        state: "",
        pinCode: "",
      },
      contact: {
        phone: "",
        email: "",
      },
      password: "",
      confirmPassword: "",
      profileImage: null,
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
          profileImage: "File size should be less than 5MB",
        });
        return;
      }
      setFormData({
        ...formData,
        profileImage: file,
      });
      setErrors({
        ...errors,
        profileImage: "",
      });
    };

    const validateForm = () => {
      const newErrors = {};

      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (formData.fullName.trim().length < 3) {
        newErrors.fullName = "Name must be at least 3 characters";
      } else if (formData.fullName.trim().length > 30) {
        newErrors.fullName = "Name must be at most 30 characters";
      }
      if (!formData.age || formData.age < 8) {
        newErrors.age = "Age must be at least 8";
      }
      if (!formData.gender) newErrors.gender = "Please select gender";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.address.street.trim())
        newErrors["address.street"] = "Street is required";
      if (!formData.address.city.trim())
        newErrors["address.city"] = "City is required";
      if (!formData.address.state.trim())
        newErrors["address.state"] = "State is required";
      if (!formData.address.pinCode.trim()) {
        newErrors["address.pinCode"] = "Pin code is required";
      } else if (!/^\d{6}$/.test(formData.address.pinCode)) {
        newErrors["address.pinCode"] = "Pin code must be 6 digits";
      }
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

        const formDataToSend = new FormData();
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("age", formData.age);
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("dateOfBirth", formData.dateOfBirth);
        formDataToSend.append("contact[email]", formData.contact.email);
        formDataToSend.append("contact[phone]", formData.contact.phone);
        formDataToSend.append("address[street]", formData.address.street);
        formDataToSend.append("address[city]", formData.address.city);
        formDataToSend.append("address[state]", formData.address.state);
        formDataToSend.append("address[pinCode]", formData.address.pinCode);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("confirmPassword", formData.confirmPassword);

        if (formData.profileImage) {
          formDataToSend.append("profileImage", formData.profileImage);
        }

        const response = await axios.post(
          "http://localhost:3000/api/v1/student-register",
          formDataToSend,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        toast.dismiss(loadingToast);

        if (response.status === 201 || response.status === 200) {
          toast.success("🎉 Registration successful!");
          console.log("Form submitted successfully ✅", response.data);
          setFormData({
            fullName: "",
            age: "",
            gender: "",
            dateOfBirth: "",
            address: {
              street: "",
              city: "",
              state: "",
              pinCode: "",
            },
            contact: {
              phone: "",
              email: "",
            },
            password: "",
            confirmPassword: "",
            profileImage: null,
          });
        }
      } catch (err) {
        toast.dismiss();
        toast.error(err.response?.data?.message || "Registration failed");
        console.error("Registration error:", err.response?.data || err.message);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Student Registration
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto mb-4">
              Join our academic community and unlock your potential. Create your
              student account to access courses, resources, and connect with
              peers.
            </p>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 px-3 py-1 text-sm"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Secure & Verified
            </Badge>
          </div>

          {/* Main Form */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1"></div>

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
                      <User className="w-5 h-5 text-blue-600" />
                      Profile Information
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload your profile picture and basic information
                    </p>

                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border-3 border-white shadow-lg flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                          {formData.profileImage ? (
                            <img
                              src={
                                URL.createObjectURL(formData.profileImage) ||
                                "/placeholder.svg"
                              }
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          )}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="w-full max-w-sm">
                        <Label
                          htmlFor="profileImage"
                          className="text-xs font-medium text-gray-700 mb-1 block"
                        >
                          Profile Picture (Optional)
                        </Label>
                        <Input
                          id="profileImage"
                          type="file"
                          name="profileImage"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="cursor-pointer text-xs file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {errors.profileImage && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.profileImage}
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
                          htmlFor="fullName"
                          className="text-xs font-medium text-gray-700"
                        >
                          Full Name *
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            id="fullName"
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={(e) =>
                              handleChange("fullName", e.target.value)
                            }
                            className={`pl-9 h-10 text-sm ${
                              errors.fullName
                                ? "border-red-500 focus:border-red-500"
                                : "focus:border-blue-500"
                            }`}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor="age"
                          className="text-xs font-medium text-gray-700"
                        >
                          Age *
                        </Label>
                        <Input
                          id="age"
                          type="number"
                          name="age"
                          placeholder="Enter your age"
                          value={formData.age}
                          onChange={(e) => handleChange("age", e.target.value)}
                          min="3"
                          className={`h-10 text-sm ${
                            errors.age
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-blue-500"
                          }`}
                        />
                        {errors.age && (
                          <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.age}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-700">
                          Gender *
                        </Label>
                        <Select
                          onValueChange={(value) => handleChange("gender", value)}
                        >
                          <SelectTrigger
                            className={`h-10 text-sm ${
                              errors.gender ? "border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male" name="Male">
                              Male
                            </SelectItem>
                            <SelectItem value="Female" name="Female">
                              Female
                            </SelectItem>
                            <SelectItem value="Other" name="Other">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.gender && (
                          <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.gender}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-gray-700">
                          Date of Birth *
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full h-10 justify-start text-left font-normal text-sm ${
                                errors.dateOfBirth ? "border-red-500" : ""
                              }`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.dateOfBirth ? (
                                format(formData.dateOfBirth, "PPP")
                              ) : (
                                <span className="text-gray-500">
                                  Select your birth date
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              name="dateOfBirth"
                              selected={formData.dateOfBirth}
                              onSelect={(date) =>
                                handleChange("dateOfBirth", date)
                              }
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.dateOfBirth && (
                          <p className="text-red-500 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.dateOfBirth}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Address Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label
                        htmlFor="street"
                        className="text-xs font-medium text-gray-700"
                      >
                        Street Address *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          id="street"
                          type="text"
                          name="street"
                          placeholder="Enter street address"
                          value={formData.address.street}
                          onChange={(e) =>
                            handleChange("address.street", e.target.value)
                          }
                          className={`pl-9 h-10 text-sm ${
                            errors["address.street"]
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-blue-500"
                          }`}
                        />
                      </div>
                      {errors["address.street"] && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors["address.street"]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="city"
                        className="text-xs font-medium text-gray-700"
                      >
                        City *
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={formData.address.city}
                        onChange={(e) =>
                          handleChange("address.city", e.target.value)
                        }
                        className={`h-10 text-sm ${
                          errors["address.city"]
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-blue-500"
                        }`}
                      />
                      {errors["address.city"] && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors["address.city"]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="state"
                        className="text-xs font-medium text-gray-700"
                      >
                        State *
                      </Label>
                      <Input
                        id="state"
                        type="text"
                        name="state"
                        placeholder="Enter state"
                        value={formData.address.state}
                        onChange={(e) =>
                          handleChange("address.state", e.target.value)
                        }
                        className={`h-10 text-sm ${
                          errors["address.state"]
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-blue-500"
                        }`}
                      />
                      {errors["address.state"] && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors["address.state"]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor="pinCode"
                        className="text-xs font-medium text-gray-700"
                      >
                        Pin Code *
                      </Label>
                      <Input
                        id="pinCode"
                        type="text"
                        name="pinCode"
                        placeholder="Enter 6-digit pin code"
                        value={formData.address.pinCode}
                        onChange={(e) =>
                          handleChange("address.pinCode", e.target.value)
                        }
                        maxLength={6}
                        className={`h-10 text-sm ${
                          errors["address.pinCode"]
                            ? "border-red-500 focus:border-red-500"
                            : "focus:border-blue-500"
                        }`}
                      />
                      {errors["address.pinCode"] && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors["address.pinCode"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
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
                              : "focus:border-blue-500"
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
                          placeholder="Enter your email address"
                          value={formData.contact.email}
                          onChange={(e) =>
                            handleChange("contact.email", e.target.value)
                          }
                          className={`pl-9 h-10 text-sm ${
                            errors["contact.email"]
                              ? "border-red-500 focus:border-red-500"
                              : "focus:border-blue-500"
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
                    <Lock className="w-4 h-4 text-blue-600" />
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
                              : "focus:border-blue-500"
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
                              : "focus:border-blue-500"
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
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] h-11 text-sm"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Create Student Account
                  </Button>

                  <div className="text-center text-xs text-gray-600 space-y-2">
                    <p>
                      By creating an account, you agree to our{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                      >
                        Privacy Policy
                      </a>
                    </p>
                    <p className="text-xs text-gray-500">
                      Already have an account?{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium"
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
              © 2024 Student Portal. All rights reserved. | Need help? Contact
              support@studentportal.com
            </p>
          </div>
        </div>
      </div>
    );
  }
