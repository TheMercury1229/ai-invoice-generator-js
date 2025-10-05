import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { validateEmail, validatePassword } from "../../utils/helper";
import { API_PATHS } from "../../utils/appPaths";
import axiosInstance from "../../utils/axiosInstance";

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  //Validation functions
  const validateName = (name) => {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters long";
    if (name.length > 50) return "Name must be less than 50 characters long";
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newFieldErrors = { ...fieldErrors };
      if (name === "email") {
        newFieldErrors.email = validateEmail(value);
      } else if (name === "password") {
        newFieldErrors.password = validatePassword(value);
        if (touched.confirmPassword) {
          newFieldErrors.confirmPassword = validateConfirmPassword(
            value,
            formData.confirmPassword
          );
        }
      } else if (name === "name") {
        newFieldErrors.name = validateName(value);
      } else if (name === "confirmPassword") {
        newFieldErrors.confirmPassword = validateConfirmPassword(
          formData.password,
          value
        );
      }
      setFieldErrors(newFieldErrors);
      if (error) {
        setError("");
      }
    }
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    //Validate on blur
    const newFieldErrors = { ...fieldErrors };
    if (name === "email") {
      newFieldErrors.email = validateEmail(formData.email);
    } else if (name === "password") {
      newFieldErrors.password = validatePassword(formData.password);
    } else if (name === "name") {
      newFieldErrors.name = validateName(formData.name);
    } else if (name === "confirmPassword") {
      newFieldErrors.confirmPassword = validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      );
    }
    setFieldErrors(newFieldErrors);
  };

  const isFormValid = () => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    return (
      !nameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
    );
  };

  const handleSignup = async () => {
    // Validate all fields before submitting
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (nameError || emailError || passwordError || confirmPasswordError) {
      setFieldErrors({
        name: nameError,
        email: emailError,
        passoword: passwordError,
        confirmPassword: confirmPasswordError,
      });
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      const data = response.data;
      const { token } = data;
      if (response.status === 201) {
        setSuccess("Account Created Successfully");

        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTouched({
          name: false,
          email: false,
          password: false,
          confirmPassword: false,
        });
        login(data, token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("Signup error:", error.response || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="size-12 bg-gradient-to-r from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <FileText className="size-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm">Join Invoice Generator today</p>
        </div>
        {/* Form */}
        <div className="space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.email && touched.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Enter your full name"
                required
              />
            </div>
            {fieldErrors.name && touched.name && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.email && touched.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Enter your email"
                required
              />
            </div>
            {fieldErrors.email && touched.email && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-12 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.password && touched.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                required
                placeholder="Create your password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="" /> : <Eye className="" />}
              </button>
            </div>
            {fieldErrors.password && touched.password && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-12 py-3 rounded-lg border focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.confirmPassword && touched.confirmPassword
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="" />
                ) : (
                  <Eye className="" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/*Error /Success Messages */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-400 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="size-4 text-black border-gray-300 rounded focus:ring-black mt-1"
              required
            />
            <label htmlFor="terms" className="">
              I agree to the{" "}
              <button className="text-black hover:underline font-medium">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-black hover:underline font-medium">
                Privacy Policy
              </button>
            </label>
          </div>
          {/* Signup Button */}
          <button
            className="w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 flex items-center justify-center gap-2  transition-colors  disabled:cursor-not-allowed group"
            onClick={handleSignup}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="ml-2" />
              </>
            )}
          </button>
        </div>
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              className="text-black font-medium hover:underline"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
