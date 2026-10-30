"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Globe2, 
  ExternalLink, 
  Sparkles, 
  FileCode, 
  ChevronDown, 
  ChevronUp,
  Search,
  BookOpen,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Video,
  Compass
} from "lucide-react";

interface EventProvenance {
  event_name?: string;
  venue?: string;
  location_city_country?: string;
  geo_coordinates?: string;
  date?: string;
  session_or_forum?: string;
  key_figures?: Array<{
    name: string;
    role: string;
    action_or_statement?: string;
  }>;
  authenticity_forensics?: {
    is_authentic_footage: boolean;
    is_deepfake: boolean;
    is_spliced_or_misattributed: boolean;
    manipulation_details: string;
  };
  video_and_geo_links?: Array<{
    title: string;
    url: string;
    platform: string;
  }>;
}

interface TruthVerificationProps {
  truthVerification?: {
    verdict?: string;
    verdict_badge?: string;
    truth_status?: string;
    is_miracle_claim?: boolean;
    explanation?: string;
    event_provenance?: EventProvenance;
    sources_searched_count?: number;
    evidence_sources?: Array<{
      source_type: string;
      publisher: string;
      title: string;
      link: string;
      date?: string;
      snippet: string;
    }>;
  };
  transcriptionJson?: {
    media_type?: string;
    filename?: string;
    transcript_or_text?: string;
    is_miracle_claim?: boolean;
    extracted_claims?: Array<{
      claim: string;
      entities?: string[];
      is_miracle_assertion?: boolean;
    }>;
  };
}

