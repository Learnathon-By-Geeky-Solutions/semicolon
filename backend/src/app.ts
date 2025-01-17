import express from "express";
import { config } from "dotenv";
import morgan from 'morgan'
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

config()

const app = express();

app.use(cors({origin:process.env.FRONTEND_ORIGIN, credentials: true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// remove in production
app.use(morgan("dev"));


app.use("/api/v1", appRouter);

app.get("/", (req, res) => {
    res.send("Welcome To CrisisCompass");
})

export default app;