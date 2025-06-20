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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  X,
  FileText,
  Send,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function InstituteApplication({
  institute,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    msg: "",
    course: "",
    documents: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const courses = institute.availableCourses || [
    "Engineering",
    "Medical",
    "Arts",
    "Commerce",
    "Science",
  ];
  // const [availableCourses, setAvailableCourses] = useState(courses);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          documents: "Only PDF, DOC, and DOCX files are allowed",
        }));
        return false;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          documents: "File size must be less than 10MB",
        }));
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...validFiles],
      }));
      setErrors((prev) => ({ ...prev, documents: "" }));
    }
  };

  const removeDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.course) {
      newErrors.course = "Please select a course";
    }

    if (formData.documents.length === 0) {
      newErrors.documents = "Please upload at least one document";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    toast.loading("Submitting application...");
    try {
      const submitFormData = new FormData();
      submitFormData.append("institute", institute._id);
      submitFormData.append("msg", formData.msg);
      submitFormData.append("course", formData.course);

      // Append each document
      formData.documents.forEach((file) => {
        submitFormData.append("documents", file);
      });

      const id = institute._id;
      const respose = await axios.post(
        `http://localhost:3000/api/v1/apply/${id}`,
        submitFormData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.dismiss();
      if (respose.status === 200 || respose.status === 201) {
        toast.success("Application submitted successfully!");
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    } catch (error) {
      toast.dismiss();
      console.error("Application submission error:", error);

      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white shadow-2xl border-0 rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 h-1.5 animate-gradient-x"></div>

        <CardHeader className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-10 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {institute.instituteLogo ? (
                <img
                  src={institute.instituteLogo || "/placeholder.svg"}
                  alt={`${institute.instituteName} Logo`}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg ring-2 ring-blue-100"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-blue-100">
                  <span className="text-white font-bold text-xl">
                    {institute.instituteName.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Apply to {institute.instituteName}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 font-medium">
                  {institute.department} • {institute.instituteType}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Selection */}
            <div className="space-y-3">
              <Label
                htmlFor="course"
                className="text-base font-semibold text-gray-900 flex items-center gap-2"
              >
                Course <span className="text-red-500">*</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </Label>
              <Select
                value={formData.course}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, course: value }));
                  setErrors((prev) => ({ ...prev, course: "" }));
                }}
              >
                <SelectTrigger
                  className={`h-12 text-left transition-all duration-200 ${
                    errors.course
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                >
                  <SelectValue placeholder="Select a course..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering" name="Engineering">
                    Engineering
                  </SelectItem>
                  <SelectItem value="Medical" name="Medical">
                    Medical
                  </SelectItem>
                  <SelectItem value="Arts" name="Arts">
                    Arts
                  </SelectItem>
                  <SelectItem value="Commerce" name="Commerce">
                    Commerce
                  </SelectItem>
                  <SelectItem value="Science" name="Science">
                    Science
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.course && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.course}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-3">
              <Label
                htmlFor="message"
                className="text-base font-semibold text-gray-900 flex items-center gap-2"
              >
                Message (Optional)
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </Label>
              <Textarea
                id="message"
                name="msg"
                placeholder="Write a message to the institute explaining why you want to apply..."
                value={formData.msg}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, msg: e.target.value }))
                }
                rows={5}
                className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-xl transition-all duration-200"
              />
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                Tell the institute about your interests, goals, or any specific
                questions you have.
              </p>
            </div>

            {/* Document Upload */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
                Documents <span className="text-red-500">*</span>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </Label>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                  errors.documents
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                }`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="documents" className="cursor-pointer">
                      <span className="mt-2 block text-lg font-semibold text-gray-900">
                        Upload your documents
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PDF, DOC, DOCX up to 10MB each
                      </span>
                    </Label>
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-blue-400 rounded-xl px-6 py-2 transition-all duration-200"
                    onClick={() =>
                      document.getElementById("documents")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>

              {errors.documents && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {errors.documents}
                  </span>
                </div>
              )}

              {/* Uploaded Documents List */}
              {formData.documents.length > 0 && (
                <div className="mt-4 space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                  <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    Uploaded Documents ({formData.documents.length})
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </Label>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {formData.documents.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <a
                              href={file.url || URL.createObjectURL(file)} // fallback for local preview
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-blue-600 underline hover:text-blue-800"
                            >
                              {file.name || file.filename}
                            </a>

                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
