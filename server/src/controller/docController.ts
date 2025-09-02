import { Request, Response } from "express";
import Doc from "../models/doc";
import { summarizeText, generateTags } from "../util/geminiClient";

// Get all docs
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

// Create a new doc
export const createDoc = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const createdBy = req.user?._id;

    const summary = await summarizeText(content);
    const tags = await generateTags(content);

    const doc = await Doc.create({ title, content, createdBy, summary, tags });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update doc (summary / tags / content)
export const updateDoc = async (req: Request, res: Response) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    // Save previous version
    doc.versions = doc.versions || [];
    doc.versions.push({ content: doc.content, updatedAt: new Date() });

    // Update content/title
    if (req.body.title) doc.title = req.body.title;
    if (req.body.content) doc.content = req.body.content;

    // Generate summary if requested
    if (req.body.generateSummary) doc.summary = await summarizeText(doc.content);

    // Generate tags if requested
    if (req.body.generateTags) doc.tags = await generateTags(doc.content);

    await doc.save();
    res.json({ doc });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete doc
export const deleteDoc = async (req: Request, res: Response) => {
  try {
    const doc = await Doc.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Doc not found" });

    await doc.deleteOne();
    res.json({ message: "Doc deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Ask a question
export const handleQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { question } = req.body;

  const doc = await Doc.findById(id);
  if (!doc) return res.status(404).json({ message: "Doc not found" });

  // Dummy AI answer (replace with real Gemini call)
  const answer = `You asked: "${question}". This is a dummy answer.`;

  res.json({ answer });
};
