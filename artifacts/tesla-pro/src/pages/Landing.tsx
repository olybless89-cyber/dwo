import { useLocation } from "wouter";
import { motion } from "framer-motion";

const services = [
  {
    icon: "⚡",
    title: "High-Conviction Investments",
    description:
      "Access curated investment opportunities vetted by our expert team — from clean energy to next-gen technology.",
  },
  {
    icon: "🎁",
    title: "Exclusive Giveaways",
    description:
      "Members earn entries to premium giveaways including Tesla vehicles, tech bundles, and cash prizes.",
  },
  {
    icon: "💎",
    title: "Digital Assets",
    description:
      "Early access to digital asset offerings, NFT drops, and tokenized investment vehicles before public release.",
  },
  {
    icon: "🏆",
    title: "Rewards Program",
    description:
      "Earn reward points on every activity. Redeem for merchandise, investment credits, or cash back.",
  },
  {
    icon: "📦",
    title: "Merchandise Store",
    description:
      "Shop exclusive Tesla Pro branded merchandise available only to verified members.",
  },
  {
    icon: "👥",
    title: "Community Access",
    description:
      "Connect with like-minded investors and entrepreneurs in our private member network.",
  },
];

export default function LandingPage() {
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: "#080d14", color: "#e8eaec", fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px", borderBottom: "1px solid #1a2332",
      }}>
        <span style={{ fontWeight: 300, fontSize: 18, letterSpacing: "0.4em", textTransform: "uppercase", color: "#8b95a1" }}>
          TESLA PRO
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "8px 20px", background: "transparent", border: "1px solid #2e3843",
              color: "#8b95a1", borderRadius: 4, cursor: "pointer", fontSize: 13, letterSpacing: "0.05em",
            }}
          >
            Apply
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 20px", background: "#e31937", border: "none",
              color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 13, letterSpacing: "0.08em", fontWeight: 600,
            }}
          >
            SIGN IN
          </button>
        </div>
      </nav>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: "center", padding: "100px 40px 80px" }}
      >
        <p style={{ fontSize: 11, letterSpacing: "0.35em", color: "#e31937", textTransform: "uppercase", marginBottom: 20 }}>
          THE PREMIUM ECOSYSTEM
        </p>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300, lineHeight: 1.15, margin: "0 0 24px", letterSpacing: "-0.01em" }}>
          Exclusive access for<br />serious investors
        </h1>
        <p style={{ fontSize: 17, color: "#8b95a1", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Tesla Pro is a private membership platform offering curated investments,
          digital assets, rewards, and more — for verified members only.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "14px 36px", background: "#e31937", border: "none",
              color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14,
              letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase",
            }}
          >
            Apply for Membership
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "14px 36px", background: "transparent", border: "1px solid #2e3843",
              color: "#8b95a1", borderRadius: 4, cursor: "pointer", fontSize: 14, letterSpacing: "0.05em",
            }}
          >
            Sign In
          </button>
        </div>
      </motion.section>

      {/* Divider */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 80 }}>
        <div style={{ display: "flex", gap: 2, width: 130 }}>
          <div style={{ flex: "0 0 38px", height: 1, background: "#e8eaec" }} />
          <div style={{ flex: 1, height: 1, background: "#2e3843" }} />
        </div>
      </div>

      {/* Services */}
      <section style={{ padding: "0 40px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: 13, letterSpacing: "0.3em", color: "#8b95a1", textTransform: "uppercase", marginBottom: 60 }}>
          Member Services
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: "#0d1520", border: "1px solid #1a2332", borderRadius: 8,
                padding: "32px 28px",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 16 }}>{s.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 10, color: "#e8eaec" }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "#8b95a1", lineHeight: 1.7, margin: 0 }}>{s.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: "#0d1520", borderTop: "1px solid #1a2332", borderBottom: "1px solid #1a2332",
        padding: "60px 40px", textAlign: "center",
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 300, marginBottom: 12 }}>Ready to join?</h2>
        <p style={{ color: "#8b95a1", marginBottom: 32, fontSize: 15 }}>Membership is by application only.</p>
        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "14px 40px", background: "#e31937", border: "none",
            color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14,
            letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase",
          }}
        >
          Apply Now
        </button>
      </section>

      {/* Footer */}
      <footer style={{ padding: "32px 40px", textAlign: "center", color: "#3a4552", fontSize: 12 }}>
        © {new Date().getFullYear()} Tesla Pro. All rights reserved.
      </footer>
    </div>
  );
}
