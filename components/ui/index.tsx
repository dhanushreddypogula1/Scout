"use client";
import { Company } from "@/types";

export function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export function scoreColor(s: number) {
  if (s >= 90) return "#34d399";
  if (s >= 75) return "#60a5fa";
  return "#fbbf24";
}

function stageBadgeClass(stage: string) {
  if (stage === "Pre-Seed") return "badge-pre";
  if (stage === "Seed") return "badge-seed";
  if (stage === "Series A") return "badge-a";
  return "badge-b";
}

export function Badge({ text, stage }: { text: string; stage?: string }) {
  return (
    <span className={`badge ${stageBadgeClass(stage || text)}`}>{text}</span>
  );
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="score-bar">
      <span className="score-num" style={{ color: scoreColor(score) }}>{score}</span>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${score}%`, background: scoreColor(score) }} />
      </div>
    </div>
  );
}

export function CompanyAvatar({ company, size = 28 }: { company: Company; size?: number }) {
  return (
    <div
      className="company-avatar"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials(company.name)}
    </div>
  );
}

export function Btn({
  children, variant = "outline", onClick, disabled, style, href,
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "enrich" | "saved";
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  href?: string;
}) {
  const cls = `btn btn-${variant}`;
  if (href) return <a href={href} target="_blank" rel="noreferrer"><button className={cls} style={style}>{children}</button></a>;
  return <button className={cls} onClick={onClick} disabled={disabled} style={style}>{children}</button>;
}

export function Tag({ text }: { text: string }) {
  return <span className="tag">{text}</span>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="card" style={style}>{children}</div>;
}

export function CardHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="card-header">
      <div className="card-title">{title}</div>
      {right}
    </div>
  );
}
