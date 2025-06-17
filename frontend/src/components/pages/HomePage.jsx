import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Building2,
  LogIn,
  Users,
  BookOpen,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                EduConnect
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                to="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Features
              </Link>
              <Link
                to="#about"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link
                to="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect Students with
            <span className="text-blue-600 block">Educational Institutes</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of students and institutes in our comprehensive
            educational platform. Register, connect, and unlock your learning
            potential.
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Student Registration */}
          <Card className="relative overflow-hidden border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Student Registration
              </CardTitle>
              <CardDescription className="text-gray-600">
                Join as a student to explore courses, connect with institutes,
                and advance your education
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                asChild
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Link to="/student/register">Student Registration</Link>
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Free registration • Instant access
              </p>
            </CardContent>
          </Card>

          {/* Institute Registration */}
          <Card className="relative overflow-hidden border-2 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Institute Registration
              </CardTitle>
              <CardDescription className="text-gray-600">
                Register your educational institute to reach students and manage
                enrollments
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
              >
                <Link to="/institute/register">Institute Registration</Link>
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Verified institutes • Professional tools
              </p>
            </CardContent>
          </Card>

          {/* Login */}
          <Card className="relative overflow-hidden border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <LogIn className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Already Registered?
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to your account to access your dashboard and continue
                your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <Link to="/login">Login to Account</Link>
              </Button>
              <p className="text-sm text-gray-500 mt-3">
                Secure access • All user types
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <section id="features" className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose EduConnect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Connection
              </h3>
              <p className="text-gray-600">
                Seamlessly connect students with the right educational
                institutes
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comprehensive Courses
              </h3>
              <p className="text-gray-600">
                Access a wide range of courses and educational programs
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Verified Quality
              </h3>
              <p className="text-gray-600">
                All institutes are verified to ensure quality education
                standards
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Registered Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Partner Institutes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                1,000+
              </div>
              <div className="text-gray-600">Courses Available</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
     
    </div>
  );
}
