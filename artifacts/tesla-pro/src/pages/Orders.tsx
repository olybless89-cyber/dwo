import { useListOrders } from "@workspace/api-client-react";
import { AppLayout } from "@/components/AppLayout";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:    { bg: "#1a2a1a", color: "#f59e0b" },
  confirmed:  { bg: "#1a2a1a", color: "#22c55e" },
  processing: { bg: "#1a2332", color: "#60a5fa" },
  delivered:  { bg: "#1a2a1a", color: "#22c55e" },
  cancelled:  { bg: "#2a1a1a", color: "#ef4444" },
};

const TYPE_LABEL: Record<string, string> = {
  merchandise: "Car Order",
  digital:     "Digital Asset",
  giveaway:    "Giveaway Entry",
  investment:  "Investment",
  deposit:     "Deposit",
  withdrawal:  "Withdrawal",
};

export default function OrdersPage() {
  const { data: orders, isLoading, isError } = useListOrders();

  const myOrders = (orders ?? [])
    .filter(o => ["merchandise", "digital", "giveaway", "investment"].includes(o.type))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <AppLayout>
      <div style={{ padding: "40px", maxWidth: 900, margin: "0 auto", color: "#e8eaec", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.3em", color: "#e31937", textTransform: "uppercase", marginBottom: 8 }}>Account</p>
          <h1 style={{ fontSize: 32, fontWeight: 300, margin: "0 0 8px" }}>My Orders</h1>
          <p style={{ color: "#8b95a1", fontSize: 14 }}>All your car purchases, digital assets, giveaway entries, and investments.</p>
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", padding: 80, color: "#8b95a1" }}>Loading orders…</div>
        )}

        {isError && (
          <div style={{ textAlign: "center", padding: 80, color: "#ef4444" }}>Failed to load orders. Please refresh.</div>
        )}

        {!isLoading && !isError && myOrders.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, background: "#0d1520", borderRadius: 12, border: "1px solid #1a2332" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📦</div>
            <p style={{ color: "#8b95a1", fontSize: 15, marginBottom: 8 }}>No orders yet</p>
            <p style={{ color: "#4a5568", fontSize: 13 }}>Visit the Car Showroom or Digital Assets to place your first order.</p>
          </div>
        )}

        {!isLoading && !isError && myOrders.length > 0 && (
          <div style={{ background: "#0d1520", border: "1px solid #1a2332", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1a2332" }}>
                  {["Date", "Type", "Description", "Amount", "Status"].map(h => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, color: "#8b95a1", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myOrders.map((o, i) => {
                  const sc = STATUS_STYLE[o.status] ?? { bg: "#1a2332", color: "#c0c8d4" };
                  return (
                    <tr key={o.id} style={{ borderBottom: i < myOrders.length - 1 ? "1px solid #0f1824" : "none" }}>
                      <td style={{ padding: "14px 16px", color: "#8b95a1", fontSize: 13, whiteSpace: "nowrap" }}>
                        {new Date(o.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, background: "#1a2332", color: "#c0c8d4" }}>
                          {TYPE_LABEL[o.type] ?? o.type}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#8b95a1", maxWidth: 260, fontSize: 13 }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.description}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>
                        ${o.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.color }}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
