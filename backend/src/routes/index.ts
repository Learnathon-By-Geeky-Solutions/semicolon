import { Router } from "express";
import authenticationRouter from "./authenticationRoutes.js";
import userRouter from "./userRoutes.js";
import adminRouter from "./adminRoutes.js";
import authorityRouter from "./authorityRoutes.js";
import volunteerRouter from "./volunteerRoutes.js";
import { verifyToken } from "../middlewares/authenticationMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";

const appRouter = Router();

appRouter.use("/auth", authenticationRouter);

appRouter.use("/admin", verifyToken, authorizeRole("admin"), adminRouter);
appRouter.use("/authority", verifyToken, authorizeRole("admin", "authority"), authorityRouter);
appRouter.use("/volunteer", verifyToken, authorizeRole("admin","authority", "volunteer"), volunteerRouter);
appRouter.use("/user", userRouter);

export default appRouter;