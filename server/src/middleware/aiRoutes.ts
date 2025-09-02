import { Router } from "express";

import authMiddleware from "./auth";
import { summarizeDoc,generateDocTags,askDocQuestion } from "../controller/aiController";

const router = Router();

router.post("/summarize/:docId", authMiddleware, summarizeDoc);
router.post("/tags/:docId", authMiddleware, generateDocTags);
router.post("/qa/:docId", authMiddleware, askDocQuestion);

export default router;
