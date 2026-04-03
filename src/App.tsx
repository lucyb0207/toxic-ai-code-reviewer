import { useState } from "react";
import "./index.css";

type Mode = "brutal" | "passive" | "supportive";

export default function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("brutal");
  const [intensity, setIntensity] = useState(2);

  const loadingMessages = [
    "Analyzing your crimes against software engineering...",
    "Reading your code with concern...",
    "Comparing to Stack Overflow disasters...",
    "Calculating emotional damage...",
    "Preparing psychological report...",
    "Summoning junior developer disappointment..."
  ];

  const [loadingText, setLoadingText] = useState(loadingMessages[0]);
 
  const handleRoast = async () => {
    if (!code.trim()) return;
    console.log(import.meta.env.VITE_GEMINI_API_KEY);
    setLoading(true);
    setOutput("");

    const modePrompt =
      mode === "brutal"
        ? "Be extremely sarcastic, funny, and harsh but not offensive."
        : mode === "passive"
        ? "Be passive-aggressive and subtly mocking."
        : "Be overly supportive and enthusiastic about bad code.";

    const intensityPrompt =
      intensity === 1
        ? "Tone: very mild, safe humor."
        : intensity === 2
        ? "Tone: light teasing."
        : intensity === 3
        ? "Tone: balanced roasting."
        : intensity === 4
        ? "Tone: harsh roasting."
        : "Tone: maximum emotional damage, but still comedic.";
      
    let i = 0;

    const interval = setInterval(() => {
      setLoadingText(loadingMessages[i % loadingMessages.length]);
      i++;
    }, 1200);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${
          import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
                        You are ToxicAI, an AI-powered code reviewer designed for humor.

                        PERSONALITY:
                        ${modePrompt}

                        INTENSITY:
                        ${intensityPrompt}

                        STRICT BEHAVIOR RULES:
                        - You MUST follow BOTH personality and intensity.
                        - Do NOT ignore intensity level.
                        - Do NOT ignore personality mode.
                        - Make the roast funny, not harmful or hateful.
                        - Keep it developer-focused (code humor only).

                        OUTPUT FORMAT (mandatory):
                        1. Roast
                        2. Metrics
                        Also include a final line:
                        3. Verdict (one dramatic sentence about the code)     

                        Metrics MUST include:
                        - Vibe Score (1-10)
                        - Ego Risk Level (%)
                        - Stack Overflow Dependency (%)

                        Code to review:
                        ${code}
                        `,
                  },
                ],
              },
            ],
          }),
        }
      );

    const data = await response.json();

     if (!response.ok) {
      throw new Error(data?.error?.message || "Gemini API request failed");
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No content returned from Gemini");
    }

      typeText(text, setOutput);
    } catch (err: any) {
        console.log("FULL ERROR:", err);
        setOutput(JSON.stringify(err?.response || err, null, 2));
    } finally {
        clearInterval(interval);
        setLoading(false);
    }
  };
  const typeText = (text: string, setOutput: (v: string) => void) => {
  let i = 0;
  setOutput("");

  const interval = setInterval(() => {
    setOutput(text.slice(0, i));
    i++;

    if (i > text.length) clearInterval(interval);
  }, 10);
};
const copyToClipboard = () => {
  navigator.clipboard.writeText(output);
  alert("Roast copied 💀");
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ToxicAI Code Reviewer 💀</h1>

      <div style={{ width: "80%", color: "white" }}>
        <label>AI Brutality Level: {intensity}</label>

        <input
          type="range"
          min="1"
          max="5"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          style={{ width: "100%" }}         
        />
      </div>

      {/* MODE SELECTOR */}
      <div style={styles.modes}>
        {(["brutal", "passive", "supportive"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              ...styles.modeButton,
              background: mode === m ? "#ff004c" : "#222",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <textarea
        style={styles.textarea}
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button style={styles.button} onClick={handleRoast}>
        Roast Me
      </button>

      <div style={styles.outputBox}>
        {loading ? (
          <p>{loadingText}</p>
        ) : (
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
            {output || "Your AI roast will appear here..."}
          </div>
        )}
      </div>
      <button onClick={copyToClipboard} style={styles.button}>
        Copy Roast
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    background: "radial-gradient(circle, #1a1a1a, #0f0f0f)",
    minHeight: "100vh",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
  },
  textarea: {
    width: "80%",
    height: "200px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#1a1a1a",
    color: "white",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    background: "#ff004c",
    border: "none",
    borderRadius: "6px",
    color: "white",
  },
  outputBox: {
    width: "80%",
    minHeight: "120px",
    padding: "15px",
    borderRadius: "8px",
    background: "#111",
    border: "1px solid #333",
    boxShadow: "0 0 20px rgba(255,0,76,0.1)",
  },
  modes: {
    display: "flex",
    gap: "10px",
  },
  modeButton: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};