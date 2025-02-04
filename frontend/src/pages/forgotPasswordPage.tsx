import {useState, FormEvent} from 'react';
import { Link } from "react-router-dom";
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const ForgotPasswordPage = () => {

    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {isLoading, forgotPassword} = useAuthStore();

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      try {
        await forgotPassword(email);
        setIsSubmitted(true);
      } catch (error) {
        console.error('Forgot password error:', error);
      }
    };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-100 flex items-center justify-center"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Forgot Password
        </h2>
        {!isSubmitted ? 
        (<form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-center font-medium text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
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
          <div className="flex items-center justify-between">
            <Link to="/login" className="text-green-600 hover:underline">
              Back to Login
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-800 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none transition duration-300"
          >
            {isLoading ? "Sending..." : "Send Email"}
          </button>
        </form>) : 
        (<div className="text-center">
          <motion.div
          initial={{ opacity: 0, y: -20 }}  
          animate={{ opacity: 1, y: 0 }}
          transition={{type: 'spring', stiffness: 500, damping: 30}}
          className="text-green-600 text-lg font-semibold mb-4 flex items-center justify-center"
          >
           <Mail className="h-8 w-8 text-green-600 mr-2"/>
          </motion.div>
          <p className='text-sm text-black font-semibold mb-4'>
            If an account exists for {email}, we've sent you a password reset link.
          </p>
          <div className="flex items-center justify-center">
            <Link to="/login" className="text-green-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>)}
        <div className="mt-4 text-center text-gray-600">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-green-600 hover:text-green-500">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ForgotPasswordPage