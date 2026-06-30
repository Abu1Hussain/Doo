/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldAlert, RefreshCw, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { soundSystem } from "../utils/audio";

interface ScenarioPreset {
  id: string;
  name: string;
  badge: string;
  badgeColor: "green" | "amber" | "red";
  description: string;
  rule: string;
  originalAssumptions: { field: string; value: string }[];
  currentReality: { [field: string]: string };
}

export const scenarioPresets: ScenarioPreset[] = [
  {
    id: "budget-drift",
    name: "Budget Reallocation Scenario",
    badge: "HARD BLOCK",
    badgeColor: "red",
    description: "Agent was authorized to execute cloud spend up to $10,000. Finance team reduces approved budget to $6,000 mid-task.",
    rule: "If remaining budget after current spend < new ceiling, agent must pause and request explicit reauthorization before any further spend.",
    originalAssumptions: [
      { field: "Approved Budget", value: "10000" },
      { field: "Current Cloud Spend", value: "4500" },
      { field: "Database Instances", value: "4" },
      { field: "Schema Matching", value: "true" }
    ],
    currentReality: {
      "Approved Budget": "6000",
      "Current Cloud Spend": "6500", // exceeds!
      "Database Instances": "4",
      "Schema Matching": "true"
    }
  },
  {
    id: "api-drift",
    name: "API Contract Drift Scenario",
    badge: "AUTO-PAUSE",
    badgeColor: "amber",
    description: "Agent's plan assumes a third-party API returns field 'status'. API is updated and now returns 'state' instead, breaking schema verification.",
    rule: "If response schema changes by more than the configured tolerance, agent halts execution of dependent steps and flags a schema-mismatch warning.",
    originalAssumptions: [
      { field: "Approved Budget", value: "10000" },
      { field: "Current Cloud Spend", value: "4500" },
      { field: "Database Instances", value: "4" },
      { field: "Schema Matching", value: "true" }
    ],
    currentReality: {
      "Approved Budget": "10000",
      "Current Cloud Spend": "4500",
      "Database Instances": "4",
      "Schema Matching": "false" // drift!
    }
  },
  {
    id: "intent-reversal",
    name: "User Intent Reversal Scenario",
    badge: "IMMEDIATE RE-CHECK",
    badgeColor: "amber",
    description: "User initially asked the agent to 'delete all stale records.' Mid-execution, user sends a message implying they meant only records older than 1 year, not all.",
    rule: "Any instruction that narrows or reverses a destructive action's scope takes immediate precedence; agent must re-confirm scope before continuing.",
    originalAssumptions: [
      { field: "Approved Budget", value: "10000" },
      { field: "Current Cloud Spend", value: "4500" },
      { field: "Database Instances", value: "4" },
      { field: "Schema Matching", value: "true" }
    ],
    currentReality: {
      "Approved Budget": "10000",
      "Current Cloud Spend": "4500",
      "Database Instances": "8", // drift! more DB instances running than assumed, widening destructive risk!
      "Schema Matching": "true"
    }
  },
  {
    id: "stable-env",
    name: "Stable Environment Scenario",
    badge: "AUTO-PROCEED",
    badgeColor: "green",
    description: "Agent observes only cosmetic, non-functional changes (e.g., a UI label renamed, log format adjusted).",
    rule: "Cosmetic-only drift below the sensitivity threshold does not interrupt execution; agent logs the change and proceeds with the original plan.",
    originalAssumptions: [
      { field: "Approved Budget", value: "10000" },
      { field: "Current Cloud Spend", value: "4500" },
      { field: "Database Instances", value: "4" },
      { field: "Schema Matching", value: "true" }
    ],
    currentReality: {
      "Approved Budget": "10000",
      "Current Cloud Spend": "4500",
      "Database Instances": "4",
      "Schema": "true"
    }
  }
];

interface BlueprintsProps {
  onSelectScenario: (preset: ScenarioPreset) => void;
  activeScenarioId: string | null;
}

export default function Blueprints({ onSelectScenario, activeScenarioId }: BlueprintsProps) {
  const getBadgeClass = (color: "green" | "amber" | "red") => {
    switch (color) {
      case "green":
        return "bg-emerald-950/40 text-emerald-400 border-emerald-500/20";
      case "amber":
        return "bg-amber-950/40 text-amber-400 border-amber-500/20";
      case "red":
        return "bg-rose-950/40 text-rose-400 border-rose-500/20";
    }
  };

  const getCardBorderClass = (preset: ScenarioPreset) => {
    if (activeScenarioId === preset.id) {
      return "border-cyan-400 bg-cyan-950/10 shadow-[0_0_12px_rgba(6,182,212,0.1)]";
    }
    return "border-cyan-950/30 bg-[#08080d] hover:border-cyan-500/20 hover:-translate-y-[2px]";
  };

  return (
    <div className="flex flex-col gap-4 select-none">
      <div className="flex justify-between items-center border-b border-cyan-950/40 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-500" />
          <h4 className="font-display font-medium text-sm text-cyan-100 uppercase tracking-wider">
            Sector Adaptation Blueprints
          </h4>
        </div>
        <span className="text-4xs font-mono text-cyan-600 uppercase tracking-widest">[MISSION_DOUBLER_CARDS]</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarioPresets.map((preset) => (
          <div
            key={preset.id}
            onClick={() => {
              soundSystem.playClick();
              onSelectScenario(preset);
            }}
            className={`border rounded-lg p-4 transition-all duration-300 flex flex-col justify-between cursor-pointer group ${getCardBorderClass(
              preset
            )}`}
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-2.5">
                <span className="font-mono text-4xs text-cyan-500 font-bold uppercase tracking-widest">
                  CASE MODULE: {preset.id.replace("-", "_").toUpperCase()}
                </span>
                <span
                  className={`text-[9px] font-mono border rounded px-1.5 py-0.5 uppercase font-semibold ${getBadgeClass(
                    preset.badgeColor
                  )}`}
                >
                  {preset.badge}
                </span>
              </div>

              <h5 className="font-display font-medium text-xs sm:text-sm text-white mb-2 group-hover:text-cyan-300 transition-colors">
                {preset.name}
              </h5>

              <p className="text-2xs text-gray-400 leading-relaxed font-sans mb-3.5">
                {preset.description}
              </p>
            </div>

            <div className="border-t border-cyan-950/45 pt-3 mt-1 text-4xs font-mono text-cyan-600">
              <span className="font-semibold text-cyan-500 block mb-1">SAFETY RULES:</span>
              <p className="text-gray-400 italic font-sans leading-relaxed text-3xs">
                &quot;{preset.rule}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
