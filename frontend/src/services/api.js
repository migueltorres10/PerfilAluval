const API_URL = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const err = new Error("API error");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const paisesApi = {
  list: () => request("/api/paises"),
};

export const distritosApi = {
  list: () => request("/api/distritos"),
};

export const concelhosApi = {
  listByDistrito: (codDistrito) =>
    request(`/api/concelhos?distrito=${encodeURIComponent(codDistrito)}`),
};

export const codigosPostaisApi = {
  suggest: (q) =>
    request(`/api/codigos-postais?q=${encodeURIComponent(q)}`),
};

export const clientesApi = {
  list: ({ status = "active", q = "" } = {}) =>
    request(`/api/clientes?status=${encodeURIComponent(status)}&q=${encodeURIComponent(q)}`),

  

  create: (payload) =>
    request("/api/clientes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getById: (id) => request(`/api/clientes/${id}`),

  update: (id, payload) =>
    request(`/api/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    request(`/api/clientes/${id}`, {
      method: "DELETE",
    }),

  reativar: (id) =>
    request(`/api/clientes/${id}/reativar`, {
      method: "PATCH",
    }),
  
  stats: ({ q } = {}) => {
    const params = new URLSearchParams();
    if (q && String(q).trim()) params.set("q", String(q).trim());
    const qs = params.toString();
    return request(`/api/clientes/stats${qs ? `?${qs}` : ""}`);
},};

export const fornecedoresApi = {
  list: ({ status = "active", q = "" } = {}) =>
    request(`/api/fornecedores?status=${encodeURIComponent(status)}&q=${encodeURIComponent(q)}`),

  

  create: (payload) =>
    request("/api/fornecedores", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getById: (id) => request(`/api/fornecedores/${id}`),

  update: (id, payload) =>
    request(`/api/fornecedores/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    request(`/api/fornecedores/${id}`, {
      method: "DELETE",
    }),

  reativar: (id) =>
    request(`/api/fornecedores/${id}/reativar`, {
      method: "PATCH",
    }),
  
  stats: ({ q } = {}) => {
    const params = new URLSearchParams();
    if (q && String(q).trim()) params.set("q", String(q).trim());
    const qs = params.toString();
    return request(`/api/fornecedores/stats${qs ? `?${qs}` : ""}`);
  },
};

export const departamentosApi = {
  list: () => request("/api/departamentos"),
  getById: (id) => request(`/api/departamentos/${id}`),
  create: (payload) => request("/api/departamentos", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/departamentos/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/departamentos/${id}`, { method: "DELETE" }),
};

export const funcoesApi = {
  list: () => request("/api/funcoes"),
  getById: (id) => request(`/api/funcoes/${id}`),
  create: (payload) => request("/api/funcoes", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/funcoes/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/funcoes/${id}`, { method: "DELETE" }),
};

export const tiposContratoApi = {
  list: () => request("/api/tipos-contrato"),
  getById: (id) => request(`/api/tipos-contrato/${id}`),
  create: (payload) => request("/api/tipos-contrato", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/tipos-contrato/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/tipos-contrato/${id}`, { method: "DELETE" }),
};

export const funcionariosApi = {
  list: () => request("/api/funcionarios"),
  getById: (id) => request(`/api/funcionarios/${id}`),
  create: (payload) => request("/api/funcionarios", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/funcionarios/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/funcionarios/${id}`, { method: "DELETE" }),
};

// --- MÓDULO OBRAS ---
export const obrasEstadosApi = {
  list: () => request("/api/obras-estados"),
  getById: (id) => request(`/api/obras-estados/${id}`),
  create: (payload) => request("/api/obras-estados", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/obras-estados/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/obras-estados/${id}`, { method: "DELETE" }),
};

export const obrasTiposApi = {
  list: () => request("/api/obras-tipos"),
  getById: (id) => request(`/api/obras-tipos/${id}`),
  create: (payload) => request("/api/obras-tipos", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/obras-tipos/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/obras-tipos/${id}`, { method: "DELETE" }),
};

export const obrasApi = {
  list: () => request("/api/obras"),
  getById: (id) => request(`/api/obras/${id}`),
  create: (payload) => request("/api/obras", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/obras/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/obras/${id}`, { method: "DELETE" }),
};

export const obrasArtigosApi = {
  listByObra: (id) => request(`/api/obras-artigos/por-obra/${id}`),
  create: (payload) => request("/api/obras-artigos", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/obras-artigos/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/obras-artigos/${id}`, { method: "DELETE" }),
};

// --- MÓDULO ARTIGOS ---
export const artigoUnidadesApi = {
  list: () => request("/api/artigo-unidades"),
  getById: (id) => request(`/api/artigo-unidades/${id}`),
  create: (payload) => request("/api/artigo-unidades", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/artigo-unidades/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/artigo-unidades/${id}`, { method: "DELETE" }),
};

export const artigoFamiliasApi = {
  list: () => request("/api/artigo-familias"),
  getById: (id) => request(`/api/artigo-familias/${id}`),
  create: (payload) => request("/api/artigo-familias", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/artigo-familias/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/artigo-familias/${id}`, { method: "DELETE" }),
};

export const artigosApi = {
  list: () => request("/api/artigos"),
  getById: (id) => request(`/api/artigos/${id}`),
  create: (payload) => request("/api/artigos", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/artigos/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/artigos/${id}`, { method: "DELETE" }),
};

export const artigosFornecedoresApi = {
  listByArtigo: (id) => request(`/api/artigos-fornecedores/por-artigo/${id}`),
  listByFornecedor: (id) => request(`/api/artigos-fornecedores/por-fornecedor/${id}`),
  create: (payload) => request("/api/artigos-fornecedores", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/artigos-fornecedores/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/artigos-fornecedores/${id}`, { method: "DELETE" }),
};
