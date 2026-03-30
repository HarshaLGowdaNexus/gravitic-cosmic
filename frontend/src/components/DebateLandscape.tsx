"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, GitMerge } from "lucide-react";

interface Claim {
  claim: string;
  evidence: string;
  citation_url: string;
}

const mockProponent: Claim[] = [
  { claim: "Footage matches known locations", evidence: "Satellite imagery confirms layout", citation_url: "#" },
  { claim: "Audio seems unedited", evidence: "No synthetic artifacts detected", citation_url: "#" }
];

const mockSkeptic: Claim[] = [
  { claim: "Metadata timeline is inconsistent", evidence: "File created 3 days after claimed event", citation_url: "#" },
  { claim: "Known propaganda network", evidence: "Source IP linked to bot farm", citation_url: "#" }
];

export default function DebateLandscape() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-10 relative">
      <motion.div 
        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
        className="glass-panel p-6 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="w-24 h-24" /></div>
        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> Proponent Agent
        </h3>
        <p className="text-sm text-slate-300 mb-4">Focuses on empirical evidence supporting the video.</p>
        <ul className="space-y-4">
          {mockProponent.map((p, i) => (
            <li key={i} className="bg-slate-800/50 p-3 rounded-lg border border-emerald-900/50">
              <strong className="block text-emerald-300 text-sm">{p.claim}</strong>
              <span className="text-xs text-slate-400">{p.evidence}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-panel p-6 rounded-2xl flex flex-col justify-center border-t-2 border-t-sky-500"
      >
        <div className="text-center mb-6">
          <GitMerge className="w-12 h-12 mx-auto text-sky-400 mb-2" />
          <h3 className="text-xl font-bold text-white neon-text">Synthesis Summary</h3>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed text-center">
          The core claim is <strong>partially true</strong> but severely lacks historical context. 
          While the footage is authentic, the surrounding narrative has been heavily editorialized to omit key facts. 
          It is advised to view this claim with skepticism.
        </p>
        <div className="mt-8 text-center px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Overall Sentiment:</span>
          <span className="text-sm font-semibold text-yellow-500">Neutral-Skeptical</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
        className="glass-panel p-6 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 p-4 opacity-10"><ShieldAlert className="w-24 h-24" /></div>
        <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> Skeptic Agent
        </h3>
        <p className="text-sm text-slate-300 mb-4">Focuses on counter-evidence and logical fallacies.</p>
        <ul className="space-y-4">
          {mockSkeptic.map((s, i) => (
            <li key={i} className="bg-slate-800/50 p-3 rounded-lg border border-rose-900/50">
              <strong className="block text-rose-300 text-sm">{s.claim}</strong>
              <span className="text-xs text-slate-400">{s.evidence}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
