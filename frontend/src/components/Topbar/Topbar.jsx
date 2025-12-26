import { useLocation } from "react-router-dom";

const titleByPath = (path) => {
  if (path === "/") return "Home";
  if (path === "/clientes") return "Clientes";
  if (path === "/clientes/novo") return "Novo Cliente";
  if (path.startsWith("/clientes/") && path.endsWith("/eliminar")) return "Eliminar Cliente";
  if (path.startsWith("/clientes/")) return "Editar Cliente";

  if (path === "/obras") return "Obras";
  if (path === "/fornecedores") return "Fornecedores";
  if (path === "/funcionarios") return "Funcionários";
  if (path === "/artigos-compra") return "Artigos/Serviços (Compra)";
  if (path === "/artigos-venda") return "Artigos/Serviços (Venda)";
  if (path === "/producao") return "Produção";
  if (path === "/montagens-entregas") return "Montagens/Entregas";

  return "Página";
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
