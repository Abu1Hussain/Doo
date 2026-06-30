import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoint: Analyze Drift using Gemini
  app.post("/api/analyze-drift", async (req, res) => {
    const { originalAssumptions, currentReality, driftSensitivity, autonomyCeiling } = req.body;

    const runHeuristicFallback = (reasonPrefix: string) => {
      const diffRows = originalAssumptions.map((orig: any) => {
        // Find corresponding reality value
        const curr = currentReality.find((c: any) => c.field === orig.field) || orig;
        const drifted = String(orig.value).trim().toLowerCase() !== String(curr.value).trim().toLowerCase();
        return {
          field: orig.field,
          original: String(orig.value),
          current: String(curr.value),
          drifted,
          severity: drifted ? "high" : "none"
        };
      });

      const driftedCount = diffRows.filter((r: any) => r.drifted).length;
      const baseConfidence = 100 - (driftedCount * (Number(driftSensitivity) || 50) * 0.4);
      const confidenceScore = Math.max(0, Math.min(100, Math.round(baseConfidence)));

      let decisionMode = "PROCEEDING";
      if (confidenceScore < 40) {
        decisionMode = "ESCALATED TO HUMAN";
      } else if (confidenceScore < 80) {
        decisionMode = "AWAITING CONFIRMATION";
      }

      // Apply Autonomy Ceiling modifiers
      if (driftedCount > 0) {
        if (autonomyCeiling === 1) {
          decisionMode = "AWAITING CONFIRMATION";
        } else if (autonomyCeiling === 5 && decisionMode === "AWAITING CONFIRMATION") {
          decisionMode = "PROCEEDING";
        }
      }

      return {
        driftDetected: driftedCount > 0,
        driftSeverity: driftedCount > 2 ? "high" : driftedCount > 0 ? "medium" : "low",
        confidenceScore,
        decisionMode,
        reasoningSummary: `${reasonPrefix} [HYBRID STANDBY MODULE ACTIVE] Drift sensitivity is at ${driftSensitivity}%. Environmental telemetry indicates a variance of ${driftedCount} parameters out of ${originalAssumptions.length}. Heuristic analysis successfully matched the reality bounds.`,
        suggestedAction: driftedCount > 0 
          ? "Initiate defensive contingency protocols. Hold standard sub-routines, log environmental parameters, and alert central command for plan optimization."
          : "No substantial variance detected. Continue with original operational blueprint.",
        diffRows
      };
    };

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json(runHeuristicFallback("[DEMO OFFLINE COGNITIVE FEED]"));
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
        Analyze the discrepancy (reality drift) between the agent's ORIGINAL ASSUMPTIONS and the CURRENT OBSERVED REALITY.
        
        Original Assumptions:
        ${JSON.stringify(originalAssumptions, null, 2)}
        
        Current Observed Reality:
        ${JSON.stringify(currentReality, null, 2)}
        
        Parameters:
        - Drift Sensitivity (0 to 100, where 100 is highly sensitive to any change): ${driftSensitivity}
        - Autonomy Ceiling (1 to 5, where 1 is "ALWAYS ASK" and 5 is "FULLY AUTONOMOUS"): ${autonomyCeiling}

        Rule guidelines:
        - 80-100% confidence: agent proceeds silently (PROCEEDING).
        - 40-79% confidence: agent pauses and requests confirmation (AWAITING CONFIRMATION).
        - 0-39% confidence: agent halts and escalates to human (ESCALATED TO HUMAN).
        
        Account for the drift sensitivity and autonomy ceiling.
        At Level 1 ("ALWAYS ASK"), any change (even low drift) should force "AWAITING CONFIRMATION" or "ESCALATED TO HUMAN".
        At Level 5 ("FULLY AUTONOMOUS"), the agent should resolve high drift autonomously and stay "PROCEEDING" unless there's an absolute mission-critical failure.

        Respond strictly using the required JSON schema structure.
        Ensure reasoningSummary sounds like an advanced AI agent telemetry log: high-tech, slightly clinical, logical, and highly accurate based on the inputs.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are the Tactical Analysis Core of 'The Adaptive Agent' command center. You evaluate discrepancies between original plan parameters and current live telemetry to determine if the agent can safely continue, must pause, or must escalate to human command.",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              driftDetected: { type: Type.BOOLEAN },
              driftSeverity: { type: Type.STRING },
              confidenceScore: { type: Type.INTEGER },
              decisionMode: { type: Type.STRING },
              reasoningSummary: { type: Type.STRING },
              suggestedAction: { type: Type.STRING },
              diffRows: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    field: { type: Type.STRING },
                    original: { type: Type.STRING },
                    current: { type: Type.STRING },
                    drifted: { type: Type.BOOLEAN },
                    severity: { type: Type.STRING }
                  },
                  required: ["field", "original", "current", "drifted", "severity"]
                }
              }
            },
            required: [
              "driftDetected",
              "driftSeverity",
              "confidenceScore",
              "decisionMode",
              "reasoningSummary",
              "suggestedAction",
              "diffRows"
            ]
          }
        }
      });

      const resultText = response.text || "{}";
      res.json(JSON.parse(resultText));

    } catch (err: any) {
      console.warn("Gemini API call failed, activating hybrid standby backup heuristics:", err.message);
      // Determine if rate limit was the reason
      const isQuotaExceeded = err.message && (err.message.includes("429") || err.message.toLowerCase().includes("quota") || err.message.toLowerCase().includes("limit"));
      const prefix = isQuotaExceeded 
        ? "[QUOTA EXCEEDED - AUXILIARY COGNITIVE FEED ON STANDBY]" 
        : "[API CONNECTION OFFLINE - AUXILIARY COGNITIVE FEED ON STANDBY]";
      
      try {
        res.json(runHeuristicFallback(prefix));
      } catch (fallbackErr: any) {
        console.error("Heuristic fallback failed:", fallbackErr);
        res.status(500).json({ error: "Adaptive diagnostics down", details: fallbackErr.message });
      }
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
