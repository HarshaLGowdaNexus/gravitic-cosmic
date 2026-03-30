"use client";

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

export default function GenealogyGraph() {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (d3Container.current) {
      const data = {
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

      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove(); // Clear SVG before drawing
      
      const width = 600;
      const height = 300;

      const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
        .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));

      const link = svg.append("g")
        .attr("stroke", "#475569")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

      const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 15)
        .attr("fill", (d) => d.group === 1 ? '#e11d48' : '#0ea5e9')
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
        .text((d) => d.id);

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
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
      className="glass-panel p-6 rounded-2xl flex flex-col items-center"
    >
      <h3 className="text-xl font-bold text-white mb-2 neon-text">Narrative Forensics</h3>
      <p className="text-sm text-slate-400 mb-6">Tracing the mutation and spatial distribution of the claim.</p>
      
      <svg
        className="w-full h-[300px]"
        ref={d3Container}
      />
    </motion.div>
  );
}
