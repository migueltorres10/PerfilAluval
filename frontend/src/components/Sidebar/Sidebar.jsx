import { useState } from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../app/nav.config";

export default function Sidebar({
  variant = "desktop",            // "desktop" | "mobile"
  isCollapsed = false,            // true/false
  onToggleCollapse = () => {},    // toggle do colapso (desktop)
  onNavigate = () => {},          // usado para fechar drawer no mobile
}) {
  const [openMenus, setOpenMenus] = useState({ "Recursos Humanos": true }); // default open

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

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
      </div>

      {/* Nav */}
      <nav className="sidebarNav">
        {NAV_ITEMS.map((it) => {
          if (it.subItems) {
            const isOpen = openMenus[it.label];
            return (
              <div key={it.label} className="navGroup" style={{ marginBottom: 4 }}>
                <button
                  type="button"
                  className={`navItem ${isCollapsed ? "isCollapsed" : ""}`}
                  onClick={() => toggleMenu(it.label)}
                  style={{ width: "100%", justifyContent: "space-between", background: "none", textAlign: "left", cursor: "pointer", border: "1px solid transparent" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="navIcon" aria-hidden="true">{it.icon}</span>
                    {!isCollapsed && <span className="navLabel">{it.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="navChevron" style={{ fontSize: 12, opacity: 0.6 }}>
                      {isOpen ? "▼" : "▶"}
                    </span>
                  )}
                </button>
                {isOpen && !isCollapsed && (
                  <div className="navSubgroup" style={{ paddingLeft: 12, display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                    {it.subItems.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          ["navItem", isActive ? "active" : ""].filter(Boolean).join(" ")
                        }
                        style={{ padding: "8px 10px", fontSize: "0.95em" }}
                      >
                        <span className="navIcon" aria-hidden="true" style={{ width: 20 }}>{sub.icon}</span>
                        <span className="navLabel">{sub.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
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
          );
        })}
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
