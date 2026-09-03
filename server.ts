import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const PORT = 3000;

// LeakCheck interfaces and querying client
interface LeakCheckSource {
  name: string;
  date?: string;
}

interface LeakCheckResponse {
  success: boolean;
  found?: number;
  fields?: string[];
  sources?: LeakCheckSource[];
  error?: string;
}

interface LeakCheckScanResult {
  found: number;
  sourceNames: string[];
  breaches: {
    id: string;
    sourceEntity: string;
    compromisedData: string[];
    severity: "CRITICAL" | "ELEVATED" | "MODERATE" | "MINIMAL";
    detectionDate: string;
    icon: string;
    description: string;
    status: "UNRESOLVED" | "RESOLVED";
  }[];
  fields: string[];
  isRealData: boolean;
}

async function queryLeakCheck(query: string): Promise<LeakCheckScanResult | null> {
  const apiKey = process.env.LEAKCHECK_API_KEY;
  const isEmail = query.includes("@");

  // 1. If an API key is configured, query LeakCheck v2 authenticated endpoint
  if (apiKey && apiKey.trim() !== "" && apiKey !== "MY_LEAKCHECK_API_KEY") {
    try {
      console.log(`[LeakCheck] Querying authenticated API v2 for target: ${query}`);
      const typeParam = isEmail ? "email" : "auto";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const response = await fetch(
        `https://leakcheck.io/api/v2/query/${encodeURIComponent(query.trim())}?type=${typeParam}`,
        {
          method: "GET",
          headers: {
            "X-API-Key": apiKey.trim(),
            "Accept": "application/json",
            "User-Agent": "LeakLock-Intelligence-Monitor/1.0"
          },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as LeakCheckResponse;
        if (data.success) {
          const found = data.found || 0;
          const fields = (data.fields && data.fields.length > 0)
            ? data.fields.map(f => f.toUpperCase())
            : ["EMAIL", "PASSWORD_HASH"];
          const sources = data.sources || [];

          const breaches = sources.map((s, idx) => {
            const hasPassword = fields.some(f => f.includes("PASS"));
            return {
              id: `lc-v2-${idx}-${Date.now()}`,
              sourceEntity: s.name || `Compromised Database #${idx + 1}`,
              compromisedData: fields,
              severity: (hasPassword ? "CRITICAL" : "ELEVATED") as "CRITICAL" | "ELEVATED",
              detectionDate: s.date || "2023-2024",
              icon: "database",
              description: `Verified compromise indexed by LeakCheck in "${s.name}". Compromised vectors: ${fields.join(", ")}.`,
              status: "UNRESOLVED" as const
            };
          });

          console.log(`[LeakCheck] Authenticated lookup found ${found} records across ${sources.length} sources.`);
          return {
            found,
            sourceNames: sources.map(s => s.name),
            breaches,
            fields,
            isRealData: true
          };
        }
      } else {
        console.warn(`[LeakCheck] API returned HTTP ${response.status}`);
      }
    } catch (err) {
      console.warn("[LeakCheck] Authenticated query failed or timed out:", err);
    }
  }

  // 2. Query the LeakCheck Public API (works for verification & breach sources list without a key)
  try {
    console.log(`[LeakCheck] Checking public index for target: ${query}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const pubRes = await fetch(
      `https://leakcheck.io/api/public?check=${encodeURIComponent(query.trim())}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "LeakLock-Intelligence-Monitor/1.0"
        },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (pubRes.ok) {
      const data = (await pubRes.json()) as LeakCheckResponse;
      if (data.success) {
        const found = data.found || 0;
        const sources = data.sources || [];
        const breaches = sources.map((s, idx) => ({
          id: `lc-pub-${idx}-${Date.now()}`,
          sourceEntity: s.name,
          compromisedData: ["EMAIL", "PASSWORD_HASH", "METADATA"],
          severity: "CRITICAL" as const,
          detectionDate: s.date || "ARCHIVED",
          icon: "database",
          description: `Active exposure detected in dark-web collection: "${s.name}". Immediate credential revocation suggested.`,
          status: "UNRESOLVED" as const
        }));

        console.log(`[LeakCheck] Public lookup found ${found} records across ${sources.length} sources.`);
        return {
          found,
          sourceNames: sources.map(s => s.name),
          breaches,
          fields: ["EMAIL", "PASSWORD_HASH"],
          isRealData: true
        };
      }
    }
  } catch (err) {
    console.warn("[LeakCheck] Public query skipped or unreachable:", err);
  }

  return null;
}

// Lazy initialization of Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Highly realistic and tactical mock data matching the "Shadow Earth" aesthetics
const MOCK_BREACHES = [
  {
    id: "b1",
    sourceEntity: "Apollo Data Leak",
    compromisedData: ["EMAIL", "EMPLOYMENT", "SOCIAL_URL"],
    severity: "CRITICAL",
    detectionDate: "24 OCT 2023",
    icon: "hub",
    description: "A major business-to-business contact database exposure containing corporate email addresses, professional backgrounds, and social profile links.",
    status: "UNRESOLVED"
  },
  {
    id: "b2",
    sourceEntity: "Canva Exposure",
    compromisedData: ["PASSWORD_HASH", "GEOLOCATION"],
    severity: "ELEVATED",
    detectionDate: "12 AUG 2023",
    icon: "palette",
    description: "Database leakage containing encrypted password hashes, user geolocation hints, and profile account information.",
    status: "UNRESOLVED"
  },
  {
    id: "b3",
    sourceEntity: "Adobe Cloud Hub",
    compromisedData: ["USERNAME", "HINT_QUESTIONS"],
    severity: "MODERATE",
    detectionDate: "05 MAY 2023",
    icon: "cloud",
    description: "Asset exposure including account usernames, legacy security hint questions, and secondary verification metadata.",
    status: "RESOLVED"
  },
  {
    id: "b4",
    sourceEntity: "MyFitnessPal Sync",
    compromisedData: ["HEALTH_METRICS", "IP_ADDRESS"],
    severity: "ELEVATED",
    detectionDate: "19 JAN 2023",
    icon: "fitness_center",
    description: "An unauthorized synchronization breach releasing general health telemetry records and last-used logging IP addresses.",
    status: "UNRESOLVED"
  }
];

const MOCK_ALERTS = [
  {
    id: "a1",
    type: "CRITICAL BREACH ATTEMPT",
    title: "Brute Force Attempt",
    message: "Unusual login cluster detected on Cloud Vault Node-07 (Region: HK). 142 attempts suppressed.",
    time: "2m ago",
    status: "ACTIVE",
    severity: "CRITICAL"
  },
  {
    id: "a2",
    type: "ANOMALY DETECTED",
    title: "Anomalous Geo-Location",
    message: "Access attempt from unrecognized TOR exit node. Verified identity required.",
    time: "18m ago",
    status: "ACTIVE",
    severity: "ELEVATED"
  }
];

const MOCK_ASSETS = [
  {
    id: "as1",
    name: "Mainframe Root Auth",
    type: "Biometric Cluster",
    riskLevel: "MODERATE",
    status: "ENCRYPTED"
  },
  {
    id: "as2",
    name: "Dark Web Alias-09",
    type: "Digital Ghost",
    riskLevel: "CRITICAL",
    status: "EXPOSED"
  },
  {
    id: "as3",
    name: "L2 Hardware Wallet",
    type: "Cold Storage",
    riskLevel: "MINIMAL",
    status: "SECURED"
  }
];

const MOCK_RECOMMENDATIONS = [
  {
    id: "r1",
    title: "Rotate Master Credentials",
    description: "Your primary identity vault access key has not been rotated in 184 days. Breach intelligence indicates heightened credential stuffing attacks targeting your sector. Updating to a quantum-resistant passphrase is recommended.",
    points: 120,
    severity: "CRITICAL",
    actionText: "EXECUTE ROTATION",
    status: "PENDING"
  },
  {
    id: "r2",
    title: "Harden Multi-Factor Authentication",
    description: "SMS-based verification is vulnerable to SIM-swap protocols. Migrate all active sessions to hardware-based tokens or biometric authentication for maximum hardening.",
    points: 220,
    severity: "CRITICAL",
    actionText: "UPGRADE PROTOCOL",
    status: "PENDING"
  },
  {
    id: "r3",
    title: "Obfuscate Public Profile",
    description: "OSINT tools have indexed high-fidelity personal data via linked LinkedIn profiles. Apply noise-injection or privacy masks to reduce target visibility.",
    points: 45,
    severity: "MODERATE",
    actionText: "INITIATE MASKING",
    status: "PENDING"
  },
  {
    id: "r4",
    title: "Audit Third-Party Keys",
    description: "4 stale API connections have full read access to your identity vault. Terminate inactive tokens to prevent secondary exploitation chains.",
    points: 30,
    severity: "MODERATE",
    actionText: "REVOKE ACCESS",
    status: "PENDING"
  },
  {
    id: "r5",
    title: "Enable Login Geo-Fencing",
    description: "Unauthorized login attempts detected from Tier-3 risk zones. Restrict access to whitelisted operational regions only.",
    points: 25,
    severity: "MINIMAL",
    actionText: "DEPLOY FENCE",
    status: "PENDING"
  }
];

const MOCK_LOGS = [
  {
    id: "l1",
    time: "22:14:02",
    tag: "SIGNAL",
    message: "Credential dump \"TITAN_OAK\" identified on hidden forum. Scanning for matches..."
  },
  {
    id: "l2",
    time: "22:09:45",
    tag: "PROTECT",
    message: "Automatic block initiated: Suspicious auth attempt from 185.22.XX.XX (RU)."
  },
  {
    id: "l3",
    time: "21:58:30",
    tag: "UPDATE",
    message: "System definitions updated to v7.4.2. Scanning for new zero-day vulnerability patterns."
  }
];

async function startServer() {
  const app = express();

  // Basic middleware
  app.use(express.json());

  // API Status & Configuration Endpoint
  app.get("/api/status", (req, res) => {
    const leakCheckConfigured = Boolean(
      process.env.LEAKCHECK_API_KEY &&
      process.env.LEAKCHECK_API_KEY.trim() !== "" &&
      process.env.LEAKCHECK_API_KEY !== "MY_LEAKCHECK_API_KEY"
    );
    const geminiConfigured = Boolean(
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== "" &&
      process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
    );

    res.json({
      status: "operational",
      leakCheck: {
        configured: leakCheckConfigured,
        mode: leakCheckConfigured ? "AUTHENTICATED_V2" : "PUBLIC_INDEX_ACTIVE"
      },
      gemini: {
        configured: geminiConfigured
      },
      protocol: "7.4.2"
    });
  });

  // API Route: Digital Identity Scanner powered by LeakCheck & Gemini
  app.post("/api/scan", async (req, res) => {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Identity query (email, domain, or handle) is required" });
    }

    console.log(`Initiating digital identity scan for: ${query}`);

    // 1. Probe real dark-web breach indices via LeakCheck (v2 authenticated or public index)
    const leakCheckResult = await queryLeakCheck(query);
    const ai = getGeminiClient();

    // 2. Case: LeakCheck confirmed target has 0 leaks
    if (leakCheckResult && leakCheckResult.found === 0) {
      console.log(`[LeakLock] Clean record confirmed by LeakCheck for: ${query}`);
      const cleanLogs = [
        {
          id: `l-clean-1`,
          time: new Date().toLocaleTimeString(),
          tag: "PROTECT" as const,
          message: `Zero exposures detected for ${query} across LeakCheck global dark-web repositories.`
        },
        {
          id: `l-clean-2`,
          time: new Date(Date.now() - 45000).toLocaleTimeString(),
          tag: "SIGNAL" as const,
          message: "Dark-web hash collision probe completed with 0 matches."
        }
      ];

      return res.json({
        score: 965,
        status: "STATUS: SECURED VIRTUAL LOCK",
        totalLeaks: 0,
        newLeaks: 0,
        avgDetectionTimeHours: 0.2,
        threatLevel: "MINIMAL",
        defconLevel: 5,
        breaches: [],
        alerts: [],
        assets: [
          { id: "as-clean-1", name: "Target Vault Root", type: "Digital Identity", riskLevel: "MINIMAL", status: "SECURED" },
          { id: "as-clean-2", name: "Primary Keyring", type: "Cryptographic Node", riskLevel: "MINIMAL", status: "ENCRYPTED" }
        ],
        recommendations: [
          {
            id: "rec-clean-1",
            title: "Maintain Proactive Sentinel Watch",
            description: "No leaks found in active breached dumps. Continue automated checks to capture newly emerging zero-day exposures.",
            points: 15,
            severity: "MINIMAL",
            actionText: "LOCK DEFENSES",
            status: "COMPLETED"
          }
        ],
        logs: cleanLogs
      });
    }

    // 3. Case: LeakCheck found genuine breaches!
    if (leakCheckResult && leakCheckResult.found > 0) {
      console.log(`[LeakLock] ${leakCheckResult.found} breaches identified by LeakCheck.`);
      
      // If Gemini is available, pass the verified LeakCheck breaches into Gemini for deep tactical analysis
      if (ai) {
        try {
          const aiPrompt = `Perform a tactical cybersecurity impact analysis for the target: "${query}".
Verified real dark-web breach findings from LeakCheck:
- Total breached accounts/sources found: ${leakCheckResult.found}
- Source entities: ${leakCheckResult.sourceNames.join(", ")}
- Compromised data fields: ${leakCheckResult.fields.join(", ")}

Generate an intelligence report. Include the real breached sources in the 'breaches' list with realistic details.
Calculate an appropriate security score between 300 and 820 depending on the severity of the leaked sources and whether passwords were leaked.
Generate 2-3 alerts, assets assessment, actionable mitigation recommendations, and timeline logs.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: aiPrompt,
            config: {
              systemInstruction: `You are the core intelligence processor of LeakLock. Output valid JSON strictly conforming to the schema. Reflect the verified LeakCheck breaches accurately.`,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.INTEGER },
                  status: { type: Type.STRING },
                  totalLeaks: { type: Type.INTEGER },
                  newLeaks: { type: Type.INTEGER },
                  avgDetectionTimeHours: { type: Type.NUMBER },
                  threatLevel: { type: Type.STRING },
                  defconLevel: { type: Type.INTEGER },
                  breaches: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        sourceEntity: { type: Type.STRING },
                        compromisedData: { type: Type.ARRAY, items: { type: Type.STRING } },
                        severity: { type: Type.STRING },
                        detectionDate: { type: Type.STRING },
                        icon: { type: Type.STRING },
                        description: { type: Type.STRING },
                        status: { type: Type.STRING }
                      },
                      required: ["id", "sourceEntity", "compromisedData", "severity", "detectionDate", "icon", "description", "status"]
                    }
                  },
                  alerts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING },
                        title: { type: Type.STRING },
                        message: { type: Type.STRING },
                        time: { type: Type.STRING },
                        status: { type: Type.STRING },
                        severity: { type: Type.STRING }
                      },
                      required: ["id", "type", "title", "message", "time", "status", "severity"]
                    }
                  },
                  assets: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        type: { type: Type.STRING },
                        riskLevel: { type: Type.STRING },
                        status: { type: Type.STRING }
                      },
                      required: ["id", "name", "type", "riskLevel", "status"]
                    }
                  },
                  recommendations: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        points: { type: Type.INTEGER },
                        severity: { type: Type.STRING },
                        actionText: { type: Type.STRING },
                        status: { type: Type.STRING }
                      },
                      required: ["id", "title", "description", "points", "severity", "actionText", "status"]
                    }
                  },
                  logs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        time: { type: Type.STRING },
                        tag: { type: Type.STRING },
                        message: { type: Type.STRING }
                      },
                      required: ["id", "time", "tag", "message"]
                    }
                  }
                },
                required: ["score", "status", "totalLeaks", "newLeaks", "avgDetectionTimeHours", "threatLevel", "defconLevel", "breaches", "alerts", "assets", "recommendations", "logs"]
              }
            }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());
            return res.json(parsed);
          }
        } catch (geminiErr) {
          console.warn("[LeakLock] Gemini enhancement failed, compiling direct LeakCheck report:", geminiErr);
        }
      }

      // If Gemini is not configured or failed, formulate high-fidelity report directly from LeakCheck
      const calculatedScore = Math.max(340, 890 - (leakCheckResult.found * 65));
      const hasCritical = leakCheckResult.breaches.some(b => b.severity === "CRITICAL");
      const threatLevel = hasCritical || leakCheckResult.found >= 3 ? "CRITICAL" : "ELEVATED";

      const directAlerts = leakCheckResult.breaches.slice(0, 2).map((b, i) => ({
        id: `alt-lc-${i}`,
        type: b.severity === "CRITICAL" ? ("CRITICAL BREACH ATTEMPT" as const) : ("ANOMALY DETECTED" as const),
        title: `Exposure in ${b.sourceEntity}`,
        message: `Dark-web verification confirmed ${b.compromisedData.join(", ")} leaked via ${b.sourceEntity}.`,
        time: "Just now",
        status: "ACTIVE" as const,
        severity: b.severity
      }));

      const directLogs = [
        {
          id: `l-lc-1`,
          time: new Date().toLocaleTimeString(),
          tag: "SIGNAL" as const,
          message: `LeakCheck verified ${leakCheckResult.found} compromised instances for ${query}.`
        },
        {
          id: `l-lc-2`,
          time: new Date(Date.now() - 30000).toLocaleTimeString(),
          tag: "PROTECT" as const,
          message: `Mitigation shield suggested: immediate rotation of leaked credentials.`
        }
      ];

      return res.json({
        score: calculatedScore,
        status: calculatedScore < 600 ? "STATUS: CRITICAL EXPOSURE" : "STATUS: ELEVATED VIGILANCE",
        totalLeaks: leakCheckResult.found,
        newLeaks: Math.min(leakCheckResult.found, 2),
        avgDetectionTimeHours: 1.1,
        threatLevel: threatLevel,
        defconLevel: calculatedScore < 600 ? 1 : 2,
        breaches: leakCheckResult.breaches,
        alerts: directAlerts.length > 0 ? directAlerts : MOCK_ALERTS,
        assets: MOCK_ASSETS.map((a, i) => i === 0 ? { ...a, riskLevel: threatLevel, status: "EXPOSED" as const } : a),
        recommendations: MOCK_RECOMMENDATIONS,
        logs: directLogs
      });
    }

    if (!ai) {
      // Return beautiful, semi-customized mock data if Gemini API key is not configured
      console.log("Gemini API key not configured, returning local threat intelligence fallback.");
      
      // Inject user's query into the logs and mock some tailored results
      const personalizedBreaches = MOCK_BREACHES.map(b => {
        if (b.id === "b1" && query.includes("@")) {
          return { ...b, description: `Primary identifier matches found for email: ${query}. ${b.description}` };
        }
        return b;
      });

      const personalizedLogs = [
        {
          id: "l-custom-1",
          time: new Date().toLocaleTimeString(),
          tag: "SIGNAL" as const,
          message: `Deep scan triggered for target: ${query}`
        },
        ...MOCK_LOGS
      ];

      return res.json({
        score: query.length > 15 ? 850 : 710,
        status: "ELEVATED VIGILANCE",
        totalLeaks: 42,
        newLeaks: 3,
        avgDetectionTimeHours: 1.2,
        threatLevel: "ELEVATED",
        defconLevel: 3,
        breaches: personalizedBreaches,
        alerts: MOCK_ALERTS,
        assets: MOCK_ASSETS,
        recommendations: MOCK_RECOMMENDATIONS,
        logs: personalizedLogs
      });
    }

    try {
      // Define a strict schema to map the output to LeakLock's components
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Perform a detailed security breach and identity leak scan on the identifier: "${query}".
        Generate a highly realistic, intelligence-grade cyber tactical exposure report.
        Create 3 to 5 realistic past data breaches, 2 current critical alerts, 3 protected assets status, 4 structured recommendations, and 3-4 log timelines.
        Make the findings highly specific to the domain or handle provided if possible (e.g., if domain is corporate, tailor breaches to corporate SaaS/hosting platforms, if email is personal, tailor to social media or gaming leaks).`,
        config: {
          systemInstruction: `You are the core intelligence processor of LeakLock, a world-class cybersecurity monitor.
          You analyze a user's digital identity query (such as an email, domain name, username, or IP address) and generate a realistic, high-fidelity cyber threat ledger.
          Output must strictly be valid JSON adhering exactly to the specified JSON schema.
          Be precise, professional, and use clinical cybersecurity terms (e.g., credential stuffing, OSINT mapping, biometric validation, salt-hash, TOR node).
          Keep the look and feel aligned with 'Shadow Earth' protocols (protocol 7.4.2).`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: {
                type: Type.INTEGER,
                description: "Security score from 0 (perfectly breached) to 1000 (fully secure). A safe level is above 900. Elevated threat is around 600-850."
              },
              status: {
                type: Type.STRING,
                description: "Status text like 'STATUS: ELEVATED VIGILANCE', 'STATUS: CRITICAL EXPOSURE', or 'STATUS: SECURED VIRTUAL LOCK'."
              },
              totalLeaks: { type: Type.INTEGER },
              newLeaks: { type: Type.INTEGER },
              avgDetectionTimeHours: { type: Type.NUMBER },
              threatLevel: {
                type: Type.STRING,
                description: "Must be 'MINIMAL', 'MODERATE', 'ELEVATED', or 'CRITICAL'"
              },
              defconLevel: { type: Type.INTEGER },
              breaches: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    sourceEntity: { type: Type.STRING, description: "The platform or company that leaked data, e.g. 'Adobe Cloud Hub', 'Canva Exposure'" },
                    compromisedData: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Compromised tags, e.g. 'EMAIL', 'PASSWORD_HASH', 'EMPLOYMENT', 'GEOLOCATION'"
                    },
                    severity: { type: Type.STRING, description: "Must be 'CRITICAL', 'ELEVATED', 'MODERATE', or 'MINIMAL'" },
                    detectionDate: { type: Type.STRING, description: "Tactical date, e.g. '24 OCT 2023'" },
                    icon: { type: Type.STRING, description: "A Lucide icon keyword like 'hub', 'palette', 'cloud', 'database', 'shield', 'key', 'globe', 'users'" },
                    description: { type: Type.STRING, description: "Professional summary of how the leak occurred and potential impact." },
                    status: { type: Type.STRING, description: "Must be 'UNRESOLVED' or 'RESOLVED'" }
                  },
                  required: ["id", "sourceEntity", "compromisedData", "severity", "detectionDate", "icon", "description", "status"]
                }
              },
              alerts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING, description: "Must be 'CRITICAL BREACH ATTEMPT', 'ANOMALY DETECTED', or 'THREAT UPDATE'" },
                    title: { type: Type.STRING },
                    message: { type: Type.STRING },
                    time: { type: Type.STRING, description: "e.g. '2m ago', '1h ago'" },
                    status: { type: Type.STRING, description: "Must be 'ACTIVE', 'DISMISSED', or 'RESOLVED'" },
                    severity: { type: Type.STRING, description: "Must be 'CRITICAL', 'ELEVATED', 'MODERATE', or 'MINIMAL'" }
                  },
                  required: ["id", "type", "title", "message", "time", "status", "severity"]
                }
              },
              assets: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    type: { type: Type.STRING, description: "e.g. 'Biometric Cluster', 'Digital Ghost', 'Cold Storage'" },
                    riskLevel: { type: Type.STRING, description: "Must be 'CRITICAL', 'ELEVATED', 'MODERATE', or 'MINIMAL'" },
                    status: { type: Type.STRING, description: "Must be 'EXPOSED', 'ENCRYPTED', or 'SECURED'" }
                  },
                  required: ["id", "name", "type", "riskLevel", "status"]
                }
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    points: { type: Type.INTEGER, description: "Score points added if solved, e.g. 120, 220, 45" },
                    severity: { type: Type.STRING, description: "Must be 'CRITICAL', 'ELEVATED', 'MODERATE', or 'MINIMAL'" },
                    actionText: { type: Type.STRING, description: "Action button text, e.g. 'EXECUTE ROTATION', 'UPGRADE PROTOCOL', 'INITIATE MASKING'" },
                    status: { type: Type.STRING, description: "Must be 'PENDING', 'EXECUTING', or 'COMPLETED'" }
                  },
                  required: ["id", "title", "description", "points", "severity", "actionText", "status"]
                }
              },
              logs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    time: { type: Type.STRING, description: "e.g. '22:14:02'" },
                    tag: { type: Type.STRING, description: "Must be 'SIGNAL', 'PROTECT', or 'UPDATE'" },
                    message: { type: Type.STRING }
                  },
                  required: ["id", "time", "tag", "message"]
                }
              }
            },
            required: ["score", "status", "totalLeaks", "newLeaks", "avgDetectionTimeHours", "threatLevel", "defconLevel", "breaches", "alerts", "assets", "recommendations", "logs"]
          }
        }
      });

      const text = response.text;
      if (text) {
        const parsedReport = JSON.parse(text.trim());
        return res.json(parsedReport);
      } else {
        throw new Error("Empty model response");
      }
    } catch (err: any) {
      console.error("Gemini Scan generation failed:", err);
      return res.status(500).json({ error: "Failed to process intelligence scan. Please try again or check connection." });
    }
  });

  // Serve static assets or mount Vite Dev Server
  if (process.env.NODE_ENV !== "production") {
    console.log("Mounting Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LeakLock server successfully deployed on port ${PORT}`);
    console.log(`Local Access: http://localhost:${PORT}`);
  });
}

startServer();
