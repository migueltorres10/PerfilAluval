import { useEffect, useState } from "react";
import { clientesApi, paisesApi, distritosApi, concelhosApi } from "../../../services/api";
import { validateClienteForm } from "../cliente.validation";

const DEFAULT_PORTUGAL_ID = 427;

export function useClienteCreate({ onCreated } = {}) {
  const [form, setForm] = useState({
    tipoCliente: "E",
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

  const [paises, setPaises] = useState([]);
  const [loadingPaises, setLoadingPaises] = useState(true);

  const [distritos, setDistritos] = useState([]);
  const [loadingDistritos, setLoadingDistritos] = useState(true);

  const [concelhos, setConcelhos] = useState([]);
  const [loadingConcelhos, setLoadingConcelhos] = useState(false);

  // Países
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingPaises(true);
      try {
        const list = await paisesApi.list();
        if (!alive) return;
        const safe = Array.isArray(list) ? list : [];
        setPaises(safe);

        const hasPortugal = safe.some((p) => Number(p.PaisID) === DEFAULT_PORTUGAL_ID);
        if (!hasPortugal && safe.length) {
          setForm((f) => ({ ...f, paisId: Number(safe[0].PaisID) }));
        }
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

    setForm((f) => {
      // normalizações
      if (name === "paisId") return { ...f, paisId: Number(value) };

      // dependências morada
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

    const v = validateClienteForm(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);
    try {
      const payload = {
        tipoCliente: form.tipoCliente,
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

      const r = await clientesApi.create(payload);
      onCreated?.(r?.id);
    } catch (err) {
      const apiErrors = err?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") setErrors(apiErrors);
      setApiError(err?.data?.error || "Erro ao criar cliente.");
    } finally {
      setSaving(false);
    }
  }

  return {
    form,
    setForm,
    errors,
    apiError,
    saving,

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
  };
}
