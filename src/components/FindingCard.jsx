import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Code, ChevronDown, ChevronUp } from "lucide-react";
import RemediationTabs from "./RemediationTabs.jsx";

export default function FindingCard({ finding }) {
  const [isOpen, setIsOpen] = useState(false);

  const statusIcons = {
    PASS: <CheckCircle2 size={16} color="var(--status-pass)" />,
    WARN: <AlertTriangle size={16} color="var(--status-warn)" />,
    FAIL: <XCircle size={16} color="var(--status-fail)" />,
  };

  const badgeClass = {
    PASS: "badge-pass",
    WARN: "badge-warn",
    FAIL: "badge-fail",
  };

  return (
    <div className="finding-card">
      <div className="finding-header">
        <div className="finding-info">
          <div className="finding-icon">{statusIcons[finding.status]}</div>
          <div>
            <div className="finding-title-row">
              <h3 className="finding-title">{finding.name}</h3>
              <span className={`status-badge ${badgeClass[finding.status]}`}>
                {finding.status}
              </span>
            </div>
            <p className="finding-desc">{finding.message}</p>
            {finding.currentValue && (
              <span className="finding-current-value">
                Detected: {finding.currentValue}
              </span>
            )}
          </div>
        </div>

        {finding.remediation && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="btn-remediation"
          >
            <Code size={13} />
            <span>Fix</span>
            {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>

      {isOpen && finding.remediation && (
        <RemediationTabs fixes={finding.remediation} />
      )}
    </div>
  );
}