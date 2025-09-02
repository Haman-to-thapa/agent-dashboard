import { Request, Response } from "express";
import Doc from "../models/doc";
import {summarizeText, generateTags, answerQuestion} from '../util/geminiClient'
// Generate summary for a doc
export const summarizeDoc = async (req: Request, res: Response) => {
  try {
    const { docId } = req.params;
    const doc = await Doc.findById(docId);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    const summary = await summarizeText(doc.content);
    doc.summary = summary;
    await doc.save();

    res.json({ message: "Summary generated", summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Generate tags for a doc
export const generateDocTags = async (req: Request, res: Response) => {
  try {
    const { docId } = req.params;
    const doc = await Doc.findById(docId);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    const tags = await generateTags(doc.content);
    doc.tags = tags;
    await doc.save();

    res.json({ message: "Tags generated", tags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Team Q&A - ask a question about a doc
export const askDocQuestion = async (req: Request, res: Response) => {
  try {
    const { docId } = req.params;
    const { question } = req.body;

    const doc = await Doc.findById(docId);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    const answer = await answerQuestion(doc.content, question);

    res.json({ question, answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
