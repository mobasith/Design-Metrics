import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Types for form data and errors
interface FormData {
  userId: string;
  userName: string;
  email: string;
  password: string;
  roleId: number;
}

interface FormErrors {
  userName: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    userId: Date.now().toString(), // Generate a unique ID
    userName: "",
    email: "",
    password: "",
    roleId: 1,
  });

  // Error states
  const [formErrors, setFormErrors] = useState<FormErrors>({
    userName: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Validation functions
  const validatePassword = (password: string): string => {
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/\d/.test(password))
      return "Password must contain at least one number";
    if (!/[@$!%*?&#]/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateUserName = (userName: string): string => {
    if (userName.length < 3)
      return "Username must be at least 3 characters long";
    if (userName.length > 20) return "Username must be less than 20 characters";
    return "";
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "roleId" ? parseInt(value) : value,
    }));

    // Clear API error when user starts typing
    setApiError("");

    // Validate fields
    if (name === "password") {
      setFormErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    } else if (name === "email") {
      setFormErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    } else if (name === "userName") {
      setFormErrors((prev) => ({
        ...prev,
        userName: validateUserName(value),
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    // Validate all fields before submission
    const errors = {
      userName: validateUserName(formData.userName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    setFormErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        formData
      );

      if (response.data) {
        // Show success message
        alert("Registration successful!");
        // Redirect to login page
        navigate("/signin");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = error.response.data.errors
          .map((err: any) => err.msg)
          .join(", ");
        setApiError(backendErrors);
      } else {
        setApiError("An error occurred during registration. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex bg-white shadow-lg rounded-lg w-full max-w-3xl">
        {/* Left Side: Engaging Content */}
        <div className="w-1/2 p-8 bg-blue-600 text-white rounded-l-lg">
          <h2 className="text-3xl font-bold mb-6">Welcome to Our Platform!</h2>
          <p className="mb-6">
            Join our community and unlock exclusive features designed to enhance
            your experience.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Personalized Dashboard
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Premium Features Access
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Community Support
            </li>
          </ul>
        </div>

        {/* Right Side: Sign-Up Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h2>
          {apiError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                  formErrors.userName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your username"
                required
              />
              {formErrors.userName && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.userName}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
                required
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                  formErrors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
                required
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Role
              </label>
              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2"
                required
              >
                <option value={1}>User</option>
                <option value={2}>Designer</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white p-3 rounded font-bold
                ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }
              `}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
