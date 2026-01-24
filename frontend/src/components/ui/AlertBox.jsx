export function AlertBox({ children, variant = "error" }) {
  if (!children) return null;

  const stylesByVariant = {
    error: {
      background: "rgba(255,0,0,0.10)",
      border: "1px solid rgba(255,0,0,0.30)",
      color: "rgba(255,255,255,0.92)",
    },
    success: {
      background: "rgba(0,255,0,0.10)",
      border: "1px solid rgba(0,255,0,0.30)",
      color: "rgba(255,255,255,0.92)",
    },
    info: {
      background: "rgba(59,130,246,0.12)",
      border: "1px solid rgba(59,130,246,0.35)",
      color: "rgba(255,255,255,0.92)",
    },
  };

  const v = stylesByVariant[variant] ? variant : "error";

  return (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        ...stylesByVariant[v],
      }}
    >
      {children}
    </div>
  );
}