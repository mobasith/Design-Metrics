import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../src/hooks/reduxHooks";
import { signIn } from "../../src/features/auth/authAPI";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../src/features/auth/authSlice";
import { RootState } from "../../src/app/store";
import Button from "../components/Button";
import InputField from "../components/InputField";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.auth);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const response = await signIn({ email, password });
      dispatch(signInSuccess(response));
      // Redirect based on role
      if (response.roleId === 1) {
        window.location.href = "/user-dashboard";
      } else {
        window.location.href = "/designer-dashboard";
      }
    } catch (err: any) {
      dispatch(signInFailure(err.response?.data?.message || "Sign-in failed"));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Sign In
        </h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          <InputField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            text={isLoading ? "Signing In..." : "Sign In"}
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
