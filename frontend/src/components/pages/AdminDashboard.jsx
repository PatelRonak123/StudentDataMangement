"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Shield,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  ArrowLeft,
  LogIn,
  LogOut,
  Loader2,
  Clock,
  Mail,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Ensure axios always sends cookies
axios.defaults.withCredentials = true;

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const verifyAdminandFetch = async () => {
    const loadingToast = toast.loading("Verifying admin...");
    try {
      setAuthLoading(true);

      const verifyAdmin = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/verify-admin`,
        { withCredentials: true }
      );
      if (verifyAdmin.status === 200) {
        setIsAuthenticated(true);

        const fetchStudentApplication = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/v1/fetch-studentApplication`,
          { withCredentials: true }
        );

        if (fetchStudentApplication.status === 200) {
          setStudents(fetchStudentApplication.data.fetchStatus);
          toast.success("Admin verified and students fetched", {
            id: loadingToast,
          });
        } else {
          setStudents([]);
          toast.error("Failed to fetch student applications", {
            id: loadingToast,
          });
        }
      } else {
        setIsAuthenticated(false);
        toast.error("Admin verification failed", { id: loadingToast });
      }
    } catch (err) {
      console.error("❌ Error verifying admin or fetching students:", err);
      setIsAuthenticated(false);
      setStudents([]);
      toast.error("Failed to verify admin or fetch data", { id: loadingToast });
    } finally {
      setAuthLoading(false);
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    verifyAdminandFetch();
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    const loadingToast = toast.loading("Logging out...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin-logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsAuthenticated(false);
        toast.success("Logged out successfully", { id: loadingToast });
        navigate("/login");
      } else {
        toast.error("Failed to logout", { id: loadingToast });
      }
    } catch (err) {
      console.error("Error logging out:", err);
      setIsAuthenticated(false);
      toast.success("Logged out successfully", { id: loadingToast });
      navigate("/login");
    }
  };

  const handleApproveStudent = async (studentId) => {
    try {
      const loadingToast = toast.loading("Approving student...");
      const response = await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/v1/approveStudent/${studentId}`,
        { status: "Accepted" }
      );

      if (response.status === 200) {
        setStudents(students.filter((student) => student._id !== studentId));
        toast.success("Student approved successfully ", { id: loadingToast });
      } else {
        toast.error("Failed to approve student ❌", { id: loadingToast });
      }
    } catch (err) {
      console.error("Error approving student:", err.message);
      toast.error("Error approving student ❌", { id: loadingToast });
    }
  };

  const handleRejectStudent = async (studentId) => {
    const loadingToast = toast.loading("Rejecting student...");
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/v1/rejectstudents/${studentId}`,
        { status: "Rejected" },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setStudents(students.filter((student) => student._id !== studentId));
        toast.success("Student rejected successfully ", { id: loadingToast });
      } else {
        toast.error("Failed to reject student ❌", { id: loadingToast });
      }
    } catch (err) {
      console.error("Error approving student:", err.message);
      toast.error("Error rejecting student ❌", { id: loadingToast });
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center">
        <Card className="w-96 shadow-xl border-0 bg-white/90 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-slate-600" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Verifying Admin Access
            </h3>
            <p className="text-gray-600">
              Please wait while we check your admin privileges...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // After authLoading finishes, only then show unauthorized if needed
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-md">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 h-1"></div>
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Admin Authorization Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in as an authorized administrator to access
              this dashboard. Please log in with your admin credentials to
              continue.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Admin Login
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin Panel
            </Link>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-700 transition-colors duration-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-600 to-gray-600 rounded-full shadow-lg mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600 bg-clip-text text-transparent mb-3">
              Pending Student Applications
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto mb-4">
              Review and manage student applications that are awaiting approval.
              You can approve or reject applications based on the provided
              information.
            </p>
            <Badge
              variant="secondary"
              className="bg-slate-100 text-slate-700 px-3 py-1 text-sm"
            >
              <Shield className="w-3 h-3 mr-1" />
              Admin Dashboard
            </Badge>
          </div>
        </div>

        {/* Students Section */}
        {studentsLoading ? (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md mb-8">
            <CardContent className="p-6 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-600" />
              <p className="text-gray-600">Loading pending applications...</p>
            </CardContent>
          </Card>
        ) : students.length > 0 ? (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md mb-8">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-1"></div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Pending Applications ({students.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="max-h-[800px] overflow-y-auto space-y-6 pr-2">
                {students.map((student, index) => (
                  <div
                    key={student._id || index}
                    className="border border-gray-200 rounded-lg p-6 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    {/* Student Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {student.student?.profileImage ? (
                          <img
                            src={
                              student.student.profileImage || "/placeholder.svg"
                            }
                            alt={student.student?.fullName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-r from-slate-500 to-gray-500 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {student.student?.fullName || "N/A"}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-700 text-xs"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-gray-600 text-xs"
                            >
                              ID: {student.studentId || student._id}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Applied:{" "}
                            {new Date(student.appliedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                          onClick={() => handleApproveStudent(student._id)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="shadow-md hover:shadow-lg transition-all duration-300"
                          onClick={() => handleRejectStudent(student._id)}
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>

                    {/* Student Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      {/* Personal Information */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-1">
                          <User className="w-3 h-3 text-blue-600" />
                          Personal Info
                        </h4>
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">
                              Full Name:
                            </span>
                            <p className="text-gray-800">
                              {student.student?.fullName || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Age:
                            </span>
                            <p className="text-gray-800">
                              {student.student?.age || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Date of Birth:
                            </span>
                            <p className="text-gray-800">
                              {student.student?.dateOfBirth
                                ? new Date(
                                    student.student.dateOfBirth
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Gender:
                            </span>
                            <p className="text-gray-800">
                              {student.student?.gender || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-green-600" />
                          Contact Info
                        </h4>
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">
                              Email:
                            </span>
                            <p className="text-gray-800 break-all text-xs">
                              {student.student?.contact?.email || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Phone:
                            </span>
                            <p className="text-gray-800">
                              {student.student?.contact?.phone || "N/A"}
                            </p>
                          </div>
                          <div>
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
                      </div>

                      {/* Academic Information */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-purple-600" />
                          Academic Info
                        </h4>
                        <div className="space-y-1">
                          <div>
                            <span className="font-medium text-gray-600">
                              Applied Course:
                            </span>
                            <p className="text-gray-800">
                              {student.course || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Institute:
                            </span>
                            <p className="text-gray-800">
                              {student.institute?.instituteName || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Application Status:
                            </span>
                            <p className="text-gray-800">
                              {student.status || "N/A"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">
                              Enrolled Date:
                            </span>
                            <p className="text-gray-800">
                              {student.student?.enrolledDate
                                ? new Date(
                                    student.student.enrolledDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {student.msg && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-1">
                          Application Message:
                        </h4>
                        <p className="text-sm text-gray-600">{student.msg}</p>
                      </div>
                    )}

                    {student.documents && student.documents.length > 0 && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Submitted Documents ({student.documents.length}):
                        </h4>
                        <div className="space-y-1">
                          {student.documents.map((doc, docIndex) => (
                            <div
                              key={docIndex}
                              className="flex items-center gap-2"
                            >
                              <span className="text-xs text-gray-600">•</span>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                              >
                                {doc.filename}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1"></div>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">
                No Pending Applications
              </h3>
              <p className="text-gray-600">
                Great! All student applications have been processed. Check back
                later for new applications.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
