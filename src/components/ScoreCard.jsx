import React from "react";
import { CheckCircle2, AlertOctagon } from "lucide-react";

export default function ScoreCard({ testedUrl, score, grade, findings = [] }) {
  const gradeColorMap = {
    A: { color: "var(--status-pass)", bg: "var(--status-pass-bg)" },
    B: { color: "#0070f3", bg: "rgba(0, 112, 243, 0.08)" },
    C: { color: "var(--status-warn)", bg: "var(--status-warn-bg)" },
    D: { color: "#f81ce5", bg: "rgba(248, 28, 229, 0.08)" },
    F: { color: "var(--status-fail)", bg: "var(--status-fail-bg)" },
  };

  const currentTheme = gradeColorMap[grade] || gradeColorMap.F;
  const passCount = findings.filter((f) => f.status === "PASS").length;
  const issueCount = findings.filter((f) => f.status !== "PASS").length;

  return (
    <div className="score-card">
      <div className="score-meta">
        <span className="score-label">Inspection Target</span>
        <h2 className="score-domain">{testedUrl}</h2>

        <div className="score-stats">
          <span className="stat-pass">
            <CheckCircle2 size={14} />
            {passCount} Passed
          </span>
          <span className="stat-issues">
            <AlertOctagon size={14} />
            {issueCount} Action Items
          </span>
        </div>
      </div>

      <div
        className="score-circle"
        style={{
          borderColor: currentTheme.color,
          backgroundColor: currentTheme.bg,
          color: currentTheme.color,
        }}
      >
        <span className="grade-char">{grade}</span>
        <span className="grade-fraction">{score} / 100</span>
      </div>
    </div>
  );
}