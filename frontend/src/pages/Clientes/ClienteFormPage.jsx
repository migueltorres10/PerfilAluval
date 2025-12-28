import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { clientesApi, paisesApi } from "../../services/api";

function validate(form) {
  const errors = {};
  if (!form.nome.trim()) errors.nome = "Nome é obrigatório.";
  if (!["E", "P"].includes(form.tipoCliente)) errors.tipoCliente = "Escolhe E (Empresa) ou P (Particular).";
  if (!form.paisId) errors.paisId = "País é obrigatório.";
  return errors;
}

export default function ClienteFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const mode = useMemo(() => {
    if (!id) return "create";
    if (location.pathname.endsWith("/eliminar")) return "delete";
    return "edit";
  }, [id, location.pathname]);

  const [form, setForm] = useState({
    tipoCliente: "E",
    nome: "",
    paisId: 427, // Portugal por default
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

        setPaises(list || []);

        // Se Portugal 427 não existir por algum motivo, escolhe o primeiro país disponível
        const hasPortugal = (list || []).some((p) => Number(p.PaisID) === 427);
        if (!hasPortugal && (list || []).length) {
          setForm((f) => ({ ...f, paisId: Number(list[0].PaisID) }));
        }
      } catch (e) {
        // Mantém o default 427 e deixa a lista vazia (aparece "Portugal" fallback)
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

    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);
    try {
      const payload = {
        tipoCliente: form.tipoCliente,
        nome: form.nome.trim(),
        paisId: Number(form.paisId),
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

  // Por agora, só criamos (primeiro cliente)
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

  return (
    <div style={{ padding: 16, maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0 }}>Novo Cliente</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.75 }}>Primeiro registo (criar)</p>
        </div>
        <button type="button" onClick={() => navigate("/clientes")}>
          Voltar
        </button>
      </div>

      {apiError && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,0,0,0.10)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {apiError}
        </div>
      )}

      <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 650, fontSize: 13 }}>
            Tipo de Cliente
            {errors.tipoCliente && (
              <span style={{ marginLeft: 8, color: "rgba(255,120,120,0.95)" }}>{errors.tipoCliente}</span>
            )}
          </div>
          <select name="tipoCliente" value={form.tipoCliente} onChange={onChange} style={inputStyle}>
            <option value="E">E — Empresa</option>
            <option value="P">P — Particular</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 650, fontSize: 13 }}>
            País *
            {errors.paisId && <span style={{ marginLeft: 8, color: "rgba(255,120,120,0.95)" }}>{errors.paisId}</span>}
          </div>
          <select
            name="paisId"
            value={form.paisId}
            onChange={onChange}
            disabled={loadingPaises}
            style={inputStyle}
          >
            {paises.length === 0 ? (
              <option value={427}>Portugal</option>
            ) : (
              paises.map((p) => (
                <option key={p.PaisID} value={p.PaisID}>
                  {p.NomePT}
                </option>
              ))
            )}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 650, fontSize: 13 }}>
            Nome *
            {errors.nome && <span style={{ marginLeft: 8, color: "rgba(255,120,120,0.95)" }}>{errors.nome}</span>}
          </div>
          <input
            name="nome"
            value={form.nome}
            onChange={onChange}
            placeholder="Ex: Perfil Aluval, Lda"
            style={inputStyle}
          />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="submit" disabled={saving}>
            {saving ? "A criar..." : "Criar Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  outline: "none",
};
