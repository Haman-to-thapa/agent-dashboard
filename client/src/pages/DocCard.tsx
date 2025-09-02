// src/pages/DocCard.tsx
import { useState } from "react";

interface Doc {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  createdBy?: { name: string; email: string };
}

interface Props {
  doc: Doc;
  onAskQuestion: (id: string, question: string) => void;
}

export default function DocCard({ doc, onAskQuestion }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = () => {
    if (!question) return alert("Enter a question");
    onAskQuestion(doc._id, question);
    setAnswer("Loading answer...");
  };

  return (
    <div className="border p-4 mb-4 rounded shadow">
      <h2 className="font-semibold">{doc.title}</h2>
      <p className="text-sm text-gray-600">
        Author: {doc.createdBy?.name} ({doc.createdBy?.email})
      </p>
      <p className="mt-2">Summary: {doc.summary || "No summary yet"}</p>
      <p className="mt-2">Tags: {doc.tags?.join(", ") || "No tags yet"}</p>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about this doc..."
          className="border p-2 rounded w-2/3"
        />
        <button
          onClick={handleAsk}
          className="px-3 py-1 bg-purple-500 text-white rounded"
        >
          Ask
        </button>
      </div>

      {answer && <p className="mt-2 text-gray-700"><strong>Answer:</strong> {answer}</p>}
    </div>
  );
}
