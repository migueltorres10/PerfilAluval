import { useEffect, useState } from "react";
import { clientesApi } from "../../../services/api";

export function useClienteDelete(id, { onDeleted } = {}) {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setApiError("");
      try {
        const c = await clientesApi.getById(id);
        if (!alive) return;
        setCliente(c);
      } catch (err) {
        if (alive) setApiError(err?.data?.error || "Erro ao carregar cliente.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  async function onSubmit(e) {
    e?.preventDefault?.();
    setApiError("");
    setApiSuccess("");
    setSaving(true);
    try {
      await clientesApi.remove(id);
      setApiSuccess("Cliente eliminado com sucesso!");
      onDeleted?.();
    } catch (err) {
      setApiError(err?.data?.error || "Erro ao eliminar cliente.");
    } finally {
      setSaving(false);
    }
  }

  return {
    cliente,
    loading,
    saving,
    apiError,
    apiSuccess,
    onSubmit,
    setApiError,
    setApiSuccess,
  };
}