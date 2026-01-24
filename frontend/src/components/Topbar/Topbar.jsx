import { useLocation } from "react-router-dom";
import { getPageTitle } from "../../app/nav.config";

export default function Topbar({
  onOpenMobileNav = () => {},     // abre drawer no mobile
  isCollapsed = false,            // estado do sidebar (desktop)
  onToggleCollapse = () => {},    // toggle do sidebar (desktop)
  rightActions = null,            // opcional: JSX de ações à direita
}) {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <header className="topBar">
      <div className="topLeft">
        {/* Mobile menu */}
        <button
          type="button"
          className="iconBtn mobileOnly"
          onClick={onOpenMobileNav}
          title="Abrir menu"
        >
          ☰
        </button>

        {/* Desktop collapse */}
        <button
          type="button"
          className="iconBtn desktopOnly"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? "»" : "«"}
        </button>

        <div className="pageTitle">{title}</div>
      </div>

      <div className="topRight">
        {rightActions ?? (
          <div className="topActionsPlaceholder" style={{ opacity: 0.75 }}>
            {/* placeholder (podes remover) */}
          </div>
        )}
      </div>
    </header>
  );
}
