import UploadZone from "@/components/UploadZone";
import DebateLandscape from "@/components/DebateLandscape";
import GenealogyGraph from "@/components/GenealogyGraph";
import ProbabilityTimeline from "@/components/ProbabilityTimeline";
import ChatPanel from "@/components/ChatPanel";
import { Activity } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-200">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-sky-400" />
            <h1 className="text-2xl font-bold tracking-wider text-white neon-text">
              Foresight Context Engine
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> MCP: Connected</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Engine: Active</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400 mb-6">
            Democratizing Narrative Forensics
          </h2>
          <p className="text-lg text-slate-400">
            Upload a video or text. We use <strong>Agentic Debates</strong>, vector clustering, and Model Context Protocols to instantly uncover the empirical truth, expose biases, and forecast future trajectories.
          </p>
        </section>

        {/* Upload Segment */}
        <UploadZone />

        {/* Debate Segment - Dynamic */}
        <DebateLandscape />

        {/* Forensics Segment */}
        <GenealogyGraph />

        {/* Predictive Segment */}
        <ProbabilityTimeline />

      </div>

      <ChatPanel />
    </main>
  );
}
