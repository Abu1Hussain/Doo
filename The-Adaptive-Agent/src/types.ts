/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Assumption {
  id: string;
  field: string;
  value: string;
  unit: string;
  description: string;
  type: "number" | "string" | "boolean";
}

export interface DiffRow {
  field: string;
  original: string;
  current: string;
  drifted: boolean;
  severity: "none" | "low" | "medium" | "high";
}

export interface DriftAnalysisResult {
  driftDetected: boolean;
  driftSeverity: "low" | "medium" | "high";
  confidenceScore: number;
  decisionMode: "PROCEEDING" | "AWAITING CONFIRMATION" | "ESCALATED TO HUMAN";
  reasoningSummary: string;
  suggestedAction: string;
  diffRows: DiffRow[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  title: string;
  decisionMode: "PROCEEDING" | "AWAITING CONFIRMATION" | "ESCALATED TO HUMAN";
  details: string;
  suggestedAction: string;
  originalValue?: string;
  currentValue?: string;
  field?: string;
}

export interface TreeItem {
  name: string;
  type: "folder" | "file";
  children?: TreeItem[];
  codeSnippet?: string;
}
