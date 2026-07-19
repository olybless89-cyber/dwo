import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const CARS = [
  {
    model: "Model S Plaid",
    tagline: "Beyond Ludicrous",
    price: 89_990,
    range: "396 mi",
    topSpeed: "200 mph",
    accel: "1.99 s",
    color: "from-zinc-900 to-slate-800",
    img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&q=80",
  },
  {
    model: "Model 3",
    tagline: "The Future Is Now",
    price: 40_240,
    range: "358 mi",
    topSpeed: "162 mph",
    accel: "3.1 s",
    color: "from-slate-900 to-zinc-800",
    img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&q=80",
  },
  {
    model: "Model X Plaid",
    tagline: "Performance & Utility",
    price: 104_990,
    range: "333 mi",
    topSpeed: "163 mph",
    accel: "2.5 s",
    color: "from-neutral-900 to-slate-800",
    img: "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=900&q=80",
  },
  {
    model: "Model Y",
    tagline: "For Everyone",
    price: 44_990,
    range: "330 mi",
    topSpeed: "155 mph",
    accel: "3.5 s",
    color: "from-zinc-900 to-neutral-800",
    img: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=900&q=80",
  },
  {
    model: "Cybertruck",
    tagline: "Built For The Future",
    price: 79_990,
    range: "340 mi",
    topSpeed: "130 mph",
    accel: "2.6 s",
    color: "from-slate-800 to-zinc-900",
    img: "https://images.unsplash.com/photo-1698517688825-3d5ca1a5c56f?w=900&q=80",
  },
  {
    model: "Roadster",
    tagline: "The Quickest Car Ever",
    price: 200_000,
    range: "620 mi",
    topSpeed: "250+ mph",
    accel: "1.9 s",
    color: "from-red-950 to-zinc-900",
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80",
  },
];

const PLANS = [
  {
    id: "explorer",
    name: "Fan Explorer",
    amount: 5_000,
    monthly: "5%",
    term: "12 months",
    perks: ["Giveaway entries", "Reward points", "Member card", "Community access"],
    highlight: false,
  },
  {
    id: "insider",
    name: "Fan Insider",
    amount: 8_500,
    monthly: "7%",
    term: "12 months",
    perks: ["All Explorer perks", "Priority support", "Digital assets access", "2× reward multiplier"],
    highlight: true,
  },
  {
    id: "founder",
    name: "Fan Founder",
    amount: 15_000,
    monthly: "10%",
    term: "12 months",
    perks: ["All Insider perks", "VIP events", "Dedicated advisor", "5× reward multiplier", "Early car access"],
    highlight: false,
  },
];

