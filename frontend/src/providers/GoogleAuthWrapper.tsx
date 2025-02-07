import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginPage from '../pages/GoogleLoginPage';
import { GOOGLE_CLIENT_ID } from '../constants/paths';

const GoogleAuthWrapper = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLoginPage />
    </GoogleOAuthProvider>
  )
}

export default GoogleAuthWrapper