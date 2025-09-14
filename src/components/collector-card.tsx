import React from "react";

export type Collector = {
  name: string;
  address: string;
  phone: string;
  email: string;
  district: string;
};

interface CollectorCardProps {
  collector: Collector;
  onView?: () => void;
  onDelete?: () => void;
}

export const CollectorCard: React.FC<CollectorCardProps> = ({ collector, onView, onDelete }) => {
  return (
    <div
      className="collector-card"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fefbf7 100%)",
        borderRadius: "0.75rem",
        padding: "0.75rem",
        width: "100%",
        minWidth: 350,
        maxWidth: 400,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{
          background: "#fbbf24",
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          color: "#fff",
          fontSize: 16,
        }}>
          {/* Person Icon */}
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="white"/><rect x="6" y="16" width="12" height="4" rx="2" fill="white"/></svg>
        </span>
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1e293b" }}>{collector.name}</div>
          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{collector.district}</div>
        </div>
      </div>
      <div style={{ fontSize: "0.8rem", color: "#334155" }}>
        <div><strong>Address:</strong> {collector.address}</div>
        <div><strong>Phone:</strong> {collector.phone}</div>
        <div><strong>Email:</strong> {collector.email}</div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
        <button
          onClick={onView}
          style={{
            flex: 1,
            background: "linear-gradient(90deg, #fb923c 0%, #f59e42 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.4rem 0",
            fontWeight: 600,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(251,146,60,0.08)",
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 5c-7 0-9 7-9 7s2 7 9 7 9-7 9-7-2-7-9-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" fill="#fff"/></svg>
          View
        </button>
        <button
          onClick={onDelete}
          style={{
            flex: 1,
            background: "#fff",
            color: "#ef4444",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "0.4rem 0",
            fontWeight: 600,
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            cursor: "pointer",
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 7h12M9 7V5a3 3 0 0 1 6 0v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Delete
        </button>
      </div>
    </div>
  );
};
