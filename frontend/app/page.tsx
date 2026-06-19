"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "./components/ReviewCard";

interface Review {
  filename: string;
  review: string;
}

export default function Home() {
  const [repoName, setRepoName] = useState("");
  const [prNumber, setPrNumber] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!repoName || !prNumber) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    setLoading(true);
    setSubmitted(false);
    setReviews([]);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(
        `${backendUrl}/review?repo_name=${encodeURIComponent(repoName)}&pr_number=${prNumber}`,
        { method: "POST" },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReviews(data.reviews ?? []);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07070f",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Background Decorative Elements */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "#7c3aed",
            filter: "blur(120px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "#06b6d4",
            filter: "blur(100px)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "#c026d3",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Main UI Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 680,
          margin: "0 auto",
          padding: "60px 20px 80px",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999,
              padding: "6px 16px",
              fontSize: 11,
              color: "#c4b5fd",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#a78bfa",
                display: "inline-block",
              }}
            />
            AI-Powered Code Review
          </motion.div>

          <h1
            style={{
              fontSize: "clamp(40px, 8vw, 64px)",
              fontWeight: 800,
              letterSpacing: "-2px",
              lineHeight: 1.1,
              marginBottom: 16,
              background: "linear-gradient(135deg, #a78bfa, #f0abfc, #67e8f9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CodeLens AI
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 17,
              lineHeight: 1.6,
              maxWidth: 400,
              margin: "0 auto 24px",
            }}
          >
            Drop a GitHub PR — get instant feedback from an AI senior engineer
            that never sleeps.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "clamp(24px, 5vw, 40px)",
            marginBottom: 32,
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Repository
              </label>
              <input
                type="text"
                placeholder="e.g. vercel/next.js"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Pull Request Number
              </label>
              <input
                type="number"
                placeholder="e.g. 42"
                value={prNumber}
                onChange={(e) => setPrNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    color: "#f87171",
                    fontSize: 13,
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 10,
                    padding: "10px 14px",
                  }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                background: "linear-gradient(135deg, #7c3aed, #c026d3)",
                color: "white",
                opacity: loading ? 0.6 : 1,
                boxShadow: "0 8px 30px rgba(124,58,237,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                    }}
                  />
                  Reviewing PR...
                </>
              ) : (
                "Review PR →"
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {submitted && reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                }}
              >
                {reviews.length} file{reviews.length > 1 ? "s" : ""} reviewed
              </p>
              {reviews.map((review, i) => (
                <ReviewCard
                  key={review.filename || i}
                  filename={review.filename}
                  review={review.review}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {submitted && reviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              color: "rgba(255,255,255,0.25)",
              padding: "48px 0",
            }}
          >
            No reviewable files found in this PR.
          </motion.div>
        )}
      </div>
    </main>
  );
}
