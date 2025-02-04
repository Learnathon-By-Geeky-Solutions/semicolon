import {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {resetPassword, isLoading, error, message} = useAuthStore();
  
    const {token} = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
        alert("Passwords do not match");
        } else {
            try {
                await resetPassword(token, password);
                navigate("/");
            } catch (error) {
                console.error('Reset password error:', error);
            }
        }
    };
  
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
                    Reset Password
                </h2>
                
                {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
				{message && <p className='text-green-500 text-sm mb-4'>{message}</p>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            New Password
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
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {password !== confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">Passwords do not match</p> 
                            )}
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600">
                       { isLoading ? "Loading..." : " Reset Password" }
                    </button>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </form>
                <div className="mt-4 text-center text-gray-600">
                    <p>
                        Don't have an account?{" "}
                        <a href="/signup" className="text-green-600 hover:text-green-500">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage