import { useEffect, useState } from "react";
import { fornecedoresApi, paisesApi, distritosApi, concelhosApi } from "../../../services/api";
import { validateFornecedorForm } from "../fornecedor.validation";

const DEFAULT_PORTUGAL_ID = 427;

export function useFornecedorEdit(id, { onUpdated, enabled = true } = {}) {
  const [form, setForm] = useState({
    nome: "",
    nomeComercial: "",
    nif: "",
    paisId: DEFAULT_PORTUGAL_ID,
    email: "",
    telefone: "",
    telemovel: "",

    codDistrito: "",
    codConcelho: "",
    nomeLocalidade: "",
    numCodPostal: "",
    extCodPostal: "",
    moradaLinha1: "",
    moradaLinha2: "",

    observacoes: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const [loadingFornecedor, setLoadingFornecedor] = useState(true);

  const [paises, setPaises] = useState([]);
  const [loadingPaises, setLoadingPaises] = useState(true);

  const [distritos, setDistritos] = useState([]);
  const [loadingDistritos, setLoadingDistritos] = useState(true);

  const [concelhos, setConcelhos] = useState([]);
  const [loadingConcelhos, setLoadingConcelhos] = useState(false);

  // Carregar Fornecedor por ID
  useEffect(() => {
    if (!enabled) {
      setLoadingFornecedor(false);
      return;
    }
    if (!id) {
      setLoadingFornecedor(false);
      return;
    }
    let alive = true;
    (async () => {
      setLoadingFornecedor(true);
      setApiError("");
      try {
        const c = await fornecedoresApi.getById(id);
        if (!alive) return;

        setForm((f) => ({
          ...f,
          nome: c?.Nome ?? "",
          nomeComercial: c?.NomeComercial ?? "",
          nif: c?.NIF ?? "",
          paisId: Number(c?.PaisID ?? DEFAULT_PORTUGAL_ID),
          email: c?.Email ?? "",
          telefone: c?.Telefone ?? "",
          telemovel: c?.Telemovel ?? "",

          codDistrito: c?.CodDistrito ?? "",
          codConcelho: c?.CodConcelho ?? "",
          nomeLocalidade: c?.NomeLocalidade ?? "",
          numCodPostal: c?.NumCodPostal ?? "",
          extCodPostal: c?.ExtCodPostal ?? "",
          moradaLinha1: c?.MoradaLinha1 ?? "",
          moradaLinha2: c?.MoradaLinha2 ?? "",

          observacoes: c?.Observacoes ?? "",
        }));
      } catch (err) {
        if (alive) setApiError(err?.data?.error || "Erro ao carregar Fornecedor.");
      } finally {
        if (alive) setLoadingFornecedor(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, enabled]);

  // Países
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingPaises(true);
      try {
        const list = await paisesApi.list();
        if (!alive) return;
        setPaises(Array.isArray(list) ? list : []);
      } catch {
        if (alive) setPaises([]);
      } finally {
        if (alive) setLoadingPaises(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Distritos
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingDistritos(true);
      try {
        const list = await distritosApi.list();
        if (!alive) return;
        setDistritos(Array.isArray(list) ? list : []);
      } catch {
        if (alive) setDistritos([]);
      } finally {
        if (alive) setLoadingDistritos(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Concelhos por distrito
  useEffect(() => {
    let alive = true;
    (async () => {
      const d = String(form.codDistrito || "").trim();
      if (!d) {
        setConcelhos([]);
        return;
      }

      setLoadingConcelhos(true);
      try {
        const list = await concelhosApi.listByDistrito(d);
        if (!alive) return;
        setConcelhos(Array.isArray(list) ? list : []);
      } catch {
        if (alive) setConcelhos([]);
      } finally {
        if (alive) setLoadingConcelhos(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [form.codDistrito]);

  function onChange(e) {
    const { name, value } = e.target;

    if (apiError) setApiError("");
    if (apiSuccess) setApiSuccess("");

    setForm((f) => {
      if (name === "paisId") return { ...f, paisId: Number(value) };

      if (name === "codDistrito") {
        return {
          ...f,
          codDistrito: value,
          codConcelho: "",
          nomeLocalidade: "",
          numCodPostal: "",
          extCodPostal: "",
        };
      }
      if (name === "codConcelho") {
        return {
          ...f,
          codConcelho: value,
          nomeLocalidade: "",
          numCodPostal: "",
          extCodPostal: "",
        };
      }

      return { ...f, [name]: value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");

    const v = validateFornecedorForm(form);
    setErrors(v);
    if (Object.keys(v).length) {
      setApiError("Existem campos obrigatórios por preencher/corrigir.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nome: form.nome.trim(),
        nomeComercial: form.nomeComercial.trim() || null,
        nif: form.nif.trim() || null,
        paisId: Number(form.paisId),
        email: form.email.trim() || null,
        telefone: form.telefone.trim() || null,
        telemovel: form.telemovel.trim() || null,

        codDistrito: form.codDistrito || null,
        codConcelho: form.codConcelho || null,
        nomeLocalidade: form.nomeLocalidade.trim() || null,
        numCodPostal: form.numCodPostal.trim() || null,
        extCodPostal: form.extCodPostal.trim() || null,
        moradaLinha1: form.moradaLinha1.trim() || null,
        moradaLinha2: form.moradaLinha2.trim() || null,

        observacoes: form.observacoes || null,
      };

      await fornecedoresApi.update(id, payload);
      setApiSuccess("Fornecedor atualizado com sucesso!");
      onUpdated?.();
    } catch (err) {
      const apiErrors = err?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") setErrors(apiErrors);
      setApiError(err?.data?.error || "Erro ao atualizar Fornecedor.");
    } finally {
      setSaving(false);
    }
  }

  return {
    form,
    setForm,
    errors,
    apiError,
    apiSuccess,
    saving,
    loadingFornecedor,

    paises,
    loadingPaises,
    distritos,
    loadingDistritos,
    concelhos,
    loadingConcelhos,

    onChange,
    onSubmit,
    setErrors,
    setApiError,
    setApiSuccess,
  };
}