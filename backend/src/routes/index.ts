import { Router } from "express";
import authenticationRouter from "./authenticationRoutes.js";
import userRouter from "./userRoutes.js";
import adminRouter from "./adminRoutes.js";
import authorityRouter from "./authorityRoutes.js";
import volunteerRouter from "./volunteerRoutes.js";
import { verifyToken } from "../middlewares/authenticationMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import shelterRouter from "./shelterRoutes.js";
import districtRouter from "./districtRoutes.js";
import shelterReviewRouter from "./shelterReviewRoutes.js";

const appRouter = Router();

appRouter.use("/auth", authenticationRouter);

appRouter.use("/admin", verifyToken, authorizeRole("admin"), adminRouter);
appRouter.use(
  "/authority",
  verifyToken,
  authorizeRole("admin", "authority"),
  authorityRouter,
);
appRouter.use(
  "/volunteer",
  verifyToken,
  authorizeRole("admin", "authority", "volunteer"),
  volunteerRouter,
);

appRouter.use("/user", userRouter);
//=======
//appRouter.use("/user", verifyToken, authorizeRole("admin","authority", "volunteer", "user"), userRouter);
appRouter.use("/shelters", shelterRouter);
appRouter.use("/district", districtRouter);
//>>>>>>> origin/dev

appRouter.use("/shelterReviews", shelterReviewRouter);


export default appRouter;
