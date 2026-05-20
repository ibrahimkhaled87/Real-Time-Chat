import { Router } from "express";
import { getKanban, postKanban, deleteKanban, patchKanban } from "../controllers/kanbanController.js";

const router = Router();

router.get("/", getKanban);
router.post("/", postKanban);
router.patch("/", patchKanban);
router.delete("/", deleteKanban);

export default router;
