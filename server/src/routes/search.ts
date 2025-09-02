// routes/search.ts
import express from "express";
import { simpleSearch } from "../controller/search.controller"; 
import authMiddleware from "../middleware/auth";

const router = express.Router();
router.get("/search",authMiddleware, simpleSearch);
export default router;
