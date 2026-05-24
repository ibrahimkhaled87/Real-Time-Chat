import { Router } from "express";
import { getTeams, postTeamMember, getTeamMessages, postTeamMessage, getTeamBoards, 
    getTeamKanban, postTeamKanban, patchTeamKanban, deleteTeamKanban} from "../controllers/teamController.js";

const router = Router();

router.get("/", getTeams);

router.get("/messages", getTeamMessages);
router.post("/messages", postTeamMessage);

router.post("/members", postTeamMember);

router.get("/boards", getTeamBoards);

router.get("/kanban/:id", getTeamKanban);
router.post("/kanban/:id", postTeamKanban);
router.patch("/kanban/:id", patchTeamKanban);
router.delete("/kanban/:id", deleteTeamKanban);



export default router;