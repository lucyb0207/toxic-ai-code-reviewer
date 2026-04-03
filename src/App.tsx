import { useState } from "react";
import "./index.css";

type Mode = "brutal" | "passive" | "supportive";

export default function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("brutal");

  const roasts = {
    brutal: [
      "This code has the structural integrity of a wet paper towel.",
      "I’ve seen better logic in a toaster manual.",
      "This works… which is surprising, honestly.",
    ],
    passive: [
      "Interesting approach… I wouldn’t have chosen it, but it’s certainly something.",
      "This is one way to do it. Not a good way, but a way.",
      "It technically runs, so that’s progress I guess.",
    ],
    supportive: [
      "Great effort! Every line of code is a step forward 💪",
      "This is a solid foundation to build on!",
      "You’re doing amazing — keep going!",
    ],
  };

  const fakeMetrics = () => {
    const vibe = Math.floor(Math.random() * 10) + 1;
    const ego = Math.floor(Math.random() * 100);

    return `
Vibe Score: ${vibe}/10
Ego Risk Level: ${ego}%
Stack Overflow Dependency: ${Math.floor(Math.random() * 100)}%
    `;
  };

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
  You are ToxicAI, a brutally funny code reviewer.

  ${modePrompt}

  Also generate fake metrics:
  - Vibe Score (1-10)
  - Ego Risk Level (%)
  - Stack Overflow Dependency (%)

  Return format:
  1. Roast
  2. Metrics

  Code:
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
      console.log("STATUS:", response.status);
console.log("DATA:", data);

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
          <p>Analyzing poor life choices...</p>
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