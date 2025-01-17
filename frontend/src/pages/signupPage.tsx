import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { SERVER_URL } from '../../constants/paths';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"user" | "admin" | "authority" | "volunteer">("user");
  const [document, setDocument] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);

    if ((role === 'authority' || role === 'volunteer') && document) {
        formData.append('document', document);
    }

    try {
        const response = await axios.post(`${SERVER_URL}/api/v1/auth/signup`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        alert(response.data.message);  
    } catch (error) {
        console.error('Error during signup', error);
        alert('An error occurred during signup.');
    }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-600">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "user" | "admin" | "authority" | "volunteer")}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="authority">Authority</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>

          {/* Document Upload Section (Only for Authority or Volunteer) */}
          {(role === "authority" || role === "volunteer") && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-lg transition-all duration-300">
              <label htmlFor="document" className="block text-sm font-medium text-gray-600">
                Upload Verification Document (PDF, DOCX, or Image)
              </label>
              <input
                type="file"
                id="document"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                required={role === "authority" || role === "volunteer"}
              />
              {document && <p className="text-sm text-green-600 mt-2">Selected: {document.name}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-green-800 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center text-gray-600">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-green-600 hover:text-green-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
