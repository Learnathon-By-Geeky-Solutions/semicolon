import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

const passportConfig = (passport: passport.PassportStatic) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://3861-103-203-92-101.ngrok-free.app/api/v1/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

export default passportConfig;
