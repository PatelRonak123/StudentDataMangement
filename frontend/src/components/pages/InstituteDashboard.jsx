"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  ArrowLeft,
  LogIn,
  LogOut,
  Loader2,
  CheckCircle,
  Mail,
  User,
  Building,
  Calendar,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function InstituteDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [instituteInfo, setInstituteInfo] = useState(null);

  const verifyInstituteAndFetch = async () => {
    const loadingToast = toast.loading("Verifying institute access...");
    try {
      setAuthLoading(true);

      const verifyInstitute = await axios.get(
        "/api/v1/verifyInstiute",
        {
          withCredentials: true,
        }
      );

      if (verifyInstitute.status === 200) {
        setIsAuthenticated(true);
        setInstituteInfo(verifyInstitute.data.currentInstitute);

        const fetchAcceptedStudents = await axios.get(
          "/api/v1/fetchInstitutewithStatus",
          {
            withCredentials: true,
          }
        );

        if (fetchAcceptedStudents.status === 200) {
          setAcceptedStudents(fetchAcceptedStudents.data.institutewithStatus);
          toast.success("Institute verified and students fetched", {
            id: loadingToast,
          });
        } else {
          setAcceptedStudents([]);
          toast.error("Failed to fetch accepted students", {
            id: loadingToast,
          });
        }
      } else {
        setIsAuthenticated(false);
        toast.error("Institute verification failed", { id: loadingToast });
      }
    } catch (err) {
      console.error("❌ Error verifying institute or fetching students:", err);
      setIsAuthenticated(false);
      setAcceptedStudents([]);
      toast.error("Failed to verify institute or fetch data", {
        id: loadingToast,
      });
    } finally {
      setAuthLoading(false);
      setStudentsLoading(false);
    }
  };

  const handleLogout = async () => {
    const logoutToast = toast.loading("Logging out...");
    try {
      setLogoutLoading(true);

      const response = await axios.post(
        "/api/v1/institute-logout",
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
    verifyInstituteAndFetch();
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <Card className="w-96 shadow-xl border-0 bg-white/90 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Verifying Institute Access
            </h3>
            <p className="text-gray-600">
              Please wait while we check your institute credentials...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show unauthorized access if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-md">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1"></div>
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg mb-6">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Institute Authorization Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in as an authorized institute to access this
              dashboard. Please log in with your institute credentials to
              continue.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Institute Login
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
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Institute Panel
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              {instituteInfo?.instituteName || "Institute"} Dashboard
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto mb-4">
              View and manage all students who have been accepted and enrolled
              in your institute. Track student information, courses, and
              enrollment details.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 px-3 py-1 text-sm"
              >
                <Building className="w-3 h-3 mr-1" />
                Institute Dashboard
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 px-3 py-1 text-sm"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {acceptedStudents.length} Accepted Students
              </Badge>
            </div>
          </div>
        </div>

        {/* Students Section */}
        {studentsLoading ? (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md mb-8">
            <CardContent className="p-6 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-gray-600">Loading accepted students...</p>
            </CardContent>
          </Card>
        ) : acceptedStudents.length > 0 ? (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1"></div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Accepted Students ({acceptedStudents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {acceptedStudents.map((student, index) => (
                  <Card
                    key={student._id || index}
                    className="border border-gray-200 hover:shadow-lg transition-all duration-300 bg-white"
                  >
                    <CardContent className="p-6">
                      {/* Student Header */}
                      <div className="flex items-center gap-4 mb-4">
                        {student.student?.profileImage ? (
                          <img
                            src={
                              student.student.profileImage || "/placeholder.svg"
                            }
                            alt={student.student?.fullName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {student.student?.fullName || "N/A"}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accepted
                          </Badge>
                        </div>
                      </div>

                      {/* Student Details */}
                      <div className="space-y-3 text-sm">
                        {/* Course Information */}
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-purple-600" />
                          <div>
                            <span className="font-medium text-gray-600">
                              Course:
                            </span>
                            <p className="text-gray-800">
                              {student.course || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <div className="flex-1">
                            <span className="font-medium text-gray-600">
                              Email:
                            </span>
                            <p className="text-gray-800 text-xs break-all">
                              {student.student?.contact?.email || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          <div>
                            <span className="font-medium text-gray-600">
                              Phone:
                            </span>
                            <p className="text-gray-800">
                              {student.student?.contact?.phone || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-medium text-gray-600">
                              Address:
                            </span>
                            <p className="text-gray-800 text-xs">
                              {student.student?.address
                                ? `${student.student.address.street || ""}, ${
                                    student.student.address.city || ""
                                  }, ${student.student.address.state || ""} - ${
                                    student.student.address.pinCode || ""
                                  }`.replace(/^,\s*|,\s*$/g, "")
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Enrollment Date */}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <div>
                            <span className="font-medium text-gray-600">
                              Enrolled:
                            </span>
                            <p className="text-gray-800">
                              {student.student?.enrolledDate
                                ? new Date(
                                    student.student.enrolledDate
                                  ).toLocaleDateString()
                                : new Date(
                                    student.appliedAt
                                  ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Age and Gender */}
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="font-medium text-gray-600">
                              Age:
                            </span>
                            <span className="text-gray-800 ml-1">
                              {student.student?.age || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Gender:
                            </span>
                            <span className="text-gray-800 ml-1">
                              {student.student?.gender || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Student ID Badge */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Badge
                          variant="outline"
                          className="text-gray-600 text-xs w-full justify-center"
                        >
                          Student ID: {student.studentId || student._id}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md mb-8">
            <div className="bg-gradient-to-r from-gray-400 to-gray-500 h-1"></div>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">
                No Accepted Students Yet
              </h3>
              <p className="text-gray-600">
                No students have been accepted for your institute yet. Check
                back later as applications are processed by the admin.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Summary Statistics */}
        {acceptedStudents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-800">
                  {acceptedStudents.length}
                </h3>
                <p className="text-gray-600">Total Students</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <GraduationCap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-800">
                  {new Set(acceptedStudents.map((s) => s.course)).size}
                </h3>
                <p className="text-gray-600">Active Courses</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-gray-800">100%</h3>
                <p className="text-gray-600">Acceptance Rate</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
