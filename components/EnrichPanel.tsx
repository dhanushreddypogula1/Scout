"use client";
import { useState } from "react";
import { Company, EnrichResult } from "@/types";

interface Props {
  company: Company;
  cached: EnrichResult | null;
  onCached: (r: EnrichResult) => void;
}

export default function EnrichPanel({ company, cached, onCached }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function runEnrich() {
    setStatus("loading");
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: company.id }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: EnrichResult = await res.json();
      onCached(data);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  if (!cached && status === "idle") {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 14 }}>
          Pull live intelligence from public web pages
        </div>
        <button className="btn btn-enrich" onClick={runEnrich}>⚡ Run Enrichment</button>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="enrich-loading">
        <div className="enrich-spinner" />
        <div className="enrich-status">Fetching {company.domain}…</div>
        <div className="enrich-status" style={{ marginTop: 4 }}>Extracting signals…</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <div style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>⚠ Enrichment failed</div>
        <button className="btn btn-outline" onClick={runEnrich}>Retry</button>
      </div>
    );
  }

  const d = cached!;
  return (
    <div className="enrich-result">
      <div className="enrich-summary">{d.summary}</div>

      <div className="enrich-section">
        <div className="enrich-section-title">What they do</div>
        <div className="enrich-bullets">
          {d.whatTheyDo?.map((b, i) => <div key={i} className="enrich-bullet">{b}</div>)}
        </div>
      </div>

      <div className="enrich-section">
        <div className="enrich-section-title">Keywords</div>
        <div className="keyword-chips">
          {d.keywords?.map((k, i) => <span key={i} className="keyword-chip">{k}</span>)}
        </div>
      </div>

      <div className="enrich-section">
        <div className="enrich-section-title">Derived Signals</div>
        <div className="signal-chips">
          {d.signals?.map((s, i) => <div key={i} className="signal-chip">{s}</div>)}
        </div>
      </div>

      <div className="enrich-section">
        <div className="enrich-section-title">Sources</div>
        <div className="source-list">
          {d.sources?.map((s, i) => (
            <div key={i} className="source-item">
              <span>↗</span>
              <a href={s.url.startsWith("http") ? s.url : `https://${company.domain}`}
                className="source-url" target="_blank" rel="noreferrer">{s.url}</a>
              <span className="source-ts">· {s.note}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 8 }}>
          Fetched {d.fetchedAt ? new Date(d.fetchedAt).toLocaleString() : "—"}
        </div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
        <button className="btn btn-ghost" style={{ fontSize: 10 }} onClick={runEnrich}>↻ Re-enrich</button>
      </div>
    </div>
  );
}
