export default function Topbar() {
  return (
    <header
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #eee",
        background: "white",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ fontWeight: 700 }}>Página de rosto</div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => alert("Novo (exemplo)")}>+ Novo</button>
        <button onClick={() => alert("Exportar (exemplo)")}>Exportar</button>
      </div>
    </header>
  );
}
