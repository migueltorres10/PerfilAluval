import { useLocation } from "react-router-dom";

const titleByPath = (path) => {
  const map = {
    "/home": "Home",
    "/obras": "Obras",
    "/clientes": "Clientes",
    "/fornecedores": "Fornecedores",
    "/funcionarios": "Funcionários",
    "/artigos-compra": "Artigos/Serviços (Compra)",
    "/artigos-venda": "Artigos/Serviços (Venda)",
    "/producao": "Produção",
    "/montagens-entregas": "Montagens/Entregas",
  };
  return map[path] || "Página";
};

export default function TopBar({ onOpenMobileNav, isCollapsed, onToggleCollapse }) {
  const { pathname } = useLocation();

  return (
    <header className="topBar">
      <div className="topLeft">
        <button className="iconBtn mobileOnly" onClick={onOpenMobileNav} title="Menu">
          ☰
        </button>

        <button className="iconBtn desktopOnly" onClick={onToggleCollapse} title="Colapsar/Expandir sidebar">
          {isCollapsed ? "»" : "«"}
        </button>

        <div className="pageTitle">{titleByPath(pathname)}</div>
      </div>

      <div className="topRight">
        {/* Botões do topo ainda por decidir — placeholder */}
        <div className="topPlaceholder">Ações (por definir)</div>
      </div>
    </header>
  );
}
