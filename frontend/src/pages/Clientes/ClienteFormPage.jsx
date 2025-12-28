import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { clientesApi, paisesApi } from "../../services/api";
import { FormField } from "../../components/ui/FormField";
import { TextInput, SelectInput } from "../../components/ui/Input";
import { AlertBox } from "../../components/ui/AlertBox";
import { validateClienteForm } from "./cliente.validation";

const DEFAULT_PORTUGAL_ID = 427;

export default function ClienteFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const mode = useMemo(() => {
    if (!id) return "create";
    if (location.pathname.endsWith("/eliminar")) return "delete";
    return "edit";
  }, [id, location.pathname]);

  // Por agora só implementamos create (edit/delete depois, em commits pequenos)
  if (mode !== "create") {
    return (
      <div style={{ padding: 16 }}>
        <h1 style={{ margin: 0 }}>Clientes</h1>
        <p style={{ opacity: 0.8 }}>
          Modo <b>{mode}</b> (ID {id}) — a seguir ligamos editar/eliminar.
        </p>
        <button type="button" onClick={() => navigate("/clientes")}>
          Voltar
        </button>
      </div>
    );
  }

  return <ClienteCreateView navigate={navigate} />;
}

function ClienteCreateView({ navigate }) {
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


  const [paises, setPaises] = useState([]);
  const [loadingPaises, setLoadingPaises] = useState(true);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadPaises() {
      setLoadingPaises(true);
      try {
        const list = await paisesApi.list();
        if (!alive) return;

        const safeList = Array.isArray(list) ? list : [];
        setPaises(safeList);

        // Se Portugal (427) não existir por algum motivo, escolhe o primeiro ativo
        const hasPortugal = safeList.some((p) => Number(p.PaisID) === DEFAULT_PORTUGAL_ID);
        if (!hasPortugal && safeList.length) {
          setForm((f) => ({ ...f, paisId: Number(safeList[0].PaisID) }));
        }
      } catch {
        // fallback: mantém Portugal por default e deixa lista vazia
      } finally {
        if (alive) setLoadingPaises(false);
      }
    }

    loadPaises();
    return () => {
      alive = false;
    };
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "paisId" ? Number(value) : value,
    }));
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
      navigate(`/clientes/${r.id}`, { replace: true });
    } catch (err) {
      const apiErrors = err?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") setErrors(apiErrors);
      setApiError(err?.data?.error || "Erro ao criar cliente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 700 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0 }}>Novo Cliente</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.75 }}>Criar ficha de cliente</p>
        </div>
        <button type="button" onClick={() => navigate("/clientes")}>
          Voltar
        </button>
      </header>

      <AlertBox>{apiError}</AlertBox>

      <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <FormField label="Tipo de Cliente" error={errors.tipoCliente}>
          <SelectInput name="tipoCliente" value={form.tipoCliente} onChange={onChange}>
            <option value="E">E — Empresa</option>
            <option value="P">P — Particular</option>
          </SelectInput>
        </FormField>

        <FormField label="País *" error={errors.paisId}>
          <SelectInput
            name="paisId"
            value={form.paisId}
            onChange={onChange}
            disabled={loadingPaises}
          >
            {paises.length === 0 ? (
              <option value={DEFAULT_PORTUGAL_ID}>Portugal</option>
            ) : (
              paises.map((p) => (
                <option key={p.PaisID} value={p.PaisID}>
                  {p.NomePT}
                </option>
              ))
            )}
          </SelectInput>
        </FormField>

        <FormField label="Nome *" error={errors.nome}>
          <TextInput
            name="nome"
            value={form.nome}
            onChange={onChange}
            placeholder="Ex: Miguel Torres / Perfil Aluval, Lda"
          />
        </FormField>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="submit" disabled={saving}>
            {saving ? "A criar..." : "Criar Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}
