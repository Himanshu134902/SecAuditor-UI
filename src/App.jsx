import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/navbar.jsx";
import UrlInputBar from "./components/UrlInputBar.jsx";
import ScoreCard from "./components/ScoreCard.jsx";
import FindingCard from "./components/FindingCard.jsx";
import { Shield, AlertCircle, Download } from "lucide-react";

export default function App() {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Scan handler that calls your backend
  const handleScan = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || "https://secauditor.onrender.com";
const response = await axios.post(`${API_BASE}/api/scan`, { url });
      setScanResult(response.data);
    } catch (err) {
      console.error("Audit failed:", err);
      setError(
        err.response?.data?.details || 
        err.response?.data?.error || 
        "Failed to scan target. Ensure the server is running and the domain is reachable."
      );
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Client-side report generation & file download
  const handleExportReport = () => {
    if (!scanResult) return;

    let targetHost = "audit";
    try {
      targetHost = new URL(scanResult.testedUrl).hostname;
    } catch {
      targetHost = "target";
    }

    const content = `# SecAuditor Assessment Report
Target: ${scanResult.testedUrl}
Timestamp: ${new Date(scanResult.scannedAt).toUTCString()}
Security Score: ${scanResult.score}/100 (Grade:${scanResult.grade})

## Audit Findings
${scanResult.findings
  .map(
    (f) => `### [${f.status}] ${f.name}
- Category: ${f.category}
- Severity: ${f.severity}
- Details: ${f.message}
- Observed Value: \`${f.currentValue || "None"}\`
${
  f.remediation
    ? `- Express Fix: \`${f.remediation.express || "N/A"}\`\n- Nginx Fix: \`${f.remediation.nginx || "N/A"}\``
    : "- State: Hardened"
}`
  )
  .join("\n\n")}
`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-${targetHost}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      {/* Navbar with historical scan selection support */}
      <Navbar onSelectHistoricalScan={(pastScan) => setScanResult(pastScan)} />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pill">
            <Shield size={12} color="#00e599" />
            <span>Passive Security Engine</span>
          </div>
          <h1 className="hero-title">Audit. Remediate. Harden.</h1>
          <p className="hero-desc">
            Evaluate HTTP headers, prevent data injection attacks, and generate copy-paste defense patches in seconds.
          </p>
        </section>

        {/* Search Bar */}
        <UrlInputBar onScan={handleScan} isLoading={loading} />

        {/* Error Alert */}
        {error && (
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.85rem 1rem",
              background: "rgba(255, 0, 85, 0.08)",
              border: "1px solid rgba(255, 0, 85, 0.3)",
              borderRadius: "8px",
              color: "#ff0055",
              fontSize: "0.825rem",
              fontFamily: "Geist Mono, monospace"
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Audit Results View */}
        {scanResult && (
          <>
            <ScoreCard
              testedUrl={scanResult.testedUrl}
              score={scanResult.score}
              grade={scanResult.grade}
              findings={scanResult.findings}
            />

            <div>
              {/* Header row with Title and Export Button */}
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "0.5rem"
                }}
              >
                <h3 className="section-title">Security Posture Breakdown</h3>
                
                <button 
                  type="button" 
                  className="navbar-btn"
                  onClick={handleExportReport}
                  style={{ cursor: "pointer" }}
                >
                  <Download size={13} />
                  <span>Export Report (.md)</span>
                </button>
              </div>

              {/* Finding Cards */}
              <div className="findings-list">
                {scanResult.findings.map((finding) => (
                  <FindingCard key={finding.ruleId} finding={finding} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}