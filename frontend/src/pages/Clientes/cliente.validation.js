export function validateClienteForm(form) {
  const errors = {};
  if (!String(form.nome || "").trim()) errors.nome = "Nome é obrigatório.";
  if (!["E", "P"].includes(form.tipoCliente)) errors.tipoCliente = "Escolhe E (Empresa) ou P (Particular).";
  if (!form.paisId) errors.paisId = "País é obrigatório.";

  const email = String(form.email || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email inválido.";

  // CP: se preencher num, deve ter 4; se preencher ext, deve ter 3
  const num = String(form.numCodPostal || "").trim();
  const ext = String(form.extCodPostal || "").trim();
  if (num && !/^\d{4}$/.test(num)) errors.numCodPostal = "CP deve ter 4 dígitos.";
  if (ext && !/^\d{3}$/.test(ext)) errors.extCodPostal = "Extensão CP deve ter 3 dígitos.";

  const nif = String(form.nif || "").trim();
  if (!nif) {
  errors.nif = "NIF é obrigatório.";
  } else if (nif.length > 20) {
  errors.nif = "NIF não pode ter mais de 20 caracteres.";
  }

  return errors;
}