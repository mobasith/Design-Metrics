import React, { useState } from 'react';
import Button from '../components/Button';
import InputField from '../components/InputField';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Add your sign-up logic here
    alert(`Signing up with Username: ${username}, Email: ${email}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex bg-white shadow-lg rounded-lg w-full max-w-3xl">
        {/* Left Side: Engaging Content */}
        <div className="w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-4">Join Our Community!</h2>
          <p className="text-gray-600 mb-4">
            Sign up today and unlock exclusive features! 
            Join our vibrant community and start your journey with us. 
          </p>
          <ul className="list-disc pl-5 text-gray-600 mb-4">
            <li>Access to premium content</li>
            <li>Receive personalized recommendations</li>
            <li>Join discussions and connect with others</li>
          </ul>
          <p className="text-gray-600">
            We value your privacy and ensure your data is secure. 
            Let's get you started on your adventure!
          </p>
        </div>

        {/* Right Side: Sign-Up Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
          <form className="space-y-4" onSubmit={handleSignUp}>
            <InputField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
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
            <Button text="Sign Up" />
          </form>
          <p className="mt-4 text-center text-gray-600">
            Already have an account? <a href="/signin" className="text-blue-500 hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
