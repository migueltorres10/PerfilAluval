export function validateFornecedorForm(form) {
  const errors = {};

  if (!String(form.nome || "").trim())
    errors.nome = "Nome é obrigatório.";

  if (!form.paisId)
    errors.paisId = "País é obrigatório.";

  const nif = String(form.nif || "").trim();
  if (!nif) errors.nif = "NIF é obrigatório.";
  else if (nif.length > 20)
    errors.nif = "NIF não pode ter mais de 20 caracteres.";

  const email = String(form.email || "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Email inválido.";

  return errors;
}