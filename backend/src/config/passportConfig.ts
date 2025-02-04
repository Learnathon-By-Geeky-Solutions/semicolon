import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

const passportConfig = (passport: passport.PassportStatic) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, profile);
      },
    ),
  );

  passport.serializeUser((user: any, done) => {
    done(null, { id: user.id, email: user.email });
  });

  passport.deserializeUser(async (serializedUser: any, done) => {
    try {
      // Fetch user from database using serializedUser.id
      done(null, serializedUser);
    } catch (error) {
      done(error, null);
    }
  });
};

export default passportConfig;
