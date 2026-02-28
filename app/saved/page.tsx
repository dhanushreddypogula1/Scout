"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { SECTORS, STAGES } from "@/lib/data";
import { SavedSearch } from "@/types";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import styles from "../companies/shell.module.css";

export default function SavedPage() {
  const router = useRouter();
  const [searches, setSearches] = useLocalStorage<SavedSearch[]>("vc_saved", []);
  const [name, setName] = useState("");
  const [sector, setSector] = useState("AI Infrastructure");
  const [stage, setStage] = useState("Seed");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  function save() {
    if (!name.trim()) return;
    const s: SavedSearch = {
      id: Date.now().toString(),
      name: name.trim(),
      filters: { sector, stage, query },
      createdAt: new Date().toISOString(),
      runCount: 0,
    };
    setSearches(prev => [...prev, s]);
    setName("");
    showToast("Search saved");
  }

  function runSearch(s: SavedSearch) {
    setSearches(prev => prev.map(ss => ss.id === s.id ? { ...ss, runCount: ss.runCount + 1, lastRun: new Date().toISOString() } : ss));
    const qs = new URLSearchParams();
    if (s.filters.query) qs.set("q", s.filters.query);
    router.push(`/companies?${qs.toString()}`);
  }

  function deleteSearch(id: string) {
    setSearches(prev => prev.filter(s => s.id !== id));
    showToast("Search deleted");
  }

  return (
    <div className={styles.app}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <div className={styles.content}>
          <div className="page-header">
            <div className="page-title">Saved Searches</div>
            <div className="page-sub">Re-run your thesis filters instantly</div>
          </div>

          <div className="card" style={{ marginBottom: 24, maxWidth: 520 }}>
            <div className="card-header"><div className="card-title">Save a New Search</div></div>
            <div className="card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div className="label">Search Name</div>
                  <input className="input" placeholder="e.g. AI Infra Seed Pipeline" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div className="label">Sector</div>
                    <select className="filter-select" style={{ width: "100%" }} value={sector} onChange={e => setSector(e.target.value)}>
                      {SECTORS.filter(s => s !== "All").map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="label">Stage</div>
                    <select className="filter-select" style={{ width: "100%" }} value={stage} onChange={e => setStage(e.target.value)}>
                      {STAGES.filter(s => s !== "All").map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="label">Keyword (optional)</div>
                  <input className="input" placeholder="e.g. MLOps" value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={save}>Save Search</button>
              </div>
            </div>
          </div>

          {searches.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">⊘</div><div className="empty-text">No saved searches yet</div></div>
          ) : (
            <div className="saved-grid">
              {searches.map(s => (
                <div key={s.id} className="saved-card">
                  <div className="saved-card-name">{s.name}</div>
                  <div className="saved-filters">
                    {Object.entries(s.filters).filter(([, v]) => v).map(([k, v]) => (
                      <span key={k} className="saved-filter-tag">{k}: {v}</span>
                    ))}
                  </div>
                  <div className="saved-meta">
                    Saved {new Date(s.createdAt).toLocaleDateString()} · {s.runCount} runs
                    {s.lastRun && ` · Last: ${new Date(s.lastRun).toLocaleDateString()}`}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => runSearch(s)}>▶ Run</button>
                    <button className="btn btn-ghost" style={{ color: "var(--red)" }} onClick={() => deleteSearch(s.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
