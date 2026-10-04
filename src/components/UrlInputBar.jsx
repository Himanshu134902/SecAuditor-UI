import React, { useState } from "react";
import { Globe, ArrowRight, Loader2 } from "lucide-react";

export default function UrlInputBar({ onScan, isLoading }) {
  const [url, setUrl] = useState("https://example.com");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onScan(url);
  };

  return (
    <div className="input-wrapper">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-field-container">
          <Globe size={16} className="input-icon" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourdomain.com"
            disabled={isLoading}
            className="input-text"
            required
          />
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Auditing</span>
            </>
          ) : (
            <>
              <span>Audit Target</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="quick-presets">
        <span>Sample targets:</span>
        <button
          type="button"
          onClick={() => setUrl("https://github.com")}
          className="preset-btn"
        >
          github.com
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => setUrl("https://httpbin.org")}
          className="preset-btn"
        >
          httpbin.org
        </button>
      </div>
    </div>
  );
}