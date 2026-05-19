import { Router } from "express";
import { getMessages, postMessage } from "../controllers/messageController.js";

const router = Router();

router.get("/", getMessages);
router.post("/", postMessage);


export default router;