// controllers/doc.ts
import { Request, Response } from "express";
import Doc, { IDoc } from "../models/doc"; // make sure IDoc is your interface
import { summarizeText, generateTags } from "../util/geminiClient";

// Create doc
export const createDoc = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const createdBy = req.user?._id;

    // Call Gemini AI
    const summary = await summarizeText(content);
    const tags = await generateTags(content);

    const doc = await Doc.create({ title, content, createdBy, summary, tags });
    res.status(201).json({ message: "Doc created", doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Get docs
export const getDocs = async (req: Request, res: Response) => {
  try {
    let docs;
    if (req.user?.role === "admin") {
      docs = await Doc.find().populate("createdBy", "name email");
    } else {
      docs = await Doc.find({ createdBy: req.user?._id });
    }
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update doc
export const updateDoc = async (req: Request, res: Response) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    if (req.user?.role !== "admin" && doc.createdBy.toString() !== req.user?._id)
      return res.status(403).json({ message: "Access denied" });

    // Save version
    doc.versions = doc.versions || [];
    doc.versions.push({ content: doc.content, updatedAt: new Date() });

    // Update content/title
    doc.title = req.body.title || doc.title;
    doc.content = req.body.content || doc.content;

    // Optionally update summary/tags
    if (req.body.content) {
      doc.summary = await summarizeText(doc.content);
      doc.tags = await generateTags(doc.content);
    }

    await doc.save();
    res.json({ message: "Doc updated", doc });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete doc
export const deleteDoc = async (req: Request, res: Response) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    if (req.user?.role !== "admin" && doc.createdBy.toString() !== req.user?._id)
      return res.status(403).json({ message: "Access denied" });

    await doc.deleteOne(); // works fine with proper types
    res.json({ message: "Doc deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// controller/docController.ts
export const handleQuestion = async (req:Request, res:Response) => {
  const { id } = req.params;
  const { question } = req.body;

  const doc = await Doc.findById(id);
  if (!doc) return res.status(404).json({ message: "Doc not found" });

  // For now, dummy answer
  const answer = `You asked: "${question}". This is a dummy answer.`;

  res.json({ answer });
};
