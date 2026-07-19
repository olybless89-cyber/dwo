import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useGetMe, useCreateOrder } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];
const BANKS = [
  { id: "wire", label: "Wire Transfer", icon: "🏦", sub: "International / SWIFT — 1–3 business days" },
  { id: "crypto", label: "USDT (TRC-20)", icon: "💎", sub: "Tether stablecoin — instant confirmation" },
  { id: "card", label: "Debit/Credit Card", icon: "💳", sub: "Visa, Mastercard — instant" },
];

export default function DepositPage() {
  const { data: user } = useGetMe();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState("wire");
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    if (!amount || Number(amount) < 100) {
      toast({ title: "Invalid amount", description: "Minimum deposit is $100.", variant: "destructive" });
      return;
    }
    createOrder.mutate({
      data: {
        type: "deposit",
        description: `Deposit via ${BANKS.find(b => b.id === method)?.label} — Pending approval`,
        amount: Number(amount),
      }
    }, {
      onSuccess: () => setDone(true),
      onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
    });
  };

  const methodInfo: Record<string, { name: string; detail: string; ref: string }> = {
    wire: {
      name: "Wire Transfer",
      detail: "Send to our designated bank account. Include your member code in the reference.",
      ref: `Reference: ${user?.memberCode || "TP-XXXX-XXXX"}`,
    },
    crypto: {
      name: "USDT TRC-20",
      detail: "Send USDT to the address below. Network: TRON (TRC-20) only.",
      ref: "Wallet: TQn8HKm…abc123 (shown after confirmation)",
    },
    card: {
      name: "Card Payment",
      detail: "A secure payment link will be sent to your email after submission.",
      ref: `Email: ${user?.email}`,
    },
  };

  return (
    <AppLayout>
      <div style={{ padding: "40px", maxWidth: 560, margin: "0 auto", color: "#e8eaec", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#e31937", textTransform: "uppercase", marginBottom: 8 }}>Wallet</p>
          <h1 style={{ fontSize: 32, fontWeight: 300, margin: "0 0 8px" }}>Deposit Funds</h1>
          <p style={{ color: "#8b95a1", fontSize: 14 }}>Add funds to your Tesla Pro wallet balance.</p>
        </div>

        {/* Balance */}
        <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 10, padding: "20px 24px", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#8b95a1", letterSpacing: "0.1em" }}>CURRENT BALANCE</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#22c55e", marginTop: 4 }}>
              ${user?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ fontSize: 32 }}>💰</div>
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 400, color: "#e8eaec", marginBottom: 12 }}>Deposit Request Submitted</h2>
            <p style={{ color: "#8b95a1", fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>
              Your deposit of <strong style={{ color: "#e8eaec" }}>${Number(amount).toLocaleString()}</strong> via {BANKS.find(b => b.id === method)?.label} is under review.
            </p>
            <p style={{ color: "#8b95a1", fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>
              {methodInfo[method].detail}<br />
              <span style={{ color: "#e8eaec", fontFamily: "monospace" }}>{methodInfo[method].ref}</span>
            </p>
            <button onClick={() => { setDone(false); setAmount(""); setStep(1); }} style={{ padding: "12px 28px", background: "#e31937", border: "none", color: "#fff", borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Make Another Deposit
            </button>
          </div>
        ) : (
          <>
            {/* Amount */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: "#8b95a1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Amount (USD)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {AMOUNTS.map(a => (
                  <button key={a} onClick={() => setAmount(a)} style={{
                    padding: "8px 16px", borderRadius: 6,
                    background: amount === a ? "#e31937" : "#0d1520",
                    border: `1px solid ${amount === a ? "#e31937" : "#1a2332"}`,
                    color: amount === a ? "#fff" : "#8b95a1", fontSize: 13, cursor: "pointer",
                  }}>${a.toLocaleString()}</button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Or enter custom amount…"
                value={amount === "" ? "" : amount}
                onChange={e => setAmount(e.target.value ? Number(e.target.value) : "")}
                style={{ width: "100%", padding: "12px 16px", background: "#0d1520", border: "1px solid #1a2332", borderRadius: 6, color: "#e8eaec", fontSize: 15, outline: "none", boxSizing: "border-box" }}
              />
              <div style={{ fontSize: 11, color: "#8b95a1", marginTop: 6 }}>Minimum deposit: $100</div>
            </div>

            {/* Method */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, color: "#8b95a1", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Payment Method</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {BANKS.map(b => (
                  <label key={b.id} onClick={() => setMethod(b.id)} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                    background: method === b.id ? "#0d1a2e" : "#0a0f18",
                    border: `1px solid ${method === b.id ? "#1e3a5f" : "#1a2332"}`,
                    borderRadius: 8, cursor: "pointer",
                  }}>
                    <div style={{ fontSize: 22 }}>{b.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: "#e8eaec", fontWeight: 500 }}>{b.label}</div>
                      <div style={{ fontSize: 12, color: "#8b95a1" }}>{b.sub}</div>
                    </div>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      border: `2px solid ${method === b.id ? "#e31937" : "#2e3843"}`,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      {method === b.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e31937" }} />}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={createOrder.isPending || !amount}
              style={{
                width: "100%", padding: "14px 0", background: "#e31937", border: "none",
                color: "#fff", borderRadius: 4, fontSize: 14, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
                opacity: createOrder.isPending || !amount ? 0.6 : 1,
              }}
            >
              {createOrder.isPending ? "Submitting…" : `Submit Deposit — $${Number(amount || 0).toLocaleString()}`}
            </button>
          </>
        )}
      </div>
    </AppLayout>
  );
}
