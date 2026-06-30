/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { soundSystem } from "./utils/audio";
import { Assumption, DiffRow, LogEntry, DriftAnalysisResult, TreeItem } from "./types";
import { scenarioPresets } from "./components/Blueprints";

// Component imports
import BootSequence from "./components/BootSequence";
import ClickSpark from "./components/ClickSpark";
import HudCursor from "./components/HudCursor";
import DriftMonitor from "./components/DriftMonitor";
import DecisionSliders from "./components/DecisionSliders";
import Blueprints from "./components/Blueprints";
import Timeline from "./components/Timeline";
import Folder from "./components/Folder";
import Footer from "./components/Footer";

// Icon imports
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Trophy,
  Repeat,
  Terminal,
  Shield,
  Layers,
  Cpu,
  RotateCcw,
  BookOpen,
} from "lucide-react";

// Initial paradigm assumptions
const initialAssumptionsList: Assumption[] = [
  {
    id: "1",
    field: "Approved Budget",
    value: "10000",
    unit: "USD",
    description: "The ceiling allowed for high-risk transactional operations.",
    type: "number",
  },
  {
    id: "2",
    field: "Current Cloud Spend",
    value: "4500",
    unit: "USD",
    description: "Real-time billing index logged by cloud service providers.",
    type: "number",
  },
  {
    id: "3",
    field: "Database Instances",
    value: "4",
    unit: "VMS",
    description: "Core virtual database clusters active on operational cluster.",
    type: "number",
  },
  {
    id: "4",
    field: "Schema Matching",
    value: "true",
    unit: "STATUS",
    description: "Integrity check ensuring external response types align.",
    type: "boolean",
  },
];

// Interactive visual codebase folder tree
const codebaseTree: TreeItem = {
  name: "adaptive-agent",
  type: "folder",
  children: [
    {
      name: "src",
      type: "folder",
      children: [
        {
          name: "agent",
          type: "folder",
          children: [
            { name: "drift-detector.ts", type: "file" },
            { name: "confidence-engine.ts", type: "file" },
            { name: "decision-policy.ts", type: "file" },
          ],
        },
        {
          name: "components",
          type: "folder",
          children: [
            { name: "DriftMonitor.tsx", type: "file" },
            { name: "DecisionSliders.tsx", type: "file" },
            { name: "Blueprints.tsx", type: "file" },
            { name: "Timeline.tsx", type: "file" },
            { name: "Folder.tsx", type: "file" },
            { name: "BootSequence.tsx", type: "file" },
            { name: "HudCursor.tsx", type: "file" },
            { name: "ClickSpark.tsx", type: "file" },
            { name: "Footer.tsx", type: "file" },
          ],
        },
        {
          name: "utils",
          type: "folder",
          children: [{ name: "audio.ts", type: "file" }],
        },
        { name: "App.tsx", type: "file" },
        { name: "index.css", type: "file" },
        { name: "main.tsx", type: "file" },
      ],
    },
    { name: "server.ts", type: "file" },
    { name: "package.json", type: "file" },
    { name: "metadata.json", type: "file" },
  ],
};

export default function App() {
  const [isBooted, setIsBooted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Core Agent Telemetry State
  const [originalAssumptions, setOriginalAssumptions] = useState<Assumption[]>(initialAssumptionsList);
  const [currentReality, setCurrentReality] = useState<{ [key: string]: string }>({
    "Approved Budget": "10000",
    "Current Cloud Spend": "4500",
    "Database Instances": "4",
    "Schema Matching": "true",
  });

  // Slider adjustments
  const [driftSensitivity, setDriftSensitivity] = useState(50);
  const [autonomyCeiling, setAutonomyCeiling] = useState(3);
  const [reversalCooldown, setReversalCooldown] = useState(5);

  // Computed Cognitive Results
  const [confidenceScore, setConfidenceScore] = useState(100);
  const [decisionMode, setDecisionMode] = useState<"PROCEEDING" | "AWAITING CONFIRMATION" | "ESCALATED TO HUMAN">("PROCEEDING");
  const [reasoningSummary, setReasoningSummary] = useState(
    "All telemetry nodes online. Continuous convergence loop in green bounds. Original planning blueprint remains fully functional."
  );
  const [suggestedAction, setSuggestedAction] = useState(
    "Maintain original campaign schedule and baseline execution paths."
  );
  const [diffRows, setDiffRows] = useState<DiffRow[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Cooldown countdown lock states
  const [isCooldownCounting, setIsCooldownCounting] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [cooldownProgress, setCooldownProgress] = useState(0);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mute audio handler
  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    soundSystem.setMuted(nextMuted);
    soundSystem.playClick();
  };

  // Toggle Theme handler
  const handleToggleTheme = () => {
    soundSystem.playClick();
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    const doc = document.documentElement;
    if (nextTheme === "light") {
      doc.classList.add("light");
    } else {
      doc.classList.remove("light");
    }
  };

  // Preset Scenario loader callback
  const handleSelectScenario = (preset: typeof scenarioPresets[0]) => {
    setActiveScenarioId(preset.id);
    
    // Set matching original and updated assumptions
    const updatedOriginals = preset.originalAssumptions.map((orig, i) => {
      const match = originalAssumptions.find(a => a.field === orig.field);
      return {
        id: match?.id || `preset-${i}`,
        field: orig.field,
        value: orig.value,
        unit: match?.unit || "STATUS",
        description: match?.description || "Preset-loaded criteria.",
        type: (orig.value === "true" || orig.value === "false") ? "boolean" : "number"
      } as Assumption;
    });

    setOriginalAssumptions(updatedOriginals);
    setCurrentReality(preset.currentReality);
  };

  // Add custom assumption row
  const handleAddAssumption = (field: string, defaultValue: string) => {
    const isBool = defaultValue === "true" || defaultValue === "false";
    const newAss: Assumption = {
      id: `custom-${Date.now()}`,
      field,
      value: defaultValue,
      unit: isBool ? "STATUS" : "QTY",
      description: `User-defined environmental telemetry constraint.`,
      type: isBool ? "boolean" : "number"
    };
    
    setOriginalAssumptions([...originalAssumptions, newAss]);
    setCurrentReality(prev => ({
      ...prev,
      [field]: defaultValue
    }));
  };

  // Remove custom assumption row
  const handleRemoveAssumption = (id: string) => {
    const item = originalAssumptions.find(a => a.id === id);
    if (!item) return;
    setOriginalAssumptions(originalAssumptions.filter(a => a.id !== id));
    setCurrentReality(prev => {
      const next = { ...prev };
      delete next[item.field];
      return next;
    });
  };

  // Observed reality update handler (zero-latency local calculation trigger)
  const handleRealityChange = (field: string, newValue: string) => {
    soundSystem.playClick();
    setCurrentReality(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  // Run Local (Zero-Latency) Heuristics Loop
  // Updates circular dials immediately on input adjustments so UI remains super responsive
  useEffect(() => {
    const diffs: DiffRow[] = originalAssumptions.map((item) => {
      const curVal = currentReality[item.field] !== undefined ? currentReality[item.field] : item.value;
      const drifted = String(item.value).trim().toLowerCase() !== String(curVal).trim().toLowerCase();
      return {
        field: item.field,
        original: item.value,
        current: curVal,
        drifted,
        severity: drifted ? "high" : "none",
      };
    });

    setDiffRows(diffs);

    const driftedCount = diffs.filter((d) => d.drifted).length;
    // Calculate simulated confidence score based on drifted counts and sliders
    const baseConfidence = 100 - (driftedCount * driftSensitivity * 0.4);
    const computedScore = Math.max(0, Math.min(100, Math.round(baseConfidence)));

    let mode: "PROCEEDING" | "AWAITING CONFIRMATION" | "ESCALATED TO HUMAN" = "PROCEEDING";
    if (computedScore < 40) {
      mode = "ESCALATED TO HUMAN";
    } else if (computedScore < 80) {
      mode = "AWAITING CONFIRMATION";
    }

    // Apply Autonomy Ceiling modifiers
    if (driftedCount > 0) {
      if (autonomyCeiling === 1) {
        mode = "AWAITING CONFIRMATION";
      } else if (autonomyCeiling === 5 && mode === "AWAITING CONFIRMATION") {
        mode = "PROCEEDING";
      }
    }

    setConfidenceScore(computedScore);
    setDecisionMode(mode);

    // If values changed, reset active scenario ID since custom drift occurred
    const activePreset = scenarioPresets.find(p => p.id === activeScenarioId);
    if (activePreset) {
      let matches = true;
      for (const field of Object.keys(currentReality)) {
        if (currentReality[field] !== activePreset.currentReality[field]) {
          matches = false;
        }
      }
      if (!matches) {
        setActiveScenarioId(null);
      }
    }

  }, [originalAssumptions, currentReality, driftSensitivity, autonomyCeiling]);

  // Execute Backend-Side Cognitive Deep Analysis (calls Gemini on server.ts)
  const handleExecuteCognitiveAnalysis = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    soundSystem.playDriftDetected();

    const formattedOriginals = originalAssumptions.map((a) => ({
      field: a.field,
      value: a.value,
    }));

    const formattedReality = originalAssumptions.map((a) => ({
      field: a.field,
      value: currentReality[a.field] !== undefined ? currentReality[a.field] : a.value,
    }));

    try {
      const response = await fetch("/api/analyze-drift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalAssumptions: formattedOriginals,
          currentReality: formattedReality,
          driftSensitivity,
          autonomyCeiling,
        }),
      });

      if (!response.ok) {
        throw new Error("Telemetry analysis failed");
      }

      const result: DriftAnalysisResult = await response.json();

      // Update deep analysis states
      setReasoningSummary(result.reasoningSummary);
      setSuggestedAction(result.suggestedAction);
      setConfidenceScore(result.confidenceScore);
      
      const nextMode = result.decisionMode;

      // Handle cooldown plan revision transition
      if (nextMode !== decisionMode && reversalCooldown > 0) {
        triggerCooldownTimer(() => {
          commitRevisionToLogs(result, nextMode);
        });
      } else {
        commitRevisionToLogs(result, nextMode);
      }

    } catch (err) {
      console.error(err);
      setReasoningSummary(
        "[COGNITIVE CONNECTION TIMEOUT] Unable to link with Gemini Analysis Core. Falling back to primary heuristic safety modules."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Plan revision logger callback
  const commitRevisionToLogs = (result: DriftAnalysisResult, nextMode: "PROCEEDING" | "AWAITING CONFIRMATION" | "ESCALATED TO HUMAN") => {
    setDecisionMode(nextMode);

    // Play synthesized chimes corresponding to status boundaries
    if (nextMode === "PROCEEDING") {
      soundSystem.playProceedAutonomous();
    } else if (nextMode === "AWAITING CONFIRMATION") {
      soundSystem.playAwaitingConfirmation();
    } else {
      soundSystem.playEscalatedToHuman();
    }

    // Log the event
    const driftedDiff = result.diffRows.find(r => r.drifted);
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      title: result.driftDetected
        ? `Reality drift mismatch detected on [${driftedDiff?.field || "Parameters"}]`
        : "Operational environmental parameters within bounds.",
      decisionMode: nextMode,
      details: result.reasoningSummary,
      suggestedAction: result.suggestedAction,
      field: driftedDiff?.field,
      originalValue: driftedDiff?.original,
      currentValue: driftedDiff?.current,
    };

    setLogs((prev) => [...prev, newLog]);
  };

  // Cooldown countdown mechanism
  const triggerCooldownTimer = (onFinished: () => void) => {
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
    }

    setIsCooldownCounting(true);
    setCooldownTimeLeft(reversalCooldown);
    setCooldownProgress(1);

    const startTime = Date.now();
    const durationMs = reversalCooldown * 1000;

    cooldownIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingMs = Math.max(0, durationMs - elapsed);
      const remainingSecs = Math.ceil(remainingMs / 1000);

      setCooldownTimeLeft(remainingSecs);
      setCooldownProgress(remainingMs / durationMs);

      if (remainingMs <= 0) {
        clearInterval(cooldownIntervalRef.current!);
        setIsCooldownCounting(false);
        onFinished();
        soundSystem.playPlanRevised();
      }
    }, 100);
  };

  // Clear Timers on unmount
  useEffect(() => {
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  // Run initial diagnostic check when page boots
  useEffect(() => {
    if (isBooted) {
      handleExecuteCognitiveAnalysis();
    }
  }, [isBooted]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* 1. Click Sparks Overlay Canvas */}
      <ClickSpark color={decisionMode === "PROCEEDING" ? "#22c55e" : decisionMode === "AWAITING CONFIRMATION" ? "#f59e0b" : "#ef4444"} />

      {/* 2. Custom HUD Targeting Cursor */}
      <HudCursor />

      {/* 3. Boot Sequence Loader */}
      {!isBooted ? (
        <BootSequence onComplete={() => setIsBooted(true)} />
      ) : (
        <>
          {/* Main Layout Area */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
            
            {/* Ambient Background Grid Patterns */}
            <div className="hud-grid" />
            <div className="hud-scanline-sweep" />
            <div className="hud-scanlines" />

            {/* ==================== SECTION 00 — HEADER BADGE & CHROME ==================== */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cyan-950/40 pb-6 relative">
              <div className="flex items-center gap-4 select-none">
                {/* Loop arrow cycle icon */}
                <div className="w-14 h-14 rounded-xl border border-cyan-500/30 bg-cyan-950/20 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cyan-500/5 group-hover:scale-110 transition-transform" />
                  <Repeat className="w-7 h-7 text-cyan-400 animate-[spin_10s_linear_infinite]" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-950/40 text-purple-400 border border-purple-500/25 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase">
                      OPEN_CHALLENGE
                    </span>
                    <span className="text-4xs font-mono text-gray-500 uppercase tracking-widest">• UNTIL AUG 31</span>
                  </div>

                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight leading-none uppercase">
                    The Adaptive Agent
                  </h1>

                  <p className="font-sans text-3xs sm:text-2xs text-gray-400">
                    Can an AI system recognize that reality changed and safely change its mind?
                  </p>
                </div>
              </div>

              {/* Utility Panel: Reward Pill, Mute & Theme */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Reward Trophy Pill */}
                <div className="flex items-center gap-2 border border-amber-500/30 hover:border-amber-400/50 hover:scale-[1.02] bg-amber-950/5 px-3 py-1.5 rounded-full transition-all text-xs font-semibold text-amber-400 select-none cursor-help"
                     title="AI Studio Adaptation Intelligence Builder Badge Award">
                  <Trophy className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>$500 + Badge Award</span>
                </div>

                {/* Mute Synthesizer audio button */}
                <button
                  onClick={handleToggleMute}
                  className="w-9 h-9 flex items-center justify-center border border-cyan-800/30 hover:border-cyan-400/60 rounded bg-[#0a0a0f] text-cyan-400 hover:text-white transition-all cursor-pointer shadow-sm"
                  title={muted ? "Unmute HUD synthesizers" : "Mute HUD synthesizers"}
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Dark / Light Mode Toggle */}
                <button
                  onClick={handleToggleTheme}
                  className="w-9 h-9 flex items-center justify-center border border-cyan-800/30 hover:border-cyan-400/60 rounded bg-[#0a0a0f] text-cyan-400 hover:text-white transition-all cursor-pointer shadow-sm"
                  title={theme === "dark" ? "Toggle light mode" : "Toggle dark mode"}
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </header>

            {/* ==================== MAIN COGNITIVE STEPS CONTROL (ROW BY ROW) ==================== */}
            <main className="flex flex-col gap-10 w-full">
              
              {/* STEP 01: CHOOSE ADAPTATIVE SCENARIO CONTEXT */}
              <section id="step-01" className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2 select-none">
                  <div className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/25 px-2 py-0.5 rounded tracking-widest uppercase">
                    STEP_01
                  </div>
                  <div className="h-[1px] flex-1 bg-cyan-950/35" />
                  <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest">ADAPTATIVE TEST BLUEPRINT CONTROLS</span>
                </div>
                
                <Blueprints
                  onSelectScenario={handleSelectScenario}
                  activeScenarioId={activeScenarioId}
                />
              </section>

              {/* STEP 02: COMPARE EXPECTATIONS VS LIVE TELEMETRY REALITY */}
              <section id="step-02" className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2 select-none">
                  <div className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/25 px-2 py-0.5 rounded tracking-widest uppercase">
                    STEP_02
                  </div>
                  <div className="h-[1px] flex-1 bg-cyan-950/35" />
                  <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest">REALITY DRIFT MONITOR & DIFFERENTIAL ANALYZER</span>
                </div>

                <DriftMonitor
                  originalAssumptions={originalAssumptions}
                  currentReality={currentReality}
                  onRealityChange={handleRealityChange}
                  onAddAssumption={handleAddAssumption}
                  onRemoveAssumption={handleRemoveAssumption}
                  confidenceScore={confidenceScore}
                  decisionMode={decisionMode}
                  reasoningSummary={reasoningSummary}
                  suggestedAction={suggestedAction}
                  diffRows={diffRows}
                  isAnalyzing={isAnalyzing}
                  onAnalyzeTrigger={handleExecuteCognitiveAnalysis}
                />
              </section>

              {/* STEP 03: DEFINE SENSITIVITY & REVERSAL COOLDOWN PARAMETERS */}
              <section id="step-03" className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2 select-none">
                  <div className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/25 px-2 py-0.5 rounded tracking-widest uppercase">
                    STEP_03
                  </div>
                  <div className="h-[1px] flex-1 bg-cyan-950/35" />
                  <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest">DECISION POLICY CONFIGURATION</span>
                </div>

                <DecisionSliders
                  driftSensitivity={driftSensitivity}
                  onDriftSensitivityChange={setDriftSensitivity}
                  autonomyCeiling={autonomyCeiling}
                  onAutonomyCeilingChange={setAutonomyCeiling}
                  reversalCooldown={reversalCooldown}
                  onReversalCooldownChange={setReversalCooldown}
                  isCooldownCounting={isCooldownCounting}
                  cooldownProgress={cooldownProgress}
                  cooldownTimeLeft={cooldownTimeLeft}
                  onCooldownFinished={handleExecuteCognitiveAnalysis}
                />
              </section>

              {/* STEP 04: WATCH LIVE TIMELINE LOG FEEDS */}
              <section id="step-04" className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2 select-none">
                  <div className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/25 px-2 py-0.5 rounded tracking-widest uppercase">
                    STEP_04
                  </div>
                  <div className="h-[1px] flex-1 bg-cyan-950/35" />
                  <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest">SYSTEM TIMELINE & COGNITIVE FEED</span>
                </div>

                <Timeline
                  logs={logs}
                  onClearLogs={() => {
                    soundSystem.playClick();
                    setLogs([]);
                  }}
                />
              </section>

              {/* STEP 05: EXPLORE CODEBASE ARCHITECTURE SYSTEM MAP */}
              <section id="step-05" className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2 select-none">
                  <div className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/25 px-2 py-0.5 rounded tracking-widest uppercase">
                    STEP_05
                  </div>
                  <div className="h-[1px] flex-1 bg-cyan-950/35" />
                  <span className="text-[9px] font-mono text-cyan-600 uppercase tracking-widest">CODEBASE METRICS ARCHITECTURE MAP</span>
                </div>

                {/* Physical Folder Directory Tree */}
                <div className="border border-cyan-950/20 p-5 bg-[#08080d] rounded-lg">
                  <div className="flex justify-between items-center border-b border-cyan-950/45 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cyan-500" />
                      <h4 className="font-display font-medium text-xs text-cyan-100 uppercase tracking-widest">
                        CODEBASE REPOSITORY
                      </h4>
                    </div>
                    <span className="text-5xs font-mono text-cyan-700">[MAP]</span>
                  </div>
                  <p className="text-4xs text-gray-400 leading-snug font-sans mb-3.5 select-none">
                    Explore physical file tree architecture representing cognitive pipelines. Open folders to inspect dynamic component sources.
                  </p>
                  
                  {/* Render Folder Component recursively */}
                  <div className="border border-cyan-950/30 rounded p-3 bg-[#050508] max-h-[300px] overflow-y-auto">
                    <Folder item={codebaseTree} />
                  </div>
                </div>
              </section>

            </main>
          </div>

          {/* Page Footer and Waves */}
          <Footer />
        </>
      )}
    </div>
  );
}
