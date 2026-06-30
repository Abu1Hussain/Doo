/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { soundSystem } from "../utils/audio";
import { AlertTriangle, ShieldCheck, User, Shield, RefreshCw, Zap, Plus, Trash2 } from "lucide-react";
import { Assumption, DiffRow } from "../types";

interface DriftMonitorProps {
  originalAssumptions: Assumption[];
  currentReality: { [key: string]: string };
  onRealityChange: (field: string, newValue: string) => void;
  onAddAssumption: (field: string, defaultValue: string) => void;
  onRemoveAssumption: (id: string) => void;
  confidenceScore: number;
  decisionMode: string;
  reasoningSummary: string;
  suggestedAction: string;
  diffRows: DiffRow[];
  isAnalyzing: boolean;
  onAnalyzeTrigger: () => void;
}

export default function DriftMonitor({
  originalAssumptions,
  currentReality,
  onRealityChange,
  onAddAssumption,
  onRemoveAssumption,
  confidenceScore,
  decisionMode,
  reasoningSummary,
  suggestedAction,
  diffRows,
  isAnalyzing,
  onAnalyzeTrigger,
}: DriftMonitorProps) {
  const [activePanel, setActivePanel] = useState<"original" | "reality" | "gauge" | null>(null);
  const [newField, setNewField] = useState("");
  const [newValue, setNewValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Status color helpers
  const getStatusColor = () => {
    if (confidenceScore >= 80) return "#22c55e"; // green
    if (confidenceScore >= 40) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const getStatusTextClass = () => {
    if (confidenceScore >= 80) return "text-emerald-500";
    if (confidenceScore >= 40) return "text-amber-500";
    return "text-rose-500";
  };

  const getStatusBorderClass = () => {
    if (confidenceScore >= 80) return "border-emerald-500/30";
    if (confidenceScore >= 40) return "border-amber-500/30";
    return "border-rose-500/30";
  };

  const getStatusBgClass = () => {
    if (confidenceScore >= 80) return "bg-emerald-950/10";
    if (confidenceScore >= 40) return "bg-amber-950/10";
    return "bg-rose-950/10";
  };

  // Sonar gauge parameters
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (confidenceScore / 100) * circumference;

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newField || !newValue) return;
    soundSystem.playClick();
    onAddAssumption(newField, newValue);
    setNewField("");
    setNewValue("");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Upper Panel: Split Comparative View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative">
        
        {/* LEFT PANEL: Original Assumptions (Locked Static Archive) */}
        <div
          id="panel-original-assumptions"
          onClick={() => {
            soundSystem.playClick();
            setActivePanel("original");
          }}
          className={`lg:col-span-5 border transition-all duration-300 p-4 bg-[#0a0a0f] rounded-lg relative overflow-hidden select-none cursor-pointer ${
            activePanel === "original"
              ? "border-cyan-500/50 shadow-[0_0_12px_1px_rgba(6,182,212,0.15)]"
              : "border-cyan-950/30"
          }`}
        >
          {/* Frozen hatched texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-repeat" 
               style={{ backgroundImage: "repeating-linear-gradient(45deg, #22d3ee 0, #22d3ee 1px, transparent 0, transparent 50%)", backgroundSize: "8px 8px" }} />
          
          <div className="flex justify-between items-center border-b border-cyan-950 pb-2 mb-4">
            <span className="text-3xs font-mono uppercase tracking-widest text-cyan-600">ARCHIVED PARADIGM</span>
            <span className="text-3xs font-mono text-gray-500">[PLANNING TIMESTEP: T-0]</span>
          </div>

          <h3 className="font-display font-medium text-sm text-gray-400 mb-3 uppercase tracking-wider">
            Original Assumptions
          </h3>

          <div className="flex flex-col gap-3">
            {originalAssumptions.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-2 rounded bg-cyan-950/5 border border-cyan-950/10 opacity-70 hover:opacity-90 transition-opacity"
              >
                <div className="flex flex-col">
                  <span className="text-3xs font-mono text-cyan-600 uppercase tracking-wider">
                    {item.field}
                  </span>
                  <span className="text-2xs text-gray-400 font-sans max-w-xs leading-snug">
                    {item.description}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-500">
                  <span className="font-semibold">{item.value}</span>
                  <span className="text-4xs text-cyan-700">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER CONDUIT DIVIDER: Active Differential Analyzer */}
        <div className="lg:col-span-2 flex lg:flex-col items-center justify-center py-2 lg:py-0 text-cyan-600 font-mono text-4xs relative">
          <div className="hidden lg:block h-full w-[1px] border-l border-dashed border-cyan-900/40 relative">
            {/* Visual pulses running along connector lines */}
            <div className="absolute top-1/4 left-[-1.5px] w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
            <div className="absolute top-2/4 left-[-1.5px] w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div className="lg:my-4 border border-cyan-800/20 px-2 py-1 rounded bg-[#0a0a0e] uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-500 animate-pulse" />
            <span>DIFF_MATRIX</span>
          </div>
          <div className="hidden lg:block h-full w-[1px] border-l border-dashed border-cyan-900/40" />
        </div>

        {/* RIGHT PANEL: Current Observed Reality (Saturated Live Console) */}
        <div
          id="panel-observed-reality"
          onClick={() => {
            soundSystem.playClick();
            setActivePanel("reality");
          }}
          className={`lg:col-span-5 border transition-all duration-300 p-4 bg-[#0a0a0f] rounded-lg relative overflow-hidden cursor-pointer ${
            activePanel === "reality"
              ? "border-cyan-500/50 shadow-[0_0_12px_1px_rgba(6,182,212,0.15)]"
              : "border-cyan-950/30"
          }`}
        >
          <div className="flex justify-between items-center border-b border-cyan-950/50 pb-2 mb-4">
            <span className="text-3xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              LIVE TELEMETRY FEED
            </span>
            <span className="text-3xs font-mono text-cyan-500/80">[REALTIME OVERRIDE]</span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <h3 className="font-display font-medium text-sm text-cyan-200 uppercase tracking-wider">
              Current Environment Reality
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundSystem.playClick();
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center gap-1 text-4xs uppercase tracking-widest text-cyan-400 hover:text-cyan-200 border border-cyan-800/30 hover:border-cyan-400/50 px-2 py-0.5 rounded transition-all"
            >
              <Plus className="w-2.5 h-2.5" /> ADD PARAM
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddNew} className="mb-4 p-2.5 border border-cyan-900/30 bg-[#0c0c14] rounded flex flex-col gap-2 animate-fade-in">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Param ID (e.g. Rate Limit)"
                  value={newField}
                  onChange={(e) => setNewField(e.target.value)}
                  className="font-mono text-2xs bg-black border border-cyan-950 focus:border-cyan-400 p-1.5 text-cyan-300 rounded outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Current Value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="font-mono text-2xs bg-black border border-cyan-950 focus:border-cyan-400 p-1.5 text-cyan-300 rounded outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-1.5 text-4xs">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-2 py-1 border border-cyan-900/30 text-gray-500 hover:text-gray-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-cyan-950 border border-cyan-400/40 hover:bg-cyan-900/50 text-cyan-300 rounded"
                >
                  ADD FIELD
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-3">
            {originalAssumptions.map((item) => {
              const diff = diffRows.find((d) => d.field === item.field);
              const isDrifted = diff ? diff.drifted : false;
              const curValue = currentReality[item.field] !== undefined ? currentReality[item.field] : item.value;

              return (
                <div
                  key={item.id}
                  className={`flex justify-between items-center p-2 rounded transition-all duration-300 ${
                    isDrifted
                      ? "bg-rose-950/10 border border-rose-500/20"
                      : "bg-[#0b0b12] border border-cyan-950/10 hover:border-cyan-800/20"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isDrifted && (
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse-slow" />
                    )}
                    <span className={`text-3xs font-mono uppercase ${isDrifted ? "text-rose-400" : "text-cyan-400"}`}>
                      {item.field}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Interactive inputs to update the observed reality */}
                    {item.type === "boolean" ? (
                      <select
                        value={curValue}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          soundSystem.playClick();
                          onRealityChange(item.field, e.target.value);
                        }}
                        className="font-mono text-2xs bg-black border border-cyan-950 hover:border-cyan-800 text-cyan-300 p-1 rounded outline-none"
                      >
                        <option value="true">TRUE</option>
                        <option value="false">FALSE</option>
                      </select>
                    ) : (
                      <input
                        type={item.type === "number" ? "text" : "text"}
                        value={curValue}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          onRealityChange(item.field, e.target.value);
                        }}
                        className="font-mono text-2xs bg-black border border-cyan-950 hover:border-cyan-800 focus:border-cyan-400 text-cyan-300 p-1 text-right w-24 rounded outline-none transition-colors"
                      />
                    )}
                    <span className="text-4xs text-cyan-700 font-mono uppercase">{item.unit}</span>

                    {/* Trash can for custom properties */}
                    {item.id.startsWith("custom-") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          soundSystem.playClick();
                          onRemoveAssumption(item.id);
                        }}
                        className="text-gray-600 hover:text-rose-400 p-0.5 transition-colors"
                        title="Delete custom property"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Lower Panel: Sonar Gauge, Status & AI Reasoning Core */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border border-cyan-950/20 p-5 bg-[#08080d] rounded-lg relative overflow-hidden select-none">
        
        {/* Left Side: Circular Sonar Dial */}
        <div
          id="panel-sonar-gauge"
          onClick={() => {
            soundSystem.playClick();
            setActivePanel("gauge");
          }}
          className={`md:col-span-4 flex flex-col items-center justify-center p-3 rounded-md border transition-all cursor-pointer ${
            activePanel === "gauge" ? "border-cyan-500/30 bg-[#0a0a11]" : "border-transparent"
          }`}
        >
          <span className="text-4xs font-mono text-cyan-600 uppercase tracking-widest mb-3">CONVERGENCE RATIO</span>

          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Ambient background pulsing rings */}
            <div className={`absolute inset-0 rounded-full border border-dashed border-cyan-950/40 animate-[spin_60s_linear_infinite]`} />
            <div className="absolute w-[80%] h-[80%] rounded-full border border-cyan-950/15" />
            <div className="absolute w-[60%] h-[60%] rounded-full border border-cyan-950/10" />

            {/* Glowing breathing ring matching current state */}
            <div
              className={`absolute inset-0 rounded-full border transition-opacity duration-1000 ${
                confidenceScore < 80 ? "opacity-10 animate-pulse" : "opacity-0"
              }`}
              style={{
                borderColor: getStatusColor(),
                boxShadow: `0 0 16px 2px ${getStatusColor()}`,
              }}
            />

            {/* Sonar sweep radial needle */}
            <div
              className="absolute w-1/2 h-0.5 origin-left bg-gradient-to-r from-transparent to-cyan-500/50"
              style={{
                left: "50%",
                top: "50%",
                transform: `rotate(${(confidenceScore / 100) * 360 - 90}deg)`,
                transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)",
              }}
            />

            {/* Real SVG arc meter */}
            <svg className="w-32 h-32 transform -rotate-90">
              {/* background ring */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-cyan-950/20 fill-none"
                strokeWidth="5"
              />
              {/* active progress arc */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="fill-none transition-all duration-500 ease-out"
                strokeWidth="5.5"
                stroke={getStatusColor()}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Center score digits */}
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-3xl font-bold tracking-tighter text-white">
                {confidenceScore}
                <span className="text-xs text-gray-500">%</span>
              </span>
              <span className="text-5xs font-mono text-cyan-600 tracking-widest uppercase">CONFIDENCE</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center gap-1 text-center">
            <span className={`text-xs font-mono uppercase font-bold tracking-widest ${getStatusTextClass()}`}>
              {decisionMode}
            </span>
            <span className="text-5xs font-mono text-cyan-700 uppercase">SYS COGNITIVE STRATEGY</span>
          </div>
        </div>

        {/* Right Side: AI Reasoning / Diagnostics Console */}
        <div className="md:col-span-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-cyan-950/20 pt-4 md:pt-0 md:pl-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-4xs font-mono text-cyan-600 uppercase tracking-widest">COGNITIVE ANALYSIS TERMINAL</span>
              <h4 className="font-display font-medium text-xs sm:text-sm text-cyan-100 mt-1 uppercase tracking-wider">
                Telemetry Diagnostics Report
              </h4>
            </div>

            {/* Large trigger analyze button */}
            <button
              onClick={() => {
                soundSystem.playClick();
                onAnalyzeTrigger();
              }}
              disabled={isAnalyzing}
              className={`flex items-center gap-2 font-mono text-3xs border rounded px-3 py-1.5 transition-all cursor-pointer hover:bg-cyan-950/30 ${
                isAnalyzing
                  ? "border-cyan-800 text-cyan-600 bg-cyan-950/10 cursor-not-allowed"
                  : "border-cyan-500/40 text-cyan-400 hover:border-cyan-300 hover:text-cyan-200"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
              {isAnalyzing ? "RUNNING COGNITIVE EVAL..." : "EXECUTE RE-EVALUATION"}
            </button>
          </div>

          {/* Reasoning summary text area styled as scrolling diagnostic monitor */}
          <div className="bg-[#050508] border border-cyan-950/30 rounded p-3 h-28 overflow-y-auto mb-3 text-2xs font-mono leading-relaxed relative">
            {/* Diagnostic loading scan shimmer sweep */}
            {isAnalyzing && (
              <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-500/50 shadow-[0_0_10px_#22d3ee] animate-[scanline-drift_1.5s_linear_infinite]" />
            )}
            
            {isAnalyzing ? (
              <div className="text-cyan-500 flex flex-col gap-1.5 h-full justify-center items-center">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-3xs uppercase tracking-widest animate-pulse-slow">Querying Gemini Cognitive Core...</span>
              </div>
            ) : (
              <div className="text-gray-300">
                <span className="text-cyan-600 font-semibold mr-1.5">[DIAG_REPORT]</span>
                {reasoningSummary}
              </div>
            )}
          </div>

          {/* Operational suggested action box */}
          <div className={`p-3 border rounded flex gap-3 items-center ${getStatusBgClass()} ${getStatusBorderClass()}`}>
            <div className={`p-1.5 rounded-full ${getStatusBgClass()}`}>
              {confidenceScore >= 80 ? (
                <ShieldCheck className={`w-4 h-4 ${getStatusTextClass()}`} />
              ) : confidenceScore >= 40 ? (
                <Shield className={`w-4 h-4 ${getStatusTextClass()}`} />
              ) : (
                <AlertTriangle className={`w-4 h-4 ${getStatusTextClass()} animate-pulse`} />
              )}
            </div>
            <div className="flex-1">
              <span className="text-4xs font-mono text-cyan-600 uppercase tracking-widest block">SUGGESTED ENGINE ACTION</span>
              <p className="font-sans text-2xs text-gray-300 leading-snug font-medium">
                {suggestedAction}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
