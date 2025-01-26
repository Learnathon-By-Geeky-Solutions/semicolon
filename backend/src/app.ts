import express from "express";
import { config } from "dotenv";
import morgan from 'morgan'
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import passport from "passport";
import session from "express-session";

config()

const app = express();

app.use(cors({origin:"https://5cf2-103-203-92-101.ngrok-free.app", credentials: true}));

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

app.use("/api/v1", appRouter);

app.get("/", (req, res) => {
    res.send("Welcome To CrisisCompass");
})

export default app;