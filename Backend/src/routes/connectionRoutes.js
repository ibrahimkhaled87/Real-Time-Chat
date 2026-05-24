import { Router } from "express";
import { getConnections, postConnection } from "../controllers/connectionController.js";

const router = Router();

router.get("/", getConnections);
router.post("/", postConnection);


export default router;