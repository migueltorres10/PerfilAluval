export function FormField({ label, error, children }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <div style={{ fontWeight: 650, fontSize: 13 }}>
        {label}
        {error && (
          <span style={{ marginLeft: 8, color: "rgba(255,120,120,0.95)" }}>
            {error}
          </span>
        )}
      </div>
      {children}
    </label>
  );
}
