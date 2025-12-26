import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: "#111",
  background: isActive ? "#e8eefc" : "transparent",
  display: "block",
});

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        borderRight: "1px solid #eee",
        padding: 16,
        background: "#fafafa",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>PERFIL ALUVAL</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Gestão</div>
      </div>

      <nav style={{ display: "grid", gap: 6 }}>
        <NavLink to="/" end style={linkStyle}>
          Rosto
        </NavLink>
      </nav>
    </aside>
  );
}
