// controllers/searchController.ts
import { Request, Response } from "express";
import Doc from "../models/doc";

export const simpleSearch = async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query || typeof query !== "string") return res.status(400).json({ message: "Query required" });

  try {
    const results = await Doc.find({ $text: { $search: query } }).limit(20);
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};
