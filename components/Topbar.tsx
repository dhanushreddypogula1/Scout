"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Topbar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSearch(e: React.KeyboardEvent) {
    if (e.key === "Enter" && q.trim()) {
      router.push(`/companies?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <header className="topbar">
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          className="search-input"
          placeholder="Search companies, sectors, tags… (Enter)"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <div style={{ fontSize: 10, color: "var(--text3)", marginLeft: 8 }}>⌘K</div>
      <div className="topbar-actions">
        <button className="btn btn-outline" style={{ fontSize: 11 }}>↑ Import</button>
        <button className="btn btn-primary" style={{ fontSize: 11 }}>+ Add company</button>
      </div>
    </header>
  );
}