const SERVICES = [
  { icon: "⚡", title: "High-Conviction Investments", desc: "Curated opportunities vetted by our expert team — clean energy, next-gen tech." },
  { icon: "🎁", title: "Exclusive Giveaways", desc: "Members earn entries to premium draws including Tesla vehicles and cash prizes." },
  { icon: "💎", title: "Digital Assets", desc: "Early access to digital asset offerings and tokenized investment vehicles." },
  { icon: "🏆", title: "Rewards Program", desc: "Earn points on every activity. Redeem for credits, merch, or cash back." },
  { icon: "🚗", title: "Tesla Showroom", desc: "Purchase any Tesla model through the platform with member-exclusive benefits." },
  { icon: "👥", title: "Community", desc: "Private network of investors and entrepreneurs — global, curated, exclusive." },
];

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [splashDone, setSplashDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [carIdx, setCarIdx] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setSplashDone(true), 2400);
    const t2 = setTimeout(() => setVisible(true), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!splashDone) return;
    const interval = setInterval(() => setCarIdx(i => (i + 1) % CARS.length), 5000);
    return () => clearInterval(interval);
  }, [splashDone]);

  const car = CARS[carIdx];

  return (
    <div style={{ minHeight: "100vh", background: "#080d14", color: "#e8eaec", fontFamily: "'Inter', system-ui, sans-serif", overflowX: "hidden" }}>
      {/* ── SPLASH ── */}
      {!splashDone && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#080d14",
          animation: "fadeOutSplash 0.5s 2.1s ease forwards",
        }}>
          <style>{`
            @keyframes fadeInTitle { from { opacity:0; letter-spacing:0.6em } to { opacity:1; letter-spacing:0.2em } }
            @keyframes growLine { from { width:0 } to { width:100% } }
            @keyframes fadeOutSplash { to { opacity:0; pointer-events:none } }
          `}</style>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: "clamp(24px,5vw,42px)", fontWeight: 300, letterSpacing: "0.2em",
              animation: "fadeInTitle 1s 0.2s ease both",
              display: "flex", gap: "0.3em",
            }}>
              <span style={{ color: "#e8eaec" }}>TESLA</span>
              <span style={{ color: "#4a5568" }}>PRO</span>
            </div>
            <div style={{ display: "flex", marginTop: 16, height: 1, overflow: "hidden", gap: 0 }}>
              <div style={{ background: "#e8eaec", height: 1, animation: "growLine 0.7s 0.9s ease both", width: 0 }} />
              <div style={{ background: "#2e3843", height: 1, animation: "growLine 0.7s 1.0s ease both", width: 0 }} />
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.7s ease" }}>

        {/* Nav */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 48px", borderBottom: "1px solid #1a2332",
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(8,13,20,0.95)", backdropFilter: "blur(12px)",
        }}>
          <span style={{ fontWeight: 300, fontSize: 16, letterSpacing: "0.4em", color: "#8b95a1" }}>TESLA PRO</span>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => navigate("/showroom")} style={navBtn(false)}>Showroom</button>
            <button onClick={() => navigate("/register")} style={navBtn(false)}>Apply</button>
            <button onClick={() => navigate("/login")} style={navBtn(true)}>Sign In</button>
          </div>
        </nav>

        {/* ── HERO with Car Showcase ── */}
        <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* Background car image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${car.img})`,
            backgroundSize: "cover", backgroundPosition: "center",
            transition: "opacity 0.8s ease",
            opacity: 0.18,
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #080d14 50%, transparent 100%)" }} />

          <div style={{ position: "relative", zIndex: 10, padding: "80px 48px", maxWidth: 680 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.35em", color: "#e31937", textTransform: "uppercase", marginBottom: 20 }}>
              Membership Platform
            </div>
            <h1 style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 300, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
              Exclusive access for<br /><em style={{ fontStyle: "normal", fontWeight: 500 }}>serious investors</em>
            </h1>
            <p style={{ fontSize: 17, color: "#8b95a1", maxWidth: 480, margin: "0 0 40px", lineHeight: 1.75 }}>
              Invest in plans, buy Teslas, earn rewards, and participate in exclusive giveaways — all in one premium platform.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => navigate("/register")} style={primaryBtn}>Apply for Membership</button>
              <button onClick={() => navigate("/showroom")} style={outlineBtn}>Browse Showroom</button>
            </div>
          </div>

          {/* Car dots */}
          <div style={{ position: "absolute", bottom: 32, left: 48, display: "flex", gap: 8 }}>
            {CARS.map((_, i) => (
              <button key={i} onClick={() => setCarIdx(i)} style={{
                width: i === carIdx ? 24 : 8, height: 3,
                background: i === carIdx ? "#e31937" : "#2e3843",
                border: "none", cursor: "pointer", borderRadius: 2,
                transition: "all 0.3s ease", padding: 0,
              }} />
            ))}
          </div>
        </section>

        {/* ── INVESTMENT PLANS ── */}
        <section style={{ padding: "100px 48px", background: "#0a0f18" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.35em", color: "#e31937", textTransform: "uppercase", marginBottom: 12 }}>
                Investment Plans
              </p>
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, margin: 0 }}>
                Choose your membership tier
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {PLANS.map(plan => (
                <div key={plan.id} style={{
                  background: plan.highlight ? "#0d1a2e" : "#0d1520",
                  border: `1px solid ${plan.highlight ? "#1e3a5f" : "#1a2332"}`,
                  borderRadius: 12, padding: "40px 32px",
                  position: "relative", overflow: "hidden",
                }}>
                  {plan.highlight && (
                    <div style={{
                      position: "absolute", top: 0, right: 0,
                      background: "#e31937", color: "#fff", fontSize: 10,
                      letterSpacing: "0.15em", padding: "6px 16px",
                      borderBottomLeftRadius: 8, fontWeight: 700,
                    }}>POPULAR</div>
                  )}
                  <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "#8b95a1", textTransform: "uppercase", marginBottom: 8 }}>
                    {plan.name}
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 700, color: "#e8eaec", marginBottom: 4 }}>
                    ${plan.amount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 13, color: "#8b95a1", marginBottom: 8 }}>
                    one-time investment
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
                    <span style={pill}>{plan.monthly}/mo returns</span>
                    <span style={pill}>{plan.term}</span>
                  </div>
                  <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.perks.map(p => (
                      <li key={p} style={{ display: "flex", gap: 10, fontSize: 14, color: "#c0c8d4", alignItems: "center" }}>
                        <span style={{ color: "#22c55e", fontSize: 16 }}>✓</span>{p}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/register")}
                    style={{
                      width: "100%", padding: "13px 0",
                      background: plan.highlight ? "#e31937" : "transparent",
                      border: `1px solid ${plan.highlight ? "#e31937" : "#2e3843"}`,
                      color: plan.highlight ? "#fff" : "#8b95a1",
                      borderRadius: 4, cursor: "pointer", fontSize: 13,
                      letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase",
                      transition: "all 0.2s",
                    }}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CAR SHOWROOM PREVIEW ── */}
        <section style={{ padding: "100px 48px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.35em", color: "#e31937", textTransform: "uppercase", marginBottom: 12 }}>
              Tesla Showroom
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 300, margin: "0 0 16px" }}>
              Buy your next Tesla online
            </h2>
            <p style={{ color: "#8b95a1", fontSize: 16 }}>Members get exclusive benefits on every purchase</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {CARS.slice(0, 3).map(c => (
              <div key={c.model} onClick={() => navigate("/showroom")} style={{
                background: "#0d1520", border: "1px solid #1a2332", borderRadius: 10,
                overflow: "hidden", cursor: "pointer",
                transition: "border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e31937"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1a2332"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ height: 200, backgroundImage: `url(${c.img})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.85 }} />
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: 18, fontWeight: 500, color: "#e8eaec", marginBottom: 4 }}>{c.model}</div>
                  <div style={{ fontSize: 13, color: "#8b95a1", marginBottom: 12 }}>{c.tagline}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#e31937" }}>
                    ${c.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button onClick={() => navigate("/showroom")} style={outlineBtn}>View All Models →</button>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section style={{ padding: "80px 48px", background: "#0a0f18" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.35em", color: "#8b95a1", textTransform: "uppercase", marginBottom: 48 }}>
              Member Services
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {SERVICES.map(s => (
                <div key={s.title} style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 8, padding: "28px 24px" }}>
                  <div style={{ fontSize: 26, marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#e8eaec", marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: "#8b95a1", lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "80px 48px", textAlign: "center", borderTop: "1px solid #1a2332" }}>
          <h2 style={{ fontSize: 32, fontWeight: 300, marginBottom: 12 }}>Ready to invest?</h2>
          <p style={{ color: "#8b95a1", marginBottom: 32, fontSize: 15 }}>Membership is by application only. Limited spots available.</p>
          <button onClick={() => navigate("/register")} style={primaryBtn}>Apply for Membership</button>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ padding: "28px 48px", borderTop: "1px solid #1a2332", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: "#3a4552", fontSize: 12 }}>© {new Date().getFullYear()} Tesla Pro. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "#3a4552", fontSize: 12, cursor: "pointer" }}>Sign In</button>
            <button onClick={() => navigate("/register")} style={{ background: "none", border: "none", color: "#3a4552", fontSize: 12, cursor: "pointer" }}>Apply</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  padding: "14px 36px", background: "#e31937", border: "none",
  color: "#fff", borderRadius: 4, cursor: "pointer", fontSize: 14,
  letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase",
};
const outlineBtn: React.CSSProperties = {
  padding: "14px 36px", background: "transparent", border: "1px solid #2e3843",
  color: "#8b95a1", borderRadius: 4, cursor: "pointer", fontSize: 14, letterSpacing: "0.05em",
};
const navBtn = (primary: boolean): React.CSSProperties => ({
  padding: "8px 20px",
  background: primary ? "#e31937" : "transparent",
  border: primary ? "none" : "1px solid #2e3843",
  color: primary ? "#fff" : "#8b95a1",
  borderRadius: 4, cursor: "pointer", fontSize: 13, letterSpacing: "0.05em", fontWeight: primary ? 600 : 400,
});
const pill: React.CSSProperties = {
  padding: "4px 10px", background: "#1a2332", borderRadius: 20,
  fontSize: 11, color: "#8b95a1", letterSpacing: "0.05em",
};
