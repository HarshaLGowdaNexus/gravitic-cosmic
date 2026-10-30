"use client";

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

export interface ForensicsNode {
  id: string;
  group: number;
}

export interface ForensicsLink {
  source: string;
  target: string;
  value: number;
}

export interface ForensicsData {
  topic?: string;
  nodes?: ForensicsNode[];
  links?: ForensicsLink[];
}

interface GenealogyGraphProps {
  forensics?: ForensicsData;
}

const defaultData = {
  nodes: [
    { id: "Source: Telegram (Mar 10)", group: 1 },
    { id: "Twitter Reshare (Mar 12)", group: 2 },
    { id: "Reddit /r/news (Mar 13)", group: 2 },
    { id: "Blog XYZ (Mar 14)", group: 3 },
    { id: "Mainstream Mention (Mar 15)", group: 4 }
  ],
  links: [
    { source: "Source: Telegram (Mar 10)", target: "Twitter Reshare (Mar 12)", value: 1 },
    { source: "Source: Telegram (Mar 10)", target: "Reddit /r/news (Mar 13)", value: 1 },
    { source: "Twitter Reshare (Mar 12)", target: "Blog XYZ (Mar 14)", value: 2 },
    { source: "Reddit /r/news (Mar 13)", target: "Mainstream Mention (Mar 15)", value: 2 }
  ]
};

export default function GenealogyGraph({ forensics }: GenealogyGraphProps) {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!d3Container.current) return;

    const data = (forensics?.nodes && forensics?.links) ? {
      nodes: forensics.nodes.map(n => ({ ...n })),
      links: forensics.links.map(l => ({ ...l }))
    } : {
      nodes: defaultData.nodes.map(n => ({ ...n })),
      links: defaultData.links.map(l => ({ ...l }))
    };

    const svg = d3.select(d3Container.current);
    svg.selectAll("*").remove(); // Clear SVG before drawing
    
    const width = 600;
    const height = 300;

    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-220))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", (d: any) => Math.sqrt(d.value || 1) * 2);

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 14)
      .attr("fill", (d: any) => {
        if (d.group === 1) return '#e11d48'; // Origin: red
        if (d.group === 2) return '#0ea5e9'; // Social: sky blue
        if (d.group === 3) return '#f59e0b'; // Blogs: amber
        return '#10b981'; // Mainstream: emerald
      })
      .call(d3.drag<any, any>()
          .on("start", (e, d: any) => {
            if (!e.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (e, d: any) => {
            d.fx = e.x;
            d.fy = e.y;
          })
          .on("end", (e, d: any) => {
            if (!e.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    node.append("title")
      .text((d: any) => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [forensics]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
      className="glass-panel p-6 rounded-2xl flex flex-col items-center"
    >
      <h3 className="text-xl font-bold text-white mb-2 neon-text">Narrative Forensics</h3>
      <p className="text-sm text-slate-400 mb-6 text-center">
        Tracing the origin, mutation, and spatial vector distribution of {forensics?.topic ? `"${forensics.topic}"` : "the claim"}.
      </p>
      
      <svg
        className="w-full h-[300px]"
        ref={d3Container}
        viewBox="0 0 600 300"
      />

      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs text-slate-400">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-600"></span> Origin Seeding</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-sky-500"></span> Viral Platforms</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Aggregators</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Media Citations</span>
      </div>
    </motion.div>
  );
}
