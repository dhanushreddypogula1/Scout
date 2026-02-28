"use client";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_COMPANIES, SECTORS, STAGES, PAGE_SIZE } from "@/lib/data";
import { Badge, ScoreBar, CompanyAvatar, Tag } from "@/components/ui";

type SortKey = "name" | "stage" | "sector" | "raised" | "score";
type SortDir = "asc" | "desc";

function CompaniesInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [sector, setSector] = useState("All");
  const [stage, setStage] = useState("All");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "score", dir: "desc" });
  const [page, setPage] = useState(1);

  const q = params.get("q") || "";

  const filtered = useMemo(() => {
    let arr = MOCK_COMPANIES;
    if (q) {
      const lower = q.toLowerCase();
      arr = arr.filter(c =>
        c.name.toLowerCase().includes(lower) ||
        c.description.toLowerCase().includes(lower) ||
        c.tags.some(t => t.toLowerCase().includes(lower))
      );
    }
    if (sector !== "All") arr = arr.filter(c => c.sector === sector);
    if (stage !== "All") arr = arr.filter(c => c.stage === stage);
    return [...arr].sort((a, b) => {
      const va = String(a[sort.key]).toLowerCase();
      const vb = String(b[sort.key]).toLowerCase();
      return sort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [q, sector, stage, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
    setPage(1);
  }

  function SortIcon({ k }: { k: string }) {
    if (sort.key !== k) return null;
    return <span>{sort.dir === "asc" ? " ↑" : " ↓"}</span>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Companies</div>
        <div className="page-sub">{filtered.length} companies · sourced from mock dataset</div>
      </div>

      <div className="filter-bar">
        <select className="filter-select" value={sector} onChange={e => { setSector(e.target.value); setPage(1); }}>
          {SECTORS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={stage} onChange={e => { setStage(e.target.value); setPage(1); }}>
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
        {q && (
          <span className="filter-btn active">
            &ldquo;{q}&rdquo;
            <button onClick={() => router.push("/companies")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", marginLeft: 4 }}>x</button>
          </span>
        )}
        <div className="results-count">{filtered.length} results</div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")}>Company<SortIcon k="name" /></th>
              <th onClick={() => toggleSort("stage")}>Stage<SortIcon k="stage" /></th>
              <th onClick={() => toggleSort("sector")}>Sector<SortIcon k="sector" /></th>
              <th>Location</th>
              <th onClick={() => toggleSort("raised")}>Raised<SortIcon k="raised" /></th>
              <th onClick={() => toggleSort("score")}>Score<SortIcon k="score" /></th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map(c => (
              <tr key={c.id}>
                <td>
                  <Link href={`/companies/${c.id}`} style={{ display: "block" }}>
                    <div className="company-name-cell">
                      <CompanyAvatar company={c} />
                      <div>
                        <div className="company-name">{c.name}</div>
                        <div className="company-domain">{c.domain}</div>
                      </div>
                    </div>
                  </Link>
                </td>
                <td><Badge text={c.stage} stage={c.stage} /></td>
                <td style={{ color: "var(--text2)", fontSize: 11 }}>{c.sector}</td>
                <td style={{ color: "var(--text3)", fontSize: 11 }}>{c.location}</td>
                <td style={{ color: "var(--text2)" }}>{c.raised}</td>
                <td><ScoreBar score={c.score} /></td>
                <td>
                  <div className="tag-list">
                    {c.tags.slice(0, 2).map(t => <Tag key={t} text={t} />)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>→</button>
        </div>
      )}
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div style={{ padding: 28, color: "var(--text3)", fontSize: 12 }}>Loading...</div>}>
      <CompaniesInner />
    </Suspense>
  );
}