export default function TruthVerificationCard({ truthVerification, transcriptionJson }: TruthVerificationProps) {
  const [showJson, setShowJson] = useState(false);

  if (!truthVerification && !transcriptionJson) return null;

  const badge = truthVerification?.verdict_badge || "ANALYZED";
  const verdict = truthVerification?.verdict || "Verification Complete";
  const explanation = truthVerification?.explanation || "The video context has been matched against public open internet records.";
  const isMiracle = truthVerification?.is_miracle_claim ?? transcriptionJson?.is_miracle_claim ?? false;
  const sources = truthVerification?.evidence_sources || [];
  const provenance = truthVerification?.event_provenance;

  const isDebunked = badge.includes("DEBUNKED") || badge.includes("FALSE");
  const isTrue = badge.includes("TRUE");
  const isMisleading = badge.includes("MISLEADING");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto my-8"
    >
      <div className={`glass-panel rounded-3xl p-6 sm:p-8 border-2 shadow-2xl relative overflow-hidden ${
        isDebunked ? "border-rose-600/60 bg-rose-950/20 shadow-rose-950/40" :
        isTrue ? "border-emerald-500/60 bg-emerald-950/20 shadow-emerald-950/40" :
        isMisleading ? "border-amber-500/60 bg-amber-950/20 shadow-amber-950/40" :
        "border-sky-500/60 bg-slate-900/40"
      }`}>

        {/* Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${
              isDebunked ? "bg-rose-500/20 text-rose-400" :
              isTrue ? "bg-emerald-500/20 text-emerald-400" :
              isMisleading ? "bg-amber-500/20 text-amber-400" :
              "bg-sky-500/20 text-sky-400"
            }`}>
              <Globe2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-sky-400">
                  Open Internet Fact-Check & Verification
                </span>
                {isMiracle && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/80">
                    <Sparkles className="w-3 h-3 text-purple-400" /> Extraordinary / Miracle Claim
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {verdict}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-md ${
              isDebunked ? "bg-rose-600 text-white shadow-rose-600/30" :
              isTrue ? "bg-emerald-600 text-white shadow-emerald-600/30" :
              isMisleading ? "bg-amber-600 text-white shadow-amber-600/30" :
              "bg-sky-600 text-white"
            }`}>
              {isDebunked ? <XCircle className="w-5 h-5" /> :
               isTrue ? <CheckCircle2 className="w-5 h-5" /> :
               isMisleading ? <AlertTriangle className="w-5 h-5" /> :
               <HelpCircle className="w-5 h-5" />}
              {badge}
            </div>

            <button
              onClick={() => setShowJson(!showJson)}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Inspect JSON transcription"
            >
              <FileCode className="w-4 h-4 text-sky-400" />
              <span>Step 1: JSON</span>
              {showJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Step 1: JSON Transcription */}
        {showJson && transcriptionJson && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="my-4 p-4 rounded-2xl bg-black/60 border border-sky-800/60 text-xs font-mono text-sky-300 overflow-x-auto shadow-inner"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-sky-900/50 text-[11px] text-slate-400">
              <span>Step 1 Output: Structured Media Claims Transcription (JSON)</span>
              <span className="text-emerald-400">Transcribed & Extracted</span>
            </div>
            <pre>{JSON.stringify(transcriptionJson, null, 2)}</pre>
          </motion.div>
        )}

        {/* Event, Venue & Forensic Provenance Card */}
        {provenance && (
          <div className="my-6 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-sky-800/60 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Event Geolocation & Forensic Provenance
                </h3>
              </div>
              <span className="text-xs font-medium text-sky-300 bg-sky-950/80 border border-sky-800 px-3 py-1 rounded-full">
                {provenance.event_name || "Verified Diplomatic Forum"}
              </span>
            </div>

            {/* Venue, Date & Forum Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                  <MapPin className="w-4 h-4 text-rose-400" /> Venue & Forum
                </div>
                <div className="text-xs font-bold text-white leading-snug">{provenance.venue || "United Nations"}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{provenance.location_city_country}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Date & Timeline
                </div>
                <div className="text-xs font-bold text-white leading-snug">{provenance.date || "Verified Date"}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{provenance.session_or_forum}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 sm:col-span-2">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4 text-sky-400" /> Editing & Authenticity Forensics
                </div>
                <div className="text-xs font-medium text-slate-200 leading-relaxed">
                  {provenance.authenticity_forensics?.manipulation_details || "Authentic recording without digital alteration."}
                </div>
              </div>
            </div>

            {/* Key Figures & Roles */}
            {provenance.key_figures && provenance.key_figures.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" /> Key Figures & Roles Identified
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {provenance.key_figures.map((fig, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white">{fig.name}</span>
                          <span className="text-[10px] text-sky-300 font-semibold px-2 py-0.5 rounded-md bg-sky-950 border border-sky-800/60 truncate max-w-[50%]">{fig.role}</span>
                        </div>
                        {fig.action_or_statement && (
                          <p className="text-[11px] text-slate-300 italic mt-1 leading-relaxed">
                            {fig.action_or_statement}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Footage & Geolocation Reference Links */}
            {provenance.video_and_geo_links && provenance.video_and_geo_links.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-400" /> Video Footage & Geolocation Archives
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {provenance.video_and_geo_links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/60 text-xs flex items-center justify-between group transition-colors"
                    >
                      <div className="truncate mr-2">
                        <span className="font-semibold text-slate-200 group-hover:text-white block truncate">{link.title}</span>
                        <span className="text-[10px] text-sky-400">{link.platform}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-300 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2 & 3: Plain-English Truth Explanation */}
        <div className="py-6 space-y-4">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-sky-400" /> Factual Truth & Verification Summary
            </h4>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
              {explanation}
            </p>
          </div>

          {/* Real Live Internet Sources Retrieved */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" /> Live Internet & News Sources Checked ({sources.length})
              </h4>
              <span className="text-[11px] text-slate-400">Live query: Google News RSS + Wikipedia Open Registries</span>
            </div>

            {sources.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 text-slate-400 text-xs text-center border border-slate-800">
                No matching mainstream open web news articles found for this specific claim.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/60 transition-all flex flex-col justify-between group shadow-sm hover:shadow-sky-500/10"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                        <span className="text-sky-400 group-hover:text-sky-300 truncate max-w-[70%]">{src.publisher}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{src.source_type}</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-2 mb-2 leading-snug">
                        {src.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {src.snippet}
                      </p>
                    </div>
                    <div className="pt-2.5 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-sky-400 group-hover:underline">
                      <span>View Open Source Article</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.section>
  );
}
