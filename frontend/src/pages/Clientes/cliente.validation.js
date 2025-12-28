export function validateClienteForm(form) {
  const errors = {};
  if (!String(form.nome || "").trim()) errors.nome = "Nome é obrigatório.";
  if (!["E", "P"].includes(form.tipoCliente)) errors.tipoCliente = "Escolhe E (Empresa) ou P (Particular).";
  if (!form.paisId) errors.paisId = "País é obrigatório.";
  return errors;
}
