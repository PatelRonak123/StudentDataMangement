"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Send,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  ArrowLeft,
  LogIn,
  LogOut,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InstituteApplication from "./InstituteApplication";
import toast from "react-hot-toast";
export default function InstituteDetails() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState([]);
  const [institutesLoading, setInstitutesLoading] = useState(true);
  const [selectedInstitute, setSelectedInstitute] = useState(null);

  const verifyAndFetch = async () => {
    try {
      setAuthLoading(true);

      // Step 1: Verify login
      const verify = await axios.get("http://localhost:3000/api/v1/verify", {
        withCredentials: true,
      });

      if (verify.status === 200) {
        setIsAuthenticated(true);

        // Step 2: Fetch institute details
        const response = await axios.get(
          "http://localhost:3000/api/v1/institute-details",
          {
            withCredentials: true,
          }
        );

        if (
          response.status === 200 &&
          response.data.fetchInstitute?.length > 0
        ) {
          setInstitutes(response.data.fetchInstitute);
        } else {
          setInstitutes([]);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error verifying or fetching institutes:", err.message);
      setIsAuthenticated(false);
      setInstitutes([]);
    } finally {
      setAuthLoading(false);
      setInstitutesLoading(false);
    }
  };

  const handleLogout = async () => {
    const logoutToast = toast.loading("Logging out...");
    try {
      setLogoutLoading(true);

      const response = await axios.post(
        "http://localhost:3000/api/v1/student-logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsAuthenticated(false);
        toast.success("Logged out successfully", { id: logoutToast });
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during logout:", err.message);
      setIsAuthenticated(false);
      toast.success("Logged out successfully", { id: logoutToast });
      navigate("/login");
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    verifyAndFetch();
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleApplyClick = (institute) => {
    setSelectedInstitute(institute);
  };

  const handleCloseForm = () => {
    setSelectedInstitute(null);
  };

  const handleApplicationSuccess = () => {
    setSelectedInstitute(null);
    // Optionally refresh the institutes list or show a success message
  };

  // Loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <Card className="w-96 shadow-xl border-0 bg-white/90 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Verifying Authentication
            </h3>
            <p className="text-gray-600">
              Please wait while we check your login status...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated - show login prompt
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-md">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 h-1"></div>
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg mb-6">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access the institute application page.
              Please log in to continue with your application.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Go to Login
              </Button>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>

            <Button
              onClick={handleLogout}
              disabled={logoutLoading}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-colors"
            >
              {logoutLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Apply to Institute
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto mb-4">
              Submit your application to join your preferred institute and
              course. Fill out the form below to get started on your educational
              journey.
            </p>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 px-3 py-1 text-sm"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Secure Application Process
            </Badge>
          </div>
        </div>

        {/* Institute Details Section */}
        {institutesLoading ? (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md mb-8">
            <CardContent className="p-6 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-gray-600">Loading institute details...</p>
            </CardContent>
          </Card>
        ) : institutes.length > 0 ? (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1"></div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Available Institutes ({institutes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2">
                {institutes.map((institute, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    {/* Institute Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {institute.instituteLogo ? (
                          <img
                            src={institute.instituteLogo || "/placeholder.svg"}
                            alt={`${institute.instituteName} Logo`}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {institute.instituteName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 text-xs"
                            >
                              {institute.instituteType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-gray-600 text-xs"
                            >
                              Est. {institute.establishmentYear}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={() => handleApplyClick(institute)}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Apply Now
                      </Button>
                    </div>

                    {/* Institute Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      {/* Basic Information */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-600" />
                          Basic Info
                        </h4>
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">
                              Department:
                            </span>
                            <p className="text-gray-800">
                              {institute.department}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Reg. Number:
                            </span>
                            <p className="text-gray-800 font-mono text-xs">
                              {institute.registrationNumber}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Reg. Date:
                            </span>
                            <p className="text-gray-800">
                              {new Date(
                                institute.registrationDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-green-600" />
                          Contact Info
                        </h4>
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">
                              Phone:
                            </span>
                            <p className="text-gray-800">
                              +91 {institute.contact?.phone}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Email:
                            </span>
                            <p className="text-gray-800 break-all text-xs">
                              {institute.contact?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-purple-600" />
                          Details
                        </h4>
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">
                              Type:
                            </span>
                            <p className="text-gray-800">
                              {institute.instituteType}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Established:
                            </span>
                            <p className="text-gray-800">
                              {institute.establishmentYear}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Experience:
                            </span>
                            <p className="text-gray-800">
                              {new Date().getFullYear() -
                                institute.establishmentYear}{" "}
                              years
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md mb-8">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1"></div>
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">
                No Institutes Found
              </h3>
              <p className="text-gray-600">
                Currently, there are no institutes available for application.
                Please check back later or contact support.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Application Form Modal */}
      {selectedInstitute && (
        <InstituteApplication
          institute={selectedInstitute}
          onClose={handleCloseForm}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
}
