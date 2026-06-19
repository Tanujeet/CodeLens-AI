"use client";
import { motion } from "framer-motion";

const sectionColors: Record<
  string,
  { bg: string; border: string; dot: string; label: string }
> = {
  bugs: {
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    dot: "#f87171",
    label: "🐛 Bugs & Logical Errors",
  },
  security: {
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
    dot: "#fb923c",
    label: "🔒 Security Vulnerabilities",
  },
  quality: {
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    dot: "#a78bfa",
    label: "✨ Code Quality & Readability",
  },
  performance: {
    bg: "rgba(34,211,238,0.08)",
    border: "rgba(34,211,238,0.2)",
    dot: "#22d3ee",
    label: "⚡ Performance Issues",
  },
  suggestions: {
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.2)",
    dot: "#4ade80",
    label: "💡 Suggestions",
  },
};

function parseReview(review: string) {
    if (!review)
        return [{ key: "suggestions", content: "No review available." }];
  const sections: { key: string; content: string }[] = [];

  const patterns = [
    { key: "bugs", regex: /1\.\s*Bugs[^]*?(?=2\.|$)/i },
    { key: "security", regex: /2\.\s*Security[^]*?(?=3\.|$)/i },
    { key: "quality", regex: /3\.\s*Code Quality[^]*?(?=4\.|$)/i },
    { key: "performance", regex: /4\.\s*Performance[^]*?(?=5\.|$)/i },
    { key: "suggestions", regex: /5\.\s*Suggestions[^]*?$/i },
  ];

  for (const { key, regex } of patterns) {
    const match = review.match(regex);
    if (match) {
      const content = match[0]
        .replace(
          /^\d+\.\s*(Bugs.*?|Security.*?|Code Quality.*?|Performance.*?|Suggestions.*?)\n/i,
          "",
        )
        .replace(/#{1,4}\s*/g, "")
        .trim();
      if (content) sections.push({ key, content });
    }
    }
    return sections.length > 0
        ? sections
        : [{ key: "suggestions", content: review }];
}

export default function ReviewCard({
  filename,
  review,
  index,
}: {
  filename: string;
  review: string;
  index: number;
}) {
  const sections = parseReview(review);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      {/* File header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <span style={{ fontSize: 16 }}>📄</span>
        <span
          style={{
            color: "#67e8f9",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {filename}
        </span>
      </div>

      {/* Sections */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {sections.map(({ key, content }) => {
          const style = sectionColors[key] ?? sectionColors["suggestions"];
            const points = content
                .split("\n")
                .map((l) =>
                    l
                        .replace(/^[\*\-]\s*/, "")
                        .replace(/\*\*(.*?)\*\*/g, "$1")
                        .trim(),
                )
                .filter(Boolean);
            if (points.length === 0) return null;

          return (
            <div
              key={key}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: 12,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: style.dot,
                    flexShrink: 0,
                  }}
                />
                {style.label}
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: "0 0 0 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {points.map((point, i) => (
                  <li
                    key={i}
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: 13,
                      lineHeight: 1.65,
                    }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
