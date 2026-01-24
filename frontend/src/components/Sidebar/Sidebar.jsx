import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../app/nav.config";


export default function Sidebar({
  variant = "desktop",            // "desktop" | "mobile"
  isCollapsed = false,            // true/false
  onToggleCollapse = () => {},    // toggle do colapso (desktop)
  onNavigate = () => {},          // usado para fechar drawer no mobile
}) {
  return (
    <aside className={`sidebar ${variant} ${isCollapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebarHeader">
        <div className="brand">
          <div className="brandMark">PA</div>
          {!isCollapsed && (
            <div className="brandText">
              <div className="brandName">Perfil Aluval</div>
              <div className="brandSub">Gestão</div>
            </div>
          )}
        </div>

        {/*{variant === "desktop" && (
          <button
            type="button"
            className="iconBtn"
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expandir" : "Colapsar"}
          >
            {isCollapsed ? "»" : "«"}
          </button>
        )}*/}
      </div>

      {/* Nav */}
      <nav className="sidebarNav">
        {NAV_ITEMS.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "navItem",
                isActive ? "active" : "",
                isCollapsed ? "isCollapsed" : "",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            <span className="navIcon" aria-hidden="true">
              {it.icon}
            </span>

            {!isCollapsed && <span className="navLabel">{it.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebarFooter">
        {!isCollapsed ? (
          <div className="sidebarMeta">
            <div className="metaTitle">Sessão</div>
            <div className="metaSub">Utilizador</div>
          </div>
        ) : (
          <div className="sidebarMetaCollapsed">•</div>
        )}
      </div>
    </aside>
  );
}
