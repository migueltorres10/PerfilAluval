import { useEffect, useState } from "react";
import { fornecedoresApi } from "../../../services/api";

export function useFornecedorDelete(id, { onDeleted, enabled = true } = {}) {
  const [Fornecedor, setFornecedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  useEffect(() => {
    if (!enabled) return;
    if (!id) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setApiError("");
      try {
        const c = await fornecedoresApi.getById(id);
        if (!alive) return;
        setFornecedor(c);
      } catch (err) {
        if (alive) setApiError(err?.data?.error || "Erro ao carregar Fornecedor.");
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
      await fornecedoresApi.remove(id);
      setApiSuccess("Fornecedor eliminado com sucesso!");
      onDeleted?.();
    } catch (err) {
      setApiError(err?.data?.error || "Erro ao eliminar Fornecedor.");
    } finally {
      setSaving(false);
    }
  }

  return {
    Fornecedor,
    loading,
    saving,
    apiError,
    apiSuccess,
    onSubmit,
    setApiError,
    setApiSuccess,
  };
}