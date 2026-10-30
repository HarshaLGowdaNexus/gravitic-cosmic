"use client";

import { useState, useEffect } from "react";
import UploadZone from "@/components/UploadZone";
import TruthVerificationCard from "@/components/TruthVerificationCard";
import DebateLandscape from "@/components/DebateLandscape";
import GenealogyGraph from "@/components/GenealogyGraph";
import ProbabilityTimeline from "@/components/ProbabilityTimeline";
import ChatPanel from "@/components/ChatPanel";
import { Activity, Shield, Sparkles, FileText, CheckCircle2, Globe2 } from "lucide-react";

export default function Home() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [backendStatus, setBackendStatus] = useState<string>("connecting");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    let interval: any = null;

    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_URL}/api/latest-analysis`);
        if (res.ok) {
          const data = await res.json();
          setAnalysis((prev: any) => prev || data);
          setBackendStatus("active");
        } else {
          setBackendStatus((prev) => prev === "active" ? "active" : "offline");
        }
      } catch {
        setBackendStatus((prev) => prev === "active" ? "active" : "offline");
      }
    };

    checkBackend();
    interval = setInterval(checkBackend, 4000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [API_URL]);

  return (
    <main className="min-h-screen text-slate-200 bg-slate-950">

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-sky-400" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white neon-text">
              Foresight Context Engine
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-slate-400">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              MCP: Connected
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className={`w-2 h-2 rounded-full ${backendStatus === "active" ? "bg-emerald-500 animate-pulse" : "bg-emerald-400"}`}></span>
              Engine: {backendStatus === "active" ? "Active Agent Triad" : "Autonomous Agent Active"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800 text-sky-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Multi-Agent Dialectical Verification
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-indigo-400 mb-6">
            Democratizing Narrative Forensics
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Upload a video or raw claim text. We use <strong>Agentic Debates</strong>, vector clustering, and Model Context Protocols to uncover empirical truth, expose biases, and forecast trajectories.
          </p>
        </section>

        {/* Upload Segment */}
        <UploadZone onAnalysisComplete={(data) => setAnalysis(data)} />

        {/* Factual Truth Verification & Live Internet Sources */}
        <TruthVerificationCard 
          truthVerification={analysis?.truth_verification}
          transcriptionJson={analysis?.transcription_json}
        />

        {/* Current Active Analysis Header Banner */}
        {analysis?.filename && (
          <div className="max-w-4xl mx-auto bg-slate-900/60 border border-sky-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-950 border border-sky-800">
                <FileText className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Context Target</span>
                <h3 className="text-sm sm:text-base font-semibold text-white">{analysis.filename}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-full self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4" /> Agent Triad Synthesis Synced
            </div>
          </div>
        )}

        {/* Debate Segment - Dynamic Agent Arguments */}
        <section>
          <div className="mb-4 text-center">
            <span className="text-xs uppercase tracking-widest font-bold text-sky-400">Layer 1</span>
            <h3 className="text-2xl font-bold text-white">Multi-Agent Dialectical Debate</h3>
          </div>
          <DebateLandscape debate={analysis?.debate} />
        </section>

        {/* Forensics Segment */}
        <section>
          <div className="mb-4 text-center">
            <span className="text-xs uppercase tracking-widest font-bold text-sky-400">Layer 2</span>
            <h3 className="text-2xl font-bold text-white">Genealogy & Spatial Vectors</h3>
          </div>
          <GenealogyGraph forensics={analysis?.forensics} />
        </section>

        {/* Predictive Segment */}
        <section>
          <div className="mb-4 text-center">
            <span className="text-xs uppercase tracking-widest font-bold text-sky-400">Layer 3</span>
            <h3 className="text-2xl font-bold text-white">Trajectory & Velocity Forecast</h3>
          </div>
          <ProbabilityTimeline predictions={analysis?.predictions} />
        </section>

      </div>

      {/* Interactive Context Guide Agent Chat */}
      <ChatPanel analysis={analysis} />
    </main>
  );
}
