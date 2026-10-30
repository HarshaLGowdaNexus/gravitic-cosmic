"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Flame } from "lucide-react";

export interface Scenario {
  title: string;
  description?: string;
  probability: number;
}

export interface PredictiveData {
  risk_score?: number;
  scenarios?: {
    best_case?: Scenario;
    most_likely?: Scenario;
    worst_case?: Scenario;
  };
  timeline?: { name: string; probability: number }[];
}

interface ProbabilityTimelineProps {
  predictions?: PredictiveData;
}

const defaultTimeline = [
  { name: 'Day 1 (Seeding)', probability: 22 },
  { name: 'Day 2 (Viral Peak)', probability: 68 },
  { name: 'Day 3 (Counter-Debate)', probability: 54 },
  { name: 'Day 4 (Echo Hardening)', probability: 48 },
  { name: 'Day 5 (Plateau)', probability: 35 },
];

export default function ProbabilityTimeline({ predictions }: ProbabilityTimelineProps) {
  const timelineData = predictions?.timeline?.length ? predictions.timeline : defaultTimeline;
  const riskScore = predictions?.risk_score ?? 7.4;
  const scenarios = predictions?.scenarios;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
      className="glass-panel p-6 rounded-2xl w-full space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 neon-text flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-400" /> Predictive Forecasting & Trajectory
          </h3>
          <p className="text-sm text-slate-400">Projected narrative momentum, institutional risk, and adoption velocity.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl">
          <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Risk Score</div>
            <div className="text-lg font-extrabold text-amber-400">{riskScore} <span className="text-xs text-slate-400 font-normal">/ 10</span></div>
          </div>
        </div>
      </div>

      {/* Trajectory Scenarios */}
      {scenarios && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.best_case && (
            <div className="bg-slate-800/40 border border-emerald-900/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Best Case
                </span>
                <span className="text-xs font-bold text-slate-300">{scenarios.best_case.probability}%</span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{scenarios.best_case.title}</h4>
              <p className="text-xs text-slate-400">{scenarios.best_case.description}</p>
            </div>
          )}

          {scenarios.most_likely && (
            <div className="bg-slate-800/40 border border-sky-900/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-sky-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Most Likely
                </span>
                <span className="text-xs font-bold text-slate-300">{scenarios.most_likely.probability}%</span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{scenarios.most_likely.title}</h4>
              <p className="text-xs text-slate-400">{scenarios.most_likely.description}</p>
            </div>
          )}

          {scenarios.worst_case && (
            <div className="bg-slate-800/40 border border-rose-900/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Worst Case
                </span>
                <span className="text-xs font-bold text-slate-300">{scenarios.worst_case.probability}%</span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{scenarios.worst_case.title}</h4>
              <p className="text-xs text-slate-400">{scenarios.worst_case.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="h-[250px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" unit="%" domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
              formatter={(val: any) => [`${val}%`, "Adoption Probability"]}
            />
            <Line 
              type="monotone" 
              dataKey="probability" 
              stroke="#38bdf8" 
              strokeWidth={3} 
              dot={{ r: 5, fill: "#0ea5e9", stroke: "#fff", strokeWidth: 2 }} 
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
