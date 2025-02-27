import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginPage from '../pages/GoogleLoginPage';
import { GOOGLE_CLIENT_ID } from '../constants/paths';

const GoogleAuthWrapper = ({page}: {page: string}) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleLoginPage page={page} />
    </GoogleOAuthProvider>
  )
}

export default GoogleAuthWrapper