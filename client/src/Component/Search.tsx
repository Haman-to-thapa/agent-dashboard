import { useState } from "react";
import API from "../api/docUserApi/api";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await API.get(`/search?query=${query}`);
      setResults(res.data.results);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Docs</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="Search..."
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-teal-500 text-white rounded"
        >
          Search
        </button>
      </div>

      {results.length === 0 && <p>No results found.</p>}
      {results.map((doc: any) => (
        <div key={doc._id} className="border p-4 rounded shadow mb-4">
          <h2 className="font-semibold">{doc.title}</h2>
          <p>{doc.summary || doc.content.slice(0, 100) + "..."}</p>
        </div>
      ))}
    </div>
  );
}

