"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOCK_COMPANIES } from "@/lib/data";

const NAV = [
  { href: "/companies", icon: "⬡", label: "Companies" },
  { href: "/lists", icon: "◈", label: "Lists" },
  { href: "/saved", icon: "◎", label: "Saved Searches" },
];

export default function Sidebar() {
  const path = usePathname();
  const highSignal = MOCK_COMPANIES.filter(c => c.score >= 80).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">S</div>
        Scout
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Discover</div>
        {NAV.map(n => (
          <Link key={n.href} href={n.href}>
            <div className={`nav-item ${path.startsWith(n.href) ? "active" : ""}`}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="score-pill">
          <span>{highSignal}</span> high-signal
        </div>
        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 8 }}>
          {MOCK_COMPANIES.length} companies indexed
        </div>
      </div>
    </aside>
  );
}
