import React, { useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Add your sign-in logic here
    alert(`Signing in with Email: ${email}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex bg-white shadow-lg rounded-lg w-full max-w-3xl">
        {/* Left Side: Product Information */}
        <div className="w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-4">Welcome to Our Product!</h2>
          <p className="text-gray-600 mb-4">
            Experience the best features and functionalities we have to offer. 
            Sign in to your account to start using our amazing tools and services!
          </p>
          <p className="text-gray-600">
            Join thousands of satisfied users who trust us for their needs. 
            Get started now and unlock your potential!
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
          <form className="space-y-4" onSubmit={handleSignIn}>
            <InputField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              required
            />
            <InputField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              required
            />
            {/* The Button should not have an onClick handler here, it's handled by the form's onSubmit */}
            <Button text="Sign In" />
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
