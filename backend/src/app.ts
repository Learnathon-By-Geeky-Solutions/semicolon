import express from "express";
import { config } from "dotenv";
import morgan from 'morgan'
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import passport from "passport";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth20";
import { googleSignup } from "./controllers/authenticationController.js";

config()

const app = express();

app.use(cors({origin:"http://localhost:5173", credentials: true}));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// remove in production
app.use(morgan("dev"));

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://3861-103-203-92-101.ngrok-free.app/api/v1/auth/google/callback"
}, googleSignup));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use("/api/v1", appRouter);

app.get("/", (req, res) => {
    res.send("Welcome To CrisisCompass");
})

export default app;