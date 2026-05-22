import { Router } from "express";
import { getMessages, patchMessageSeen, postMessage } from "../controllers/messageController.js";

const router = Router();

router.get("/", getMessages);
router.post("/", postMessage);
router.patch("/seen", patchMessageSeen);


export default router;