import React, { useState, FormEvent } from 'react';
import axios from "axios";
import { SERVER_URL } from '../../constants/paths';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/api/v1/auth/login`, {
        email,
        password,
      });
      alert(response);

    } catch (error) {
      console.error('Login failed', error);
      alert(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-800 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600">
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="text-green-600 hover:text-green-500">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
