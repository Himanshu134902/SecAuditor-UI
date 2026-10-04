import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function RemediationTabs({ fixes }) {
  const [activeTab, setActiveTab] = useState(fixes.express ? "express" : "nginx");
  const [copied, setCopied] = useState(false);

  if (!fixes) return null;

  const currentCode = fixes[activeTab] || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="remediation-box">
      <div className="remediation-controls">
        <div className="tab-group">
          {fixes.express && (
            <button
              type="button"
              onClick={() => setActiveTab("express")}
              className={`tab-btn ${activeTab === "express" ? "tab-btn-active" : ""}`}
            >
              Express.js
            </button>
          )}
          {fixes.nginx && (
            <button
              type="button"
              onClick={() => setActiveTab("nginx")}
              className={`tab-btn ${activeTab === "nginx" ? "tab-btn-active" : ""}`}
            >
              Nginx
            </button>
          )}
        </div>

        <button type="button" onClick={handleCopy} className="copy-btn">
          {copied ? (
            <>
              <Check size={12} color="var(--status-pass)" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="code-snippet">
        <code>{currentCode}</code>
      </pre>
    </div>
  );
}