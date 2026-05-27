import { Router } from "express";
import { getTeams, postTeamMember, getTeamMessages, postTeamMessage, getTeamBoards, 
    getTeamKanban, postTeamKanban, patchTeamKanban, deleteTeamKanban,
    postTeam, postTeamBoard, deleteTeamBoard} 
    from "../controllers/teamController.js";

const router = Router();

router.get("/", getTeams);
router.post("/", postTeam);

router.get("/messages", getTeamMessages);
router.post("/messages", postTeamMessage);

router.post("/members", postTeamMember);

router.get("/boards", getTeamBoards);
router.post("/boards", postTeamBoard);
router.delete("/boards/:id", deleteTeamBoard);

router.get("/kanban/:id", getTeamKanban);
router.post("/kanban/:id", postTeamKanban);
router.patch("/kanban/:id", patchTeamKanban);
router.delete("/kanban/:id", deleteTeamKanban);



export default router;