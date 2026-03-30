"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Day 1', probability: 40 },
  { name: 'Day 2', probability: 45 },
  { name: 'Day 3', probability: 70 },
  { name: 'Day 4', probability: 85 },
  { name: 'Day 5', probability: 90 },
];

export default function ProbabilityTimeline() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
      className="glass-panel p-6 rounded-2xl w-full"
    >
      <h3 className="text-xl font-bold text-white mb-2 neon-text">Predictive Forecasting</h3>
      <p className="text-sm text-slate-400 mb-6">Probability of mainstream narrative adoption over time.</p>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
            <Line type="monotone" dataKey="probability" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5, fill: "#0ea5e9" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
