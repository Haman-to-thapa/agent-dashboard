import { useEffect, useState } from "react";
import API from "../api/docApi/acios";

interface Doc {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  createdBy?: { name: string; email: string };
}

export default function AdminDashboard() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<{ [id: string]: boolean }>({});
  const [globalLoading, setGlobalLoading] = useState(false);
  const [questions, setQuestions] = useState<{ [id: string]: string }>({});
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const token = localStorage.getItem("token");

  const fetchDocs = async () => {
    if (!token) return;
    setGlobalLoading(true);
    try {
      const res = await API.get<Doc[]>("/ai", { headers: { Authorization: `Bearer ${token}` } });
      setDocs(res.data);
    } catch (err) { console.error(err); }
    finally { setGlobalLoading(false); }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleCreateDoc = async () => {
    if (!newTitle || !newContent) return alert("Enter title and content");
    if (!token) return;

    setGlobalLoading(true);
    try {
      const res = await API.post("/ai", { title: newTitle, content: newContent }, { headers: { Authorization: `Bearer ${token}` } });
      setDocs([res.data, ...docs]);
      setNewTitle(""); setNewContent("");
    } catch (err) { console.error(err); }
    finally { setGlobalLoading(false); }
  };

  const handleUpdateDoc = async (id: string, type: "summary" | "tags") => {
    if (!token) return;
    setLoadingDocs(prev => ({ ...prev, [id]: true }));
    try {
      const body = type === "summary" ? { generateSummary: true } : { generateTags: true };
      const res = await API.patch(`/ai/${id}`, body, { headers: { Authorization: `Bearer ${token}` } });
      setDocs(prev => prev.map(doc => doc._id === id ? res.data.doc : doc));
    } catch (err) { console.error(err); }
    finally { setLoadingDocs(prev => ({ ...prev, [id]: false })); }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm("Delete this doc?")) return;
    setLoadingDocs(prev => ({ ...prev, [id]: true }));
    try {
      await API.delete(`/ai/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setDocs(prev => prev.filter(doc => doc._id !== id));
    } catch (err) { console.error(err); }
    finally { setLoadingDocs(prev => ({ ...prev, [id]: false })); }
  };

  const handleAskQuestion = async (id: string) => {
    if (!token) return;
    const question = questions[id]; if (!question) return alert("Enter a question");
    setLoadingDocs(prev => ({ ...prev, [id]: true }));
    try {
      const res = await API.post(`/ai/${id}/question`, { question }, { headers: { Authorization: `Bearer ${token}` } });
      setAnswers(prev => ({ ...prev, [id]: res.data.answer }));
      setQuestions(prev => ({ ...prev, [id]: "" }));
    } catch (err) { console.error(err); }
    finally { setLoadingDocs(prev => ({ ...prev, [id]: false })); }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-teal-700">Admin Dashboard</h1>

      {/* Create Doc Form */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Doc</h2>
        <input
          className="w-full mb-3 p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="Title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <textarea
          className="w-full mb-3 p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="Content"
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
        />
        <button
          onClick={handleCreateDoc}
          disabled={globalLoading}
          className="px-5 py-2 bg-teal-500 text-white font-semibold rounded hover:bg-teal-600 transition"
        >
          {globalLoading ? "Creating..." : "Create Doc"}
        </button>
      </div>

      {/* Docs List */}
      <div className="grid md:grid-cols-2 gap-6">
        {docs.map(doc => (
          <div key={doc._id} className="bg-white rounded-lg shadow p-5 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800">{doc.title}</h3>
            <p className="text-sm text-gray-500">Author: {doc.createdBy?.name || "Admin"} ({doc.createdBy?.email || "admin@example.com"})</p>
            <p className="mt-2 text-gray-700"><strong>Summary:</strong> {doc.summary || "No summary yet"}</p>
            <p className="mt-1 text-gray-700"><strong>Tags:</strong> {doc.tags?.join(", ") || "No tags yet"}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleUpdateDoc(doc._id, "summary")}
                disabled={loadingDocs[doc._id]}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {loadingDocs[doc._id] ? "Loading..." : "Summarize"}
              </button>
              <button
                onClick={() => handleUpdateDoc(doc._id, "tags")}
                disabled={loadingDocs[doc._id]}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
              >
                {loadingDocs[doc._id] ? "Loading..." : "Generate Tags"}
              </button>
              <button
                onClick={() => handleDelete(doc._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>

            {/* Ask Question */}
            <div className="mt-4 flex gap-2 items-center">
              <input
                value={questions[doc._id] || ""}
                onChange={e => setQuestions(prev => ({ ...prev, [doc._id]: e.target.value }))}
                placeholder="Ask question..."
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={() => handleAskQuestion(doc._id)}
                disabled={loadingDocs[doc._id]}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
              >
                Ask
              </button>
            </div>

            {answers[doc._id] && (
              <p className="mt-2 text-gray-700"><strong>Answer:</strong> {answers[doc._id]}</p>
            )}
          </div>
        ))}
      </div>

      {docs.length === 0 && !globalLoading && <p className="mt-6 text-gray-500">No docs found.</p>}
    </div>
  );
}
