"use client";

import { useState } from "react";
import { UploadCloud, FileVideo, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function UploadZone() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    // In real app, submit this to the FastAPI /api/upload endpoint
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await result.json();
      console.log("Upload response:", data);
      alert(data.message || "Video processing initiated! Context is being gathered.");
    } catch (err) {
      console.error(err);
      alert("Failed to upload. Please ensure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto mb-10"
    >
      <div
        className={`glass-panel border-2 border-dashed p-10 flex flex-col items-center justify-center rounded-2xl transition-colors duration-300 ${
          dragActive ? "border-sky-500 bg-sky-900/20" : "border-slate-700 hover:border-sky-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <UploadCloud className="w-16 h-16 text-sky-400 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Drag & Drop Video or Text</h3>
        <p className="text-sm text-slate-400 text-center mb-6">
          Upload obscure shorts, fake news clips, or raw claims to trace their genealogy.
        </p>

        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-6 rounded-full transition-all">
            {uploading ? "Analyzing..." : "Select File"}
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="video/*,.txt,.pdf"
            onChange={handleChange}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 justify-center">
        <Info className="w-4 h-4" />
        <p>Uses <strong>Whisper</strong> + <strong>Vision LLM</strong> to extract multimodal data instantly.</p>
      </div>
    </motion.div>
  );
}
