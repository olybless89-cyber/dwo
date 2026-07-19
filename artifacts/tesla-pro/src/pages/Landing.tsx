import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [exiting, setExiting] = useState(false);

  function enter() {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => navigate("/login"), 700);
  }

  // Auto-advance after 3 s
  useEffect(() => {
    const t = setTimeout(enter, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="landing"
          className="landing-root"
          onClick={enter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#080d14",
            cursor: "default",
            zIndex: 50,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}
          >
            {/* Wordmark */}
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(18px, 2.2vw, 28px)",
                letterSpacing: "0.45em",
                color: "#8b95a1",
                textTransform: "uppercase",
                userSelect: "none",
              }}
            >
              TESLA PRO
            </span>

            {/* Two-segment divider — matches reference site exactly */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
              style={{
                marginTop: 14,
                display: "flex",
                gap: 2,
                width: 130,
                transformOrigin: "left center",
              }}
            >
              {/* bright left segment */}
              <div style={{ flex: "0 0 38px", height: 1, background: "#e8eaec" }} />
              {/* dim right segment */}
              <div style={{ flex: 1, height: 1, background: "#2e3843" }} />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="exit"
          style={{
            position: "fixed",
            inset: 0,
            background: "#080d14",
            zIndex: 50,
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}
