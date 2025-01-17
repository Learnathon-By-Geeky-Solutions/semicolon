import { Router } from "express";
import authenticationRouter from "./authenticationRoutes.js";

const appRouter = Router();
appRouter.use("/auth", authenticationRouter);


export default appRouter;