export function AlertBox({ children }) {
  if (!children) return null;
  return (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        background: "rgba(255,0,0,0.10)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {children}
    </div>
  );
}
