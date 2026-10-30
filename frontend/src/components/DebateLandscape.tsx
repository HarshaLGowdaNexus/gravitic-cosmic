"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, GitMerge, ExternalLink } from "lucide-react";

export interface Claim {
  claim: string;
  evidence: string;
  citation_url?: string;
}

export interface DebateData {
  proponent_arguments: Claim[];
  skeptic_arguments: Claim[];
  synthesis: string;
  overall_sentiment: string;
}

interface DebateLandscapeProps {
  debate?: DebateData;
}

const defaultProponent: Claim[] = [
  { claim: "Footage matches known locations", evidence: "Satellite imagery confirms layout", citation_url: "#" },
  { claim: "Audio seems unedited", evidence: "No synthetic artifacts detected", citation_url: "#" }
];

const defaultSkeptic: Claim[] = [
  { claim: "Metadata timeline is inconsistent", evidence: "File created 3 days after claimed event", citation_url: "#" },
  { claim: "Known propaganda network", evidence: "Source IP linked to bot farm", citation_url: "#" }
];

export default function DebateLandscape({ debate }: DebateLandscapeProps) {
  const proponentArgs = debate?.proponent_arguments?.length ? debate.proponent_arguments : defaultProponent;
  const skepticArgs = debate?.skeptic_arguments?.length ? debate.skeptic_arguments : defaultSkeptic;
  const synthesis = debate?.synthesis || "The core claim is partially true but severely lacks historical context. While the footage is authentic, the surrounding narrative has been heavily editorialized to omit key facts. It is advised to view this claim with skepticism.";
  const sentiment = debate?.overall_sentiment || "Neutral-Skeptical";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-10 relative">
      {/* Proponent Agent */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
        className="glass-panel p-6 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="w-24 h-24" /></div>
        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> Proponent Agent
        </h3>
        <p className="text-sm text-slate-300 mb-4">Focuses on empirical evidence supporting authenticity.</p>
        <ul className="space-y-4">
          {proponentArgs.map((p, i) => (
            <li key={i} className="bg-slate-800/50 p-3 rounded-lg border border-emerald-900/50 hover:border-emerald-700/80 transition-colors">
              <strong className="block text-emerald-300 text-sm mb-1">{p.claim}</strong>
              <span className="text-xs text-slate-400 block mb-1">{p.evidence}</span>
              {p.citation_url && p.citation_url !== "#" && (
                <a 
                  href={p.citation_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400/80 hover:text-emerald-300 underline"
                >
                  <ExternalLink className="w-3 h-3" /> Citation source
                </a>
              )}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Synthesis Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-t-2 border-t-sky-500"
      >
        <div>
          <div className="text-center mb-6">
            <GitMerge className="w-12 h-12 mx-auto text-sky-400 mb-2" />
            <h3 className="text-xl font-bold text-white neon-text">Synthesis Summary</h3>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed text-center">
            {synthesis}
          </p>
        </div>
        
        <div className="mt-8 text-center px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Overall Sentiment:</span>
          <span className={`text-sm font-semibold ${
            sentiment.toLowerCase().includes("skeptical") ? "text-yellow-400" :
            sentiment.toLowerCase().includes("error") ? "text-rose-400" : "text-sky-400"
          }`}>
            {sentiment}
          </span>
        </div>
      </motion.div>

      {/* Skeptic Agent */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
        className="glass-panel p-6 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 p-4 opacity-10"><ShieldAlert className="w-24 h-24" /></div>
        <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> Skeptic Agent
        </h3>
        <p className="text-sm text-slate-300 mb-4">Focuses on counter-evidence, fallacies, and omitted facts.</p>
        <ul className="space-y-4">
          {skepticArgs.map((s, i) => (
            <li key={i} className="bg-slate-800/50 p-3 rounded-lg border border-rose-900/50 hover:border-rose-700/80 transition-colors">
              <strong className="block text-rose-300 text-sm mb-1">{s.claim}</strong>
              <span className="text-xs text-slate-400 block mb-1">{s.evidence}</span>
              {s.citation_url && s.citation_url !== "#" && (
                <a 
                  href={s.citation_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 text-[11px] text-rose-400/80 hover:text-rose-300 underline"
                >
                  <ExternalLink className="w-3 h-3" /> Citation source
                </a>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
