import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/obras", label: "Obras", icon: "🏗️" },
  { to: "/clientes", label: "Clientes", icon: "👤" },
  { to: "/fornecedores", label: "Fornecedores", icon: "🚚" },
  { to: "/funcionarios", label: "Funcionários", icon: "🧑‍🏭" },
  { to: "/artigos-compra", label: "Artigos/Serviços (Compra)", icon: "🧾" },
  { to: "/artigos-venda", label: "Artigos/Serviços (Venda)", icon: "🛒" },
  { to: "/producao", label: "Produção", icon: "🏭" },
  { to: "/montagens-entregas", label: "Montagens/Entregas", icon: "📦" },
];

export default function Sidebar({
  variant, // "desktop" | "mobile"
  isCollapsed,
  onToggleCollapse,
  onNavigate,
}) {
  return (
    <div className={`sidebar ${variant}`}>
      <div className="sidebarHeader">
        <div className="brand">
          <div className="brandMark">PA</div>
          {!isCollapsed && <div className="brandText">Perfil Aluval</div>}
        </div>

        {variant === "desktop" && (
          <button className="iconBtn" onClick={onToggleCollapse} title="Colapsar/Expandir">
            {isCollapsed ? "»" : "«"}
          </button>
        )}

        {variant === "mobile" && (
          <button className="iconBtn" onClick={onNavigate} title="Fechar">
            ✕
          </button>
        )}
      </div>

      <nav className="sidebarNav">
        {navItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `navItem ${isActive ? "active" : ""} ${isCollapsed ? "collapsed" : ""}`
            }
            onClick={onNavigate}
          >
            <span className="navIcon" aria-hidden="true">
              {it.icon}
            </span>
            {!isCollapsed && <span className="navLabel">{it.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebarFooter">
        {!isCollapsed ? (
          <div className="footerHint">v0.1 • Shell</div>
        ) : (
          <div className="footerHint" title="v0.1 • Shell">
            •
          </div>
        )}
      </div>
    </div>
  );
}
