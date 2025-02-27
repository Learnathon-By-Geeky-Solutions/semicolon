import { useGoogleLogin, CodeResponse } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';

type AuthResult = {
    code: string; // The authorization code returned by Google
};

const GoogleLoginPage = ({ page }: { page: string }) => {
    const responseGoogleLogin = async(authResult: AuthResult): Promise<void> => {
        try{

            if(authResult['code']){
                const { googleLogin } = useAuthStore.getState();
                const response = await googleLogin(authResult['code']);
                console.log(response);
            }
            else{
                console.log('No code returned');
            }
            console.log( 'Google login successful',  authResult);
        }
        catch(error){
            console.error('Google login failed', error);
        }
    }

    const handleGoogleLoginError = (errorResponse: Pick<CodeResponse, "error" | "error_description" | "error_uri">): void => {
        console.error('Google login error', errorResponse);
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: responseGoogleLogin,
        onError: handleGoogleLoginError,
        flow: 'auth-code',
    });

  return (
        <button onClick={handleGoogleLogin} className="w-full py-2 bg-green-800 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none transition duration-300 mt-4">
            {page === 'login' ? 'Login with Google' : 'Sign Up with Google'}
        </button>
  )
}

export default GoogleLoginPage