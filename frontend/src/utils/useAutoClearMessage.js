import { useEffect } from "react";

/**
 * Limpa automaticamente uma mensagem (string) após X ms.
 * Uso: useAutoClearMessage(apiSuccess, setApiSuccess, 3000)
 */
export function useAutoClearMessage(message, setMessage, ms = 3000) {
  useEffect(() => {
    if (!message) return;

    const t = setTimeout(() => setMessage(""), ms);
    return () => clearTimeout(t);
  }, [message, ms, setMessage]);
}