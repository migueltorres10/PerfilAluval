export function FormField({ label, error, children }) {
  return (
    <div className="formGroup">
      <label>
        {label}
        {error && (
          <span style={{ marginLeft: 8, color: "rgba(255,120,120,0.95)" }}>
            {error}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
