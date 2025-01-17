import React, { useState, FormEvent } from 'react';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'user' | 'admin' | 'authority' | 'volunteer'>('user');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Signed up with Email: " + email);
    
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              id="name"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-600">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin' | 'authority' | 'volunteer')}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="authority">Authority</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-800 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-green-600 hover:text-green-500">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
