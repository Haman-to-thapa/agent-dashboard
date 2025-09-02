// src/pages/UserDashboard.tsx
import { useEffect, useState } from "react";
import API from "../api/docUserApi/api";

interface Doc {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  createdBy?: { name: string; email: string };
  answer?: string;
}

export default function UserDashboard() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<{ [id: string]: string }>({});
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});

  // New doc form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch docs
  useEffect(() => {
    if (!token) return; // wait until token exists
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const res = await API.get<Doc[]>("/ai");
        setDocs(res.data);
      } catch (err) {
        console.error("Failed to fetch docs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [token]);

  // Create new doc
  const handleCreateDoc = async () => {
    if (!newTitle || !newContent) return alert("Enter title and content");
    try {
      setLoading(true);
      const res = await API.post("/ai", { title: newTitle, content: newContent });
      setDocs((prev) => [res.data, ...prev]);
      setNewTitle("");
      setNewContent("");
      alert("Doc created successfully ✅");
    } catch (err) {
      console.error("Create doc failed", err);
      alert("Failed to create doc ");
    } finally {
      setLoading(false);
    }
  };

  // Ask a question
  const handleAskQuestion = async (id?: string) => {
    if (!id) return alert("Doc ID missing!");
    const question = questions[id];
    if (!question) return alert("Enter a question first");

    setLoading(true);
    try {
      const res = await API.post(`/ai/${id}/question`, { question });
      setAnswers((prev) => ({ ...prev, [id]: res.data.answer }));
      setQuestions((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Q&A failed", err);
      alert("Q&A failed ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

      {loading && <p className="mb-4 text-white">Loading...</p>}

      {/* Create Doc Form */}
      <div className="mb-6 p-4 border rounded shadow bg-white/10 backdrop-blur">
        <h2 className="text-xl font-semibold text-white mb-2">Create New Doc</h2>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full p-2 mb-2 rounded text-black"
        />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full p-2 mb-2 rounded text-black"
        />
        <button
          onClick={handleCreateDoc}
          className="px-4 py-2 bg-teal-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Doc"}
        </button>
      </div>

      {/* Docs List */}
      {docs.length === 0 && !loading && <p>No docs found. Create one above!</p>}

      {docs.map((doc) => (
        <div key={doc._id} className="border p-4 mb-4 rounded shadow">
          <h2 className="font-semibold">{doc.title}</h2>
          <p className="text-sm text-gray-600">
            Author: {doc.createdBy?.name || "Admin"} ({doc.createdBy?.email || "admin@example.com"})
          </p>
          <p className="mt-2">Summary: {doc.summary || "No summary yet"}</p>
          <p className="mt-2">Tags: {doc.tags?.join(", ") || "No tags yet"}</p>

          {/* Ask Question */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={questions[doc._id] || ""}
              onChange={(e) =>
                setQuestions((prev) => ({ ...prev, [doc._id]: e.target.value }))
              }
              placeholder="Ask about this doc..."
              className="border p-2 rounded w-2/3"
            />
            <button
              onClick={() => handleAskQuestion(doc._id)}
              disabled={loading || !doc._id}
              className="px-3 py-1 bg-purple-500 text-white rounded"
            >
              Ask
            </button>
          </div>

          {answers[doc._id] && (
            <p className="mt-2 text-gray-700">
              <strong>Answer:</strong> {answers[doc._id]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
