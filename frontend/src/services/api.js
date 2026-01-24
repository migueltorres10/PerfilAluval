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
},};
