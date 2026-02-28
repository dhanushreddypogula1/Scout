import { Company, Signal } from "@/types";

export const MOCK_COMPANIES: Company[] = [
  { id: "1", name: "Aether Labs", domain: "aetherlabs.io", stage: "Seed", sector: "AI Infrastructure", location: "San Francisco, CA", founded: 2022, employees: "11-50", raised: "$4.2M", score: 94, tags: ["GPU compute", "MLOps", "DevTools"], lastSignal: "2025-02-10", description: "Distributed GPU orchestration for AI training workloads." },
  { id: "2", name: "Meridian Health", domain: "meridianhealth.com", stage: "Series A", sector: "HealthTech", location: "Boston, MA", founded: 2021, employees: "51-200", raised: "$18M", score: 88, tags: ["Clinical AI", "EHR", "Diagnostics"], lastSignal: "2025-02-14", description: "AI-powered clinical decision support embedded in existing EHR workflows." },
  { id: "3", name: "Volta Energy", domain: "voltaenergy.co", stage: "Pre-Seed", sector: "CleanTech", location: "Austin, TX", founded: 2023, employees: "1-10", raised: "$850K", score: 76, tags: ["Battery", "Grid", "Storage"], lastSignal: "2025-01-28", description: "Next-gen solid-state battery management systems for utility-scale storage." },
  { id: "4", name: "Cartograph", domain: "cartograph.dev", stage: "Seed", sector: "Developer Tools", location: "New York, NY", founded: 2022, employees: "11-50", raised: "$3.1M", score: 91, tags: ["Graph DB", "Observability", "SRE"], lastSignal: "2025-02-17", description: "Dependency graph visualization and incident mapping for platform engineers." },
  { id: "5", name: "Rhizome Bio", domain: "rhizomebio.com", stage: "Series A", sector: "Biotech", location: "Cambridge, MA", founded: 2020, employees: "51-200", raised: "$22M", score: 83, tags: ["Synthetic Biology", "Fermentation", "Materials"], lastSignal: "2025-02-05", description: "Engineering microorganisms to produce sustainable industrial materials at scale." },
  { id: "6", name: "Solace Finance", domain: "solacefinance.com", stage: "Seed", sector: "FinTech", location: "Miami, FL", founded: 2022, employees: "11-50", raised: "$5.8M", score: 79, tags: ["Embedded Finance", "SMB", "Lending"], lastSignal: "2025-01-20", description: "Embedded lending infrastructure for SMB software platforms." },
  { id: "7", name: "Strata Security", domain: "stratasec.io", stage: "Series A", sector: "Cybersecurity", location: "Washington, DC", founded: 2021, employees: "51-200", raised: "$14M", score: 87, tags: ["Zero Trust", "Identity", "SASE"], lastSignal: "2025-02-12", description: "Zero-trust network access layer for hybrid enterprise infrastructure." },
  { id: "8", name: "Luminary Robotics", domain: "luminaryrobotics.com", stage: "Seed", sector: "Robotics", location: "Pittsburgh, PA", founded: 2023, employees: "11-50", raised: "$6.5M", score: 85, tags: ["Warehouse", "Manipulation", "ROS"], lastSignal: "2025-02-08", description: "Dexterous manipulation robots for unstructured warehouse picking tasks." },
  { id: "9", name: "Nimbus Data", domain: "nimbusdata.ai", stage: "Pre-Seed", sector: "Data Infrastructure", location: "Seattle, WA", founded: 2024, employees: "1-10", raised: "$1.2M", score: 72, tags: ["Data Lakehouse", "ETL", "Streaming"], lastSignal: "2025-01-15", description: "Serverless data lakehouse with native streaming ingestion." },
  { id: "10", name: "Paragon Legal", domain: "paragonlegal.co", stage: "Seed", sector: "LegalTech", location: "Chicago, IL", founded: 2022, employees: "11-50", raised: "$3.9M", score: 80, tags: ["Contract AI", "CLM", "Compliance"], lastSignal: "2025-02-01", description: "AI contract lifecycle management with built-in compliance guardrails." },
  { id: "11", name: "Arcadian Maps", domain: "arcadianmaps.com", stage: "Series B", sector: "GeoSpatial", location: "Denver, CO", founded: 2019, employees: "201-500", raised: "$61M", score: 70, tags: ["Satellite", "Earth Observation", "Defense"], lastSignal: "2025-01-30", description: "High-cadence satellite imagery analytics for commercial and government clients." },
  { id: "12", name: "Cobalt Minds", domain: "cobaltminds.ai", stage: "Seed", sector: "AI Infrastructure", location: "San Francisco, CA", founded: 2023, employees: "11-50", raised: "$7M", score: 93, tags: ["LLM Ops", "Fine-tuning", "Evals"], lastSignal: "2025-02-18", description: "LLMOps platform for fine-tuning, evaluation, and production deployment." },
];

export const MOCK_SIGNALS: Record<string, Signal[]> = {
  "1": [
    { date: "2025-02-10", type: "funding", text: "Closed $4.2M seed led by Benchmark." },
    { date: "2025-01-22", type: "hiring", text: "3 senior ML engineer roles posted on LinkedIn." },
    { date: "2024-12-05", type: "product", text: "Launched v2 of GPU scheduler with 40% cost reduction." },
  ],
  "2": [
    { date: "2025-02-14", type: "partnership", text: "Integration announced with Epic Systems EHR." },
    { date: "2025-01-10", type: "hiring", text: "Head of Sales & CMO searches opened." },
    { date: "2024-11-20", type: "funding", text: "Series A $18M announced; Andreessen Horowitz led." },
  ],
  "4": [
    { date: "2025-02-17", type: "product", text: "Changelog v0.9 dropped with live incident graph diffing." },
    { date: "2025-02-02", type: "hiring", text: "Founding AE role posted." },
    { date: "2025-01-14", type: "press", text: "Featured in The New Stack as 'tool to watch'." },
  ],
};

export const SECTORS = ["All", "AI Infrastructure", "HealthTech", "CleanTech", "Developer Tools", "Biotech", "FinTech", "Cybersecurity", "Robotics", "Data Infrastructure", "LegalTech", "GeoSpatial"];
export const STAGES = ["All", "Pre-Seed", "Seed", "Series A", "Series B"];
export const PAGE_SIZE = 8;
