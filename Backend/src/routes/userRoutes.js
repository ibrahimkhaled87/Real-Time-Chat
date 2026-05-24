import { Router } from "express";
import { getUsers, getUserNotifications } from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.get("/notifications", getUserNotifications);


export default router;