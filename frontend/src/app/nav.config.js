// src/app/nav.config.js

export const NAV_ITEMS = [
  { to: "/", label: "Home", icon: "🏠" },
  {
    label: "Produção e Obras", icon: "🏗️",
    subItems: [
      { to: "/obras", label: "Gestão de Obras", icon: "🏗️" },
      { to: "/montagens-entregas", label: "Montagens/Entregas", icon: "📦" },
      { to: "/parametros-obras", label: "Tipos e Estados de Obra", icon: "⚙️" },
    ]
  },
  {
    label: "Artigos e Serviços", icon: "🛒",
    subItems: [
      { to: "/artigos", label: "Gestão de Artigos", icon: "🧾" },
      { to: "/parametros-artigos", label: "Unidades e Famílias", icon: "⚙️" },
    ]
  },
  { to: "/clientes", label: "Clientes", icon: "👤" },
  { to: "/fornecedores", label: "Fornecedores", icon: "🚚" },
  {
    label: "Recursos Humanos", icon: "👥",
    subItems: [
      { to: "/funcionarios", label: "Funcionários", icon: "🧑‍🏭" },
      { to: "/departamentos-funcoes", label: "Funções e Departamentos", icon: "🏢" },
      { to: "/tipos-contrato", label: "Tipos de Contrato", icon: "📄" },
    ]
  },
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
