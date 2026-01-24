// src/app/nav.config.js

export const NAV_ITEMS = [
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

export function getPageTitle(path) {
  // Clientes (rotas dinâmicas)
  if (path === "/clientes") return "Clientes";
  if (path === "/clientes/novo") return "Novo Cliente";
  if (path.startsWith("/clientes/") && path.endsWith("/eliminar")) return "Eliminar Cliente";
  if (path.startsWith("/clientes/")) return "Editar Cliente";

  const hit = NAV_ITEMS.find((x) => x.to === path);
  return hit ? hit.label : "Página";
}
