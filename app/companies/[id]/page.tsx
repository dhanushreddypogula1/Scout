"use client";
import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_COMPANIES, MOCK_SIGNALS } from "@/lib/data";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { Badge, ScoreBar, CompanyAvatar, Tag, Btn, scoreColor } from "@/components/ui";
import EnrichPanel from "@/components/EnrichPanel";
import { EnrichResult, SavedList } from "@/types";

export default function CompanyProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const company = MOCK_COMPANIES.find(c => c.id === id);
  if (!company) notFound();

  const signals = MOCK_SIGNALS[id] || [];
  const [lists, setLists] = useLocalStorage<SavedList[]>("vc_lists", []);
  const [notes, setNotes] = useLocalStorage<Record<string, string>>("vc_notes", {});
  const [enrichCache, setEnrichCache] = useLocalStorage<Record<string, EnrichResult>>("vc_enrich", {});
  const [localNote, setLocalNote] = useState(notes[id] || "");
  const [noteSaved, setNoteSaved] = useState(!!notes[id]);

  function saveNote() {
    setNotes(n => ({ ...n, [id]: localNote }));
    setNoteSaved(true);
  }

  function addToList(listId: string) {
    setLists(prev => prev.map(l =>
      l.id === listId ? { ...l, companies: [...new Set([...l.companies, id])] } : l
    ));
  }

  const isSaved = lists.some(l => l.companies.includes(id));

  const signalTypeColor: Record<string, string> = {
    funding: "#34d399", hiring: "#60a5fa", product: "#a78bfa",
    press: "#fbbf24", partnership: "#34d399",
  };

  return (
    <div>
      <Link href="/companies" className="back-btn">← Back to companies</Link>

      {/* Hero */}
      <div className="profile-hero">
        <CompanyAvatar company={company} size={52} />
        <div className="profile-meta">
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div className="profile-name">{company.name}</div>
            <Badge text={company.stage} stage={company.stage} />
            <span style={{ fontSize: 11, color: "var(--text3)" }}>{company.sector}</span>
          </div>
          <div className="profile-desc">{company.description}</div>
          <div className="profile-attrs">
            <div className="profile-attr"><strong>{company.location}</strong></div>
            <div className="profile-attr">Founded <strong>{company.founded}</strong></div>
            <div className="profile-attr"><strong>{company.employees}</strong> employees</div>
            <div className="profile-attr">Raised <strong>{company.raised}</strong></div>
            <div className="profile-attr">Score <strong style={{ color: scoreColor(company.score) }}>{company.score}</strong></div>
          </div>
          <div className="tag-list" style={{ marginTop: 8 }}>
            {company.tags.map(t => <Tag key={t} text={t} />)}
          </div>
        </div>
        <div className="profile-actions">
          <Btn href={`https://${company.domain}`} variant="outline">↗ Website</Btn>
          {isSaved && <Btn variant="saved" disabled>✓ Saved</Btn>}
        </div>
      </div>

      <div className="profile-grid">
        {/* Left column */}
        <div>
          {/* Signals */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-title">Signal Timeline</div>
              <span style={{ fontSize: 10, color: "var(--text3)" }}>{signals.length} events</span>
            </div>
            <div className="card-body">
              {signals.length ? signals.map((s, i) => (
                <div key={i} className="signal-item">
                  <div className="signal-dot" style={{ background: signalTypeColor[s.type] || "#888", marginTop: 5 }} />
                  <div>
                    <div className="signal-text">{s.text}</div>
                    <div className="signal-type-badge">{s.type}</div>
                    <div className="signal-date">{s.date}</div>
                  </div>
                </div>
              )) : (
                <div className="empty-state"><div className="empty-text">No signals yet</div></div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Notes</div>
              <button className="btn btn-ghost" style={{ fontSize: 10, padding: "4px 8px" }} onClick={saveNote}>Save</button>
            </div>
            <div className="card-body">
              <textarea
                className="notes-area"
                placeholder="Add a note about this company…"
                value={localNote}
                onChange={e => { setLocalNote(e.target.value); setNoteSaved(false); }}
              />
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 6 }}>
                {noteSaved ? "✓ Saved" : "Unsaved changes"}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Enrichment */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">⚡ Live Enrichment</div>
              {enrichCache[id] && <span style={{ fontSize: 9, color: "var(--green)" }}>● Cached</span>}
            </div>
            <div className="card-body">
              <EnrichPanel
                company={company}
                cached={enrichCache[id] || null}
                onCached={r => setEnrichCache(c => ({ ...c, [id]: r }))}
              />
            </div>
          </div>

          {/* Save to list */}
          <div className="card">
            <div className="card-header"><div className="card-title">Save to List</div></div>
            <div className="card-body">
              {lists.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {lists.map(l => (
                    <button
                      key={l.id}
                      className="btn btn-outline"
                      style={{ justifyContent: "space-between", display: "flex" }}
                      onClick={() => addToList(l.id)}
                    >
                      <span>{l.name}</span>
                      <span style={{ fontSize: 10, color: "var(--text3)" }}>{l.companies.length}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 11, color: "var(--text3)" }}>
                  Create a list first in <Link href="/lists" style={{ color: "var(--accent2)" }}>/lists</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
