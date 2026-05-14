import { useEffect, useState } from "react";
import api from "../api/client";
import "./Search.css";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const onSearch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onSearch();
  }, []);

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <h1 className="search-title">Search Colleges</h1>
        <p className="search-subtitle">Find your perfect college by searching for name, city, state, or stream</p>
        
        <div className="search-box">
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && onSearch()}
            placeholder="Search by name, city, state, stream..."
            className="search-input"
          />
          <button onClick={onSearch} disabled={loading} className="btn btn-primary search-btn">
            {loading ? (
              <span className="loading-spinner">⟳</span>
            ) : (
              "Search"
            )}
          </button>
        </div>

        <div className="results-section">
          {results.length > 0 ? (
            <div>
              <p className="results-count">Found <strong>{results.length}</strong> college{results.length !== 1 ? 's' : ''}</p>
              <ul className="colleges-list">
                {results.map(r => (
                  <li key={r.id} className="college-card">
                    <div className="college-header">
                      <h3 className="college-name">{r.name}</h3>
                    </div>
                    <div className="college-details">
                      <span className="detail-item">
                        <span className="detail-label">📍 Location:</span>
                        <span className="detail-value">{r.city}, {r.state}</span>
                      </span>
                      <span className="detail-item">
                        <span className="detail-label">📚 Stream:</span>
                        <span className="detail-value">{r.stream || "N/A"}</span>
                      </span>
                      <span className="detail-item">
                        <span className="detail-label">🎯 Cutoff:</span>
                        <span className="detail-value">{r.avgCutoff || "N/A"}</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-message">🔍 No colleges found. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
