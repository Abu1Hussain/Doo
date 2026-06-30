/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { soundSystem } from "../utils/audio";
import { ChevronDown, ChevronUp, Terminal, Circle } from "lucide-react";
import { LogEntry } from "../types";

interface TimelineProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export default function Timeline({ logs, onClearLogs }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll logic matching specifications
  useEffect(() => {
    if (!autoScroll || !containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [logs, autoScroll]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    
    // If user scrolled up by more than 40px from bottom, pause auto scroll. Otherwise, lock to bottom.
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    setAutoScroll(isAtBottom);
  };

  const getStatusColor = (mode: string) => {
    if (mode === "PROCEEDING") return "bg-emerald-500 shadow-[0_0_8px_#10b981]";
    if (mode === "AWAITING CONFIRMATION") return "bg-amber-500 shadow-[0_0_8px_#f59e0b]";
    return "bg-rose-500 shadow-[0_0_8px_#ef4444]";
  };

  const getBorderColor = (mode: string) => {
    if (mode === "PROCEEDING") return "border-emerald-500/20";
    if (mode === "AWAITING CONFIRMATION") return "border-amber-500/20";
    return "border-rose-500/20";
  };

  const toggleExpand = (id: string) => {
    soundSystem.playClick();
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="border border-cyan-950/20 bg-[#08080d] rounded-lg overflow-hidden flex flex-col h-[400px] select-none">
      
      {/* Terminal Window Header Chrome */}
      <div className="flex justify-between items-center bg-[#050508] border-b border-cyan-950/40 px-4 py-2">
        <div className="flex items-center gap-1.5">
          {/* Three small decorative dots (red/amber/green) */}
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          
          <div className="flex items-center gap-1 ml-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span className="font-mono text-3xs font-semibold text-cyan-400 uppercase tracking-widest">
              SYSTEM LOG & ADAPTATION TIMELINE
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Scroll lock indicator */}
          <span className={`font-mono text-5xs px-1 py-0.5 rounded uppercase tracking-wider ${
            autoScroll ? "text-cyan-400 bg-cyan-950/35" : "text-gray-500 bg-gray-950/40"
          }`}>
            {autoScroll ? "AUTO_SCROLL_LOCKED" : "FREE_SCROLL"}
          </span>
          <button
            onClick={() => {
              soundSystem.playClick();
              onClearLogs();
            }}
            className="text-5xs font-mono uppercase text-gray-500 hover:text-rose-400 transition-colors"
          >
            PURGE_CACHE
          </button>
        </div>
      </div>

      {/* Vertical scrollable logger feed */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative"
      >
        {/* Subtle scanline texture overlay matching terminal style */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-repeat" 
             style={{ backgroundImage: "repeating-linear-gradient(rgba(34, 211, 238, 0.15) 0px, rgba(34, 211, 238, 0.15) 1px, transparent 1px, transparent 4px)" }} />

        {logs.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center font-mono text-3xs text-cyan-700 animate-pulse">
            <span>[COGNITIVE FEED READY]</span>
            <span>WAITING FOR ADAPTATIVE DRIFT LOGS...</span>
          </div>
        ) : (
          <div className="relative border-l border-cyan-950/50 pl-5 flex flex-col gap-4">
            
            {logs.map((log) => {
              const isExpanded = expandedLogId === log.id;

              return (
                <div
                  key={log.id}
                  className="relative group animate-fade-in"
                  style={{ animationDuration: "200ms" }}
                >
                  {/* Status node dot along timeline line */}
                  <div className="absolute left-[-26px] top-1.5 flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full border-2 border-[#08080d] transition-all group-hover:scale-125 cursor-pointer ${getStatusColor(log.decisionMode)}`}
                         onClick={() => toggleExpand(log.id)} />
                  </div>

                  {/* Log Card header row */}
                  <div
                    onClick={() => toggleExpand(log.id)}
                    className={`border rounded p-3 bg-[#0a0a0f] cursor-pointer transition-all ${
                      isExpanded
                        ? "border-cyan-500/40 bg-cyan-950/5"
                        : "border-cyan-950/20 hover:border-cyan-500/10 hover:bg-[#0c0c14]"
                    } flex justify-between items-start gap-4`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-3xs text-gray-500">{log.timestamp}</span>
                        <span className={`font-mono text-4xs uppercase font-semibold border px-1 rounded ${getBorderColor(log.decisionMode)}`}>
                          {log.decisionMode}
                        </span>
                      </div>
                      <span className="font-mono text-2xs sm:text-xs text-white font-medium group-hover:text-cyan-300 transition-colors">
                        {log.title}
                      </span>
                    </div>

                    <button className="text-cyan-700 hover:text-cyan-400 p-0.5">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Expandable diagnostic specs table */}
                  {isExpanded && (
                    <div className="mt-1 border border-t-0 border-cyan-950/20 bg-[#06060a] p-3 rounded-b font-mono text-3xs leading-relaxed flex flex-col gap-2.5 animate-slide-down">
                      
                      {/* Comparison table */}
                      {log.field && (
                        <div className="grid grid-cols-3 gap-2 border-b border-cyan-950/45 pb-2 text-gray-400 font-mono">
                          <div>
                            <span className="text-4xs text-cyan-600 block uppercase">PARAM FIELD</span>
                            <span className="text-2xs text-cyan-400">{log.field}</span>
                          </div>
                          <div>
                            <span className="text-4xs text-cyan-600 block uppercase">ORIGINAL EXPECTED</span>
                            <span className="text-2xs text-gray-400">{log.originalValue}</span>
                          </div>
                          <div>
                            <span className="text-4xs text-cyan-600 block uppercase">CURRENT LIVE</span>
                            <span className="text-2xs text-rose-400 font-semibold">{log.currentValue}</span>
                          </div>
                        </div>
                      )}

                      {/* Diagnostic commentary */}
                      <div>
                        <span className="text-4xs text-cyan-500 block uppercase font-bold">COGNITIVE IMPACT & ANALYSIS</span>
                        <p className="text-gray-300 mt-0.5 text-2xs font-sans leading-relaxed">
                          {log.details}
                        </p>
                      </div>

                      {/* Action trigger resolution */}
                      <div className="bg-[#0a0a0f] p-2 border border-cyan-950 rounded">
                        <span className="text-4xs text-cyan-500 block uppercase font-bold">CORRECTIVE ADAPTATION PATH</span>
                        <p className="text-emerald-400 font-sans mt-0.5 text-2xs">
                          {log.suggestedAction}
                        </p>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}
