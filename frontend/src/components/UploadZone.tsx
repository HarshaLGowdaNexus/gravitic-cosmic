"use client";

import { useState } from "react";
import { UploadCloud, FileVideo, Info, Sparkles, CheckCircle2, AlertCircle, FileText, Type } from "lucide-react";
import { motion } from "framer-motion";

interface UploadZoneProps {
  onAnalysisComplete?: (data: any) => void;
}

export default function UploadZone({ onAnalysisComplete }: UploadZoneProps) {
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");
  const [claimInput, setClaimInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setStatusMessage(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload & Verification response:", data);
      setStatusMessage({
        text: `Internet Verification complete for '${file.name}': ${data.verdict_badge || 'Analyzed'}`,
        isError: false
      });

      if (onAnalysisComplete && data.analysis) {
        onAnalysisComplete(data.analysis);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatusMessage({
        text: `Upload failed: ${err.message || "Please ensure the backend is running at http://localhost:8000"}.`,
        isError: true
      });
    } finally {
      setUploading(false);
    }
  };

  const handleTextClaimSubmit = async () => {
    if (!claimInput.trim()) return;
    setUploading(true);
    setStatusMessage(null);
    const formData = new FormData();
    formData.append("claim_text", claimInput.trim());

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setStatusMessage({
        text: `Internet Verification complete: ${data.verdict_badge || 'Analyzed'}`,
        isError: false
      });

      if (onAnalysisComplete && data.analysis) {
        onAnalysisComplete(data.analysis);
      }
    } catch (err: any) {
      setStatusMessage({
        text: `Verification error: ${err.message}`,
        isError: true
      });
    } finally {
      setUploading(false);
    }
  };

  const loadSample = (text: string) => {
    setClaimInput(text);
    setActiveTab("text");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto mb-10"
    >
      <div className="glass-panel border-2 border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Toggle between File upload and Direct Claim Text */}
        <div className="flex items-center justify-center p-1 bg-slate-900/80 rounded-2xl border border-slate-700/80 mb-6 max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab("file")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "file" ? "bg-sky-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <UploadCloud className="w-4 h-4" /> Upload Media
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "text" ? "bg-sky-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Type className="w-4 h-4" /> Type / Paste Claim
          </button>
        </div>

        {activeTab === "file" ? (
          <div
            className={`border-2 border-dashed p-8 flex flex-col items-center justify-center rounded-2xl transition-colors duration-300 ${
              dragActive ? "border-sky-500 bg-sky-900/20" : "border-slate-700 hover:border-sky-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadCloud className="w-14 h-14 text-sky-400 mb-3 animate-pulse" />
            <h3 className="text-lg font-medium text-white mb-1">Drag & Drop Video, Photo, or Text File</h3>
            <p className="text-xs text-slate-400 text-center mb-5 max-w-md">
              Uploads are automatically transcribed to JSON, cross-referenced with live open internet news and Wikipedia, and verified.
            </p>

            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-all shadow-lg hover:shadow-sky-500/20">
                {uploading ? "Transcribing & Checking Internet..." : "Select Video / Photo / Document"}
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="video/*,image/*,.txt,.pdf,.md"
                onChange={handleChange}
                disabled={uploading}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Type or paste any viral video claim, news rumor, or miracle assertion:
              </label>
              <textarea
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value)}
                rows={3}
                placeholder="e.g. A bronze religious statue was observed crying real tears in a church in Italy. Crowds are gathering claiming it is a divine miracle."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              onClick={handleTextClaimSubmit}
              disabled={uploading || !claimInput.trim()}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-600/20"
            >
              {uploading ? "Searching Live Internet & Fact-Checking..." : "Verify Claim on Live Internet"}
            </button>
          </div>
        )}

        {/* Quick Sample Presets */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> One-Click Internet Verification Tests:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadSample("A bronze religious statue was observed crying real tears in a church in Italy. Crowds are gathering claiming it is a divine miracle.")}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
            >
              Statue Crying Tears Miracle
            </button>
            <button
              onClick={() => loadSample("Viral footage claims the Eiffel Tower caught fire and collapsed today in Paris.")}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
            >
              Eiffel Tower Collapse Hoax
            </button>
            <button
              onClick={() => loadSample("Municipal budget transparency report alleges unaccounted transfers on March 10th.")}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
            >
              Municipal Budget Anomaly
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className={`mt-5 p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
            statusMessage.isError ? "bg-rose-950/60 border border-rose-800 text-rose-300" : "bg-emerald-950/60 border border-emerald-800 text-emerald-300"
          }`}>
            {statusMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
        )}

      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 justify-center">
        <Info className="w-4 h-4 text-sky-400" />
        <p>1. Transcribe to JSON ➔ 2. Live Internet Search ➔ 3. Factual Truth & Miracle Verdict.</p>
      </div>
    </motion.div>
  );
}
