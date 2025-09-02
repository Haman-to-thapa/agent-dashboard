// routes/docs.ts
import { Router } from "express";
import { createDoc, getDocs, updateDoc, deleteDoc, handleQuestion } from "../controller/docController"
import authMiddleware from "../middleware/auth";

const router = Router();

// routes/docs.ts
router.post("/", authMiddleware, createDoc);
router.get("/", authMiddleware, getDocs);
router.patch("/:id", authMiddleware, updateDoc);
router.delete("/:id", authMiddleware, deleteDoc);
// routes/docs.ts
router.post("/:id/question", authMiddleware, handleQuestion);


export default router;
