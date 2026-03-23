import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profilesRouter from "./profiles";
import logsRouter from "./logs";
import achievementsRouter from "./achievements";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profilesRouter);
router.use(logsRouter);
router.use(achievementsRouter);

export default router;
