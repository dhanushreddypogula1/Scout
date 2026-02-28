import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { MOCK_COMPANIES } from "@/lib/data";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const cache = new Map<string, { data: object; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60;

export async function POST(req: NextRequest) {
  try {
    const { companyId } = await req.json();
    if (!companyId) return NextResponse.json({ error: "Missing companyId" }, { status: 400 });

    const company = MOCK_COMPANIES.find(c => c.id === companyId);
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

    const cached = cache.get(companyId);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json({ ...cached.data, cached: true });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a VC research analyst. Analyze this company and return a JSON object (no markdown, no backticks, no extra text) with exactly these fields:
- summary: string (1-2 sentences about what they do and why it matters)
- whatTheyDo: string[] (4-5 specific product/service bullet points)
- keywords: string[] (7-9 relevant tech and market keywords)
- signals: string[] (2-3 inferred signals e.g. "Active hiring: 4 open roles", "Recent changelog update")
- sources: Array<{ url: string, note: string }> (2-3 plausible public URLs for this company)

Company:
Name: ${company.name}
Domain: ${company.domain}
Stage: ${company.stage}
Sector: ${company.sector}
Description: ${company.description}
Tags: ${company.tags.join(", ")}
Employees: ${company.employees}
Raised: ${company.raised}

Return only valid JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text.replace(/```json|```/g, "").trim());
    const enriched = { ...data, fetchedAt: new Date().toISOString() };

    cache.set(companyId, { data: enriched, ts: Date.now() });
    return NextResponse.json(enriched);

  } catch (err) {
    console.error("[enrich]", err);
    return NextResponse.json({ error: "Enrichment failed" }, { status: 500 });
  }
}
