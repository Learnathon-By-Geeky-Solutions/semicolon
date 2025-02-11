import { useState } from 'react';
import { Mail, User, Shield, X } from 'lucide-react';
import PageLayout from '../components/layout/pageLayout';
import { mainNavItems } from '../config/navigation';
import { useAuthStore } from '../store/authStore';
import { verifyEmail } from '../helpers/settings';

const SettingsPage = () => {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(user?.isVerified || false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement API call to update user profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    setIsSaving(true);
    e.preventDefault();
    try {
      const isVerified = await verifyEmail({email, verificationCode, name});   
      if (isVerified) {
          setIsEmailVerified(true);
          setVerificationCode('');
          setIsSaving(false);
      } else {
          setIsSaving(false);
      }
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  };

  return (
    <div>       
    {isAuthenticated && (<PageLayout
      title="Settings"
      navItems={mainNavItems}
    >
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Settings</h2>
              
              {/* Name Input */}
              <div className="mb-6">
                <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-6">
                <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Email Verification */}
              {isEmailVerified ? (<></>) : (
                <div className="mb-6">
                  <button
                    onClick={() => setIsVerificationModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Verify Email
                </button>
              </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {isVerificationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Email Verification</h3>
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {!isEmailVerified ? (
            <form onSubmit={handleVerificationSubmit} className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                We've sent a verification code to your email address. Please enter it below.
              </p>
              
              <div className="mb-6">
                <label htmlFor="VerificationCode"  className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter verification code"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsVerificationModalOpen(false)}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Verify
                </button>
              </div>
            </form>
            ) : (
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Email verification successful!
                </p>
                <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsVerificationModalOpen(false)}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
                >
                  Close
                </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>) }
    </div>
  );
};

export default SettingsPage;