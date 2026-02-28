"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { MOCK_COMPANIES } from "@/lib/data";
import { SavedList } from "@/types";
import { Badge, ScoreBar, CompanyAvatar } from "@/components/ui";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import styles from "../companies/shell.module.css";

export default function ListsPage() {
  const [lists, setLists] = useLocalStorage<SavedList[]>("vc_lists", []);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [toast, setToast] = useState("");

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  function createList() {
    if (!newName.trim()) return;
    const l: SavedList = { id: Date.now().toString(), name: newName.trim(), companies: [], createdAt: new Date().toISOString() };
    setLists(prev => [...prev, l]);
    setNewName("");
    setActiveListId(l.id);
    showToast(`Created "${l.name}"`);
  }

  function removeFromList(listId: string, companyId: string) {
    setLists(prev => prev.map(l => l.id === listId ? { ...l, companies: l.companies.filter(c => c !== companyId) } : l));
  }

  function exportList(l: SavedList, fmt: "csv" | "json") {
    const companies = MOCK_COMPANIES.filter(c => l.companies.includes(c.id));
    let content: string, filename: string, type: string;
    if (fmt === "csv") {
      const header = "name,domain,stage,sector,location,raised,score";
      const rows = companies.map(c => `${c.name},${c.domain},${c.stage},${c.sector},${c.location},${c.raised},${c.score}`);
      content = [header, ...rows].join("\n");
      filename = `${l.name}.csv`; type = "text/csv";
    } else {
      content = JSON.stringify(companies, null, 2);
      filename = `${l.name}.json`; type = "application/json";
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = filename; a.click();
    showToast(`Exported as ${fmt.toUpperCase()}`);
  }

  const currentList = lists.find(l => l.id === activeListId);
  const listCompanies = currentList ? MOCK_COMPANIES.filter(c => currentList.companies.includes(c.id)) : [];

  return (
    <div className={styles.app}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <div className={styles.content}>
          <div className="page-header">
            <div className="page-title">Lists</div>
            <div className="page-sub">Organize and export your pipeline</div>
          </div>

          <div className="lists-grid">
            <div>
              <div className="list-sidebar">
                {lists.map(l => (
                  <div key={l.id} className={`list-item-card ${l.id === activeListId ? "active" : ""}`} onClick={() => setActiveListId(l.id)}>
                    <div className="list-item-name">{l.name}</div>
                    <div className="list-item-count">{l.companies.length} companies</div>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <input className="input" placeholder="New list name…" value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && createList()} />
                  <button className="btn btn-primary" onClick={createList}>+ New</button>
                </div>
              </div>
            </div>

            <div>
              {!currentList ? (
                <div className="empty-state"><div className="empty-icon">◻</div><div className="empty-text">Select or create a list</div></div>
              ) : (
                <div>
                  <div className="export-bar">
                    <span style={{ fontSize: 13, fontWeight: 500, marginRight: "auto" }}>{currentList.name}</span>
                    <button className="btn btn-outline" onClick={() => exportList(currentList, "csv")}>↓ CSV</button>
                    <button className="btn btn-outline" onClick={() => exportList(currentList, "json")}>↓ JSON</button>
                  </div>
                  {listCompanies.length === 0 ? (
                    <div className="empty-state"><div className="empty-icon">+</div><div className="empty-text">Add companies from their <Link href="/companies" style={{ color: "var(--accent2)" }}>profile pages</Link></div></div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Company</th><th>Stage</th><th>Score</th><th></th></tr></thead>
                        <tbody>
                          {listCompanies.map(c => (
                            <tr key={c.id}>
                              <td>
                                <Link href={`/companies/${c.id}`}>
                                  <div className="company-name-cell">
                                    <CompanyAvatar company={c} />
                                    <div><div className="company-name">{c.name}</div><div className="company-domain">{c.domain}</div></div>
                                  </div>
                                </Link>
                              </td>
                              <td><Badge text={c.stage} stage={c.stage} /></td>
                              <td><ScoreBar score={c.score} /></td>
                              <td>
                                <button className="btn btn-ghost" style={{ fontSize: 10, color: "var(--red)" }}
                                  onClick={() => removeFromList(currentList.id, c.id)}>Remove</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
