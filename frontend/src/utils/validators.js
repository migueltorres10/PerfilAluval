export function isEmail(v) {
  if (!v) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
}

export function required(v) {
  return String(v ?? "").trim().length > 0;
}
