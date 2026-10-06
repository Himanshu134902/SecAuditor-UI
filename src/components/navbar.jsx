import React, { useState } from "react";
import axios from "axios";
import { ShieldCheck, History, X, Clock, ExternalLink, Loader2 } from "lucide-react";

export default function Navbar({ onSelectHistoricalScan }) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "https://secauditor.onrender.com";
      const response = await axios.get(`${API_BASE}/api/history`);
      setHistoryList(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("Unable to retrieve scan logs. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
    fetchHistory();
  };

  const gradeColors = {
    A: { color: "#00e599", bg: "rgba(0, 229, 153, 0.08)" },
    B: { color: "#0070f3", bg: "rgba(0, 112, 243, 0.08)" },
    C: { color: "#f5a623", bg: "rgba(245, 166, 35, 0.08)" },
    D: { color: "#f81ce5", bg: "rgba(248, 28, 229, 0.08)" },
    F: { color: "#ff0055", bg: "rgba(255, 0, 85, 0.08)" },
  };

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-container">
          
          <div className="navbar-brand">
            <div className="navbar-logo-box">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="navbar-title-row">
                <h1 className="navbar-title">SecAuditor</h1>
                <span className="navbar-badge">v1.0</span>
              </div>
              <p className="navbar-subtitle">Passive HTTP Header & Vulnerability Auditor</p>
            </div>
          </div>

          <button 
            type="button" 
            className="navbar-btn" 
            onClick={handleOpenHistory}
          >
            <History size={14} />
            <span>History</span>
          </button>

        </div>
      </header>

      {/* History Slide-Over Drawer */}
      {isHistoryOpen && (
        <div className="history-backdrop" onClick={() => setIsHistoryOpen(false)}>
          <aside 
            className="history-drawer" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="history-header">
              <div className="history-title-group">
                <History size={16} color="#00e599" />
                <h2 className="history-heading">Audit History</h2>
              </div>
              <button 
                type="button" 
                className="history-close-btn"
                onClick={() => setIsHistoryOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="history-body">
              {loading && (
                <div className="history-status">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Loading recent audits...</span>
                </div>
              )}

              {error && (
                <div className="history-status error-text">
                  <span>{error}</span>
                </div>
              )}

              {!loading && !error && historyList.length === 0 && (
                <div className="history-status">
                  <span>No scans logged yet. Audit a website to populate history.</span>
                </div>
              )}

              {!loading && !error && historyList.length > 0 && (
                <div className="history-list">
                  {historyList.map((item) => {
                    const gradeStyle = gradeColors[item.grade] || gradeColors.F;
                    return (
                      <div 
                        key={item._id || item.testedUrl} 
                        className="history-item"
                        onClick={() => {
                          if (onSelectHistoricalScan) {
                            onSelectHistoricalScan(item);
                          }
                          setIsHistoryOpen(false);
                        }}
                      >
                        <div className="history-item-left">
                          <span 
                            className="history-grade-badge" 
                            style={{ 
                              color: gradeStyle.color, 
                              backgroundColor: gradeStyle.bg,
                              borderColor: gradeStyle.color
                            }}
                          >
                            {item.grade}
                          </span>
                          <div className="history-item-meta">
                            <span className="history-url">{item.testedUrl}</span>
                            <span className="history-date">
                              <Clock size={11} />
                              {new Date(item.scannedAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="history-item-right">
                          <span className="history-score">{item.score}/100</span>
                          <ExternalLink size={13} className="history-link-icon" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}