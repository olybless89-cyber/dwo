import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import statsRouter from "./stats";
import usersRouter from "./users";
import ordersRouter from "./orders";
import messagesRouter from "./messages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(statsRouter);
router.use(usersRouter);
router.use(ordersRouter);
router.use(messagesRouter);

export default router;
