import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useGetMe, useCreateOrder, useListOrders } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const PLANS = [
  {
    id: "fan-explorer",
    name: "Fan Explorer",
    amount: 5_000,
    monthly: "5%",
    term: "12 months",
    totalReturn: "60%",
    perks: ["Giveaway entries", "Reward points", "Member card", "Community access"],
    highlight: false,
    color: "#0d1a2e",
    border: "#1e2d3d",
  },
  {
    id: "fan-insider",
    name: "Fan Insider",
    amount: 8_500,
    monthly: "7%",
    term: "12 months",
    totalReturn: "84%",
    perks: ["All Explorer perks", "Priority support", "Digital assets access", "2× reward multiplier"],
    highlight: true,
    color: "#0f1d2f",
    border: "#1e3a5f",
  },
  {
    id: "fan-founder",
    name: "Fan Founder",
    amount: 15_000,
    monthly: "10%",
    term: "12 months",
    totalReturn: "120%",
    perks: ["All Insider perks", "VIP events", "Dedicated advisor", "5× reward multiplier", "Early car access"],
    highlight: false,
    color: "#0d1520",
    border: "#2a1f3d",
  },
];

export default function InvestPage() {
  const { data: user } = useGetMe();
  const { data: allOrders } = useListOrders({ userId: user?.id });
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<string | null>(null);

  const myInvestments = allOrders?.filter(o => o.type === "investment") || [];

  const handleApply = (plan: typeof PLANS[0]) => {
    setApplying(plan.id);
    createOrder.mutate({
      data: {
        type: "investment",
        description: `${plan.name} Investment Plan — ${plan.monthly}/mo × ${plan.term}`,
        amount: plan.amount,
      }
    }, {
      onSuccess: () => {
        setApplied(plan.id);
        setApplying(null);
        toast({ title: "Application Submitted", description: `Your ${plan.name} application is under review. We'll notify you shortly.` });
      },
      onError: (err: any) => {
        setApplying(null);
        toast({ title: "Failed", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <AppLayout>
      <div style={{ padding: "40px 40px", maxWidth: 1100, margin: "0 auto", color: "#e8eaec", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#e31937", textTransform: "uppercase", marginBottom: 8 }}>Investment Plans</p>
          <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 300, margin: "0 0 12px" }}>Choose Your Plan</h1>
          <p style={{ color: "#8b95a1", fontSize: 15 }}>
            All plans run for 12 months with monthly returns credited to your wallet.
          </p>
        </div>

        {/* Active Investments */}
        {myInvestments.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 13, letterSpacing: "0.2em", color: "#8b95a1", textTransform: "uppercase", marginBottom: 16 }}>Your Active Investments</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myInvestments.map(inv => (
                <div key={inv.id} style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 8, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ color: "#e8eaec", fontWeight: 500 }}>{inv.description}</div>
                    <div style={{ color: "#8b95a1", fontSize: 12, marginTop: 2 }}>{format(new Date(inv.createdAt), "MMM dd, yyyy")}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#e8eaec" }}>${inv.amount.toLocaleString()}</div>
                    <span style={{
                      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
                      background: inv.status === "confirmed" ? "rgba(34,197,94,0.15)" : inv.status === "cancelled" ? "rgba(239,68,68,0.15)" : "rgba(234,179,8,0.15)",
                      color: inv.status === "confirmed" ? "#22c55e" : inv.status === "cancelled" ? "#ef4444" : "#eab308",
                    }}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {PLANS.map(plan => {
            const alreadyApplied = myInvestments.some(o => o.description.startsWith(plan.name));
            return (
              <div key={plan.id} style={{
                background: plan.color, border: `1px solid ${plan.border}`,
                borderRadius: 12, padding: "36px 28px", position: "relative", overflow: "hidden",
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: 0, right: 0, background: "#e31937", color: "#fff", fontSize: 10, letterSpacing: "0.15em", padding: "6px 16px", borderBottomLeftRadius: 8, fontWeight: 700 }}>POPULAR</div>
                )}
                <div style={{ fontSize: 12, letterSpacing: "0.2em", color: "#8b95a1", textTransform: "uppercase", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: "#e8eaec", marginBottom: 2 }}>${plan.amount.toLocaleString()}</div>
                <div style={{ fontSize: 13, color: "#8b95a1", marginBottom: 16 }}>one-time investment</div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24, background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "14px" }}>
                  {[["Monthly", plan.monthly], ["Term", plan.term], ["Total Return", plan.totalReturn]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10, color: "#8b95a1", letterSpacing: "0.1em" }}>{k}</div>
                      <div style={{ fontSize: 15, color: plan.highlight ? "#60a5fa" : "#e8eaec", fontWeight: 700 }}>{v}</div>
                    </div>
                  ))}
                </div>

                <ul style={{ listStyle: "none", margin: "0 0 28px", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.perks.map(p => (
                    <li key={p} style={{ display: "flex", gap: 10, fontSize: 13, color: "#c0c8d4", alignItems: "flex-start" }}>
                      <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>{p}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={!!applying || alreadyApplied}
                  onClick={() => handleApply(plan)}
                  style={{
                    width: "100%", padding: "13px 0",
                    background: alreadyApplied ? "transparent" : plan.highlight ? "#e31937" : "transparent",
                    border: `1px solid ${alreadyApplied ? "#1a2332" : plan.highlight ? "#e31937" : "#2e3843"}`,
                    color: alreadyApplied ? "#8b95a1" : plan.highlight ? "#fff" : "#8b95a1",
                    borderRadius: 4, cursor: alreadyApplied ? "default" : "pointer",
                    fontSize: 13, letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase",
                    opacity: applying === plan.id ? 0.7 : 1,
                  }}
                >
                  {alreadyApplied ? "Applied ✓" : applying === plan.id ? "Submitting…" : "Apply Now"}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 48, background: "#0d1520", border: "1px solid #1a2332", borderRadius: 8, padding: "24px" }}>
          <h3 style={{ fontSize: 14, color: "#e8eaec", fontWeight: 500, marginBottom: 8 }}>How it works</h3>
          <ol style={{ paddingLeft: 20, color: "#8b95a1", fontSize: 13, lineHeight: 2 }}>
            <li>Submit your plan application above.</li>
            <li>Our team reviews and confirms within 24 hours.</li>
            <li>Make your investment via bank transfer or wallet.</li>
            <li>Monthly returns are credited to your Tesla Pro wallet.</li>
            <li>At term end, your principal is returned alongside final payout.</li>
          </ol>
        </div>
      </div>
    </AppLayout>
  );
}
