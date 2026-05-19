import { Router } from "express";
import { getConnections } from "../controllers/connectionController.js";

const router = Router();

router.get("/", getConnections);


export default router;