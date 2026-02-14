/**
 * Sanitizes a string value.
 * Returns null if value is undefined, null, or empty string after trim.
 * @param {any} v 
 * @returns {string|null}
 */
function s(v) {
  if (v === undefined || v === null) return null;
  const t = String(v).trim();
  return t.length ? t : null;
}

/**
 * Validates a NIF (Número de Identificação Fiscal).
 * Simple format check (max 20 chars).
 * @param {string} nif 
 * @returns {string|null} Error message or null if valid.
 */
function validateNif(nif) {
  if (!nif) return "NIF é obrigatório.";
  if (nif.length > 20) return "NIF não pode ter mais de 20 caracteres.";
  return null;
}

/**
 * Validates an Email address.
 * @param {string} email 
 * @returns {string|null} Error message or null if valid/empty.
 */
function validateEmail(email) {
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email inválido.";
  return null;
}

/**
 * Validates a positive integer ID.
 * @param {any} id 
 * @returns {boolean}
 */
function isValidId(id) {
  const num = Number(id);
  return Number.isFinite(num) && num > 0;
}

module.exports = {
  s,
  validateNif,
  validateEmail,
  isValidId
};
