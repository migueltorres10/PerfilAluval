import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientesApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";

export default function ClientesListPage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("active"); // active | inactive | all
  const [q, setQ] = useState("");

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // debounce simples para não fazer request a cada tecla
  const qDebounced = useDebouncedValue(q, 250);

  async function load() {
    setLoading(true);
    setApiError("");
    try {
      const list = await clientesApi.list({ status, q: qDebounced });
      setClientes(Array.isArray(list) ? list : []);
    } catch (err) {
      setApiError(err?.data?.error || "Erro ao carregar lista de clientes.");
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, qDebounced]);

  const titleLine = useMemo(() => {
    if (status === "active") return "Ativos";
    if (status === "inactive") return "Inativos";
    return "Todos";
  }, [status]);

  async function onReativar(id) {
    try {
      setApiError("");
      await clientesApi.reativar(id);
      await load();
    } catch (err) {
      setApiError(err?.data?.error || "Erro ao reativar cliente.");
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Clientes</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.75 }}>A mostrar: {titleLine}</p>
        </div>

        <button type="button" onClick={() => navigate("/clientes/novo")}>
          + Novo Cliente
        </button>
      </div>

      {/* Barra de pesquisa + filtro */}
      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar por nome, NIF ou localidade…"
          style={{
            flex: "1 1 320px",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.92)",
            outline: "none",
          }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.92)",
            outline: "none",
          }}
        >
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
          <option value="all">Todos</option>
        </select>

        <button type="button" onClick={load} disabled={loading}>
          {loading ? "A atualizar..." : "Atualizar"}
        </button>
      </div>

      {apiError ? <AlertBox>{apiError}</AlertBox> : null}

      {loading ? (
        <div style={{ marginTop: 16, opacity: 0.8 }}>A carregar…</div>
      ) : (
        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          {clientes.map((c) => (
            <div
              key={c.ClienteID}
              style={{
                padding: 12,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 750, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.Nome}
                  {c.Ativo === 0 ? <span style={{ opacity: 0.7 }}> (Inativo)</span> : null}
                </div>

                <div style={{ opacity: 0.75, fontSize: 13, marginTop: 2 }}>
                  NIF: {c.NIF || "—"} • {c.NomeLocalidade || "—"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {c.Ativo === 1 ? (
                  <>
                    <button type="button" onClick={() => navigate(`/clientes/${c.ClienteID}`)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => navigate(`/clientes/${c.ClienteID}/eliminar`)}>
                      Eliminar
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" onClick={() => onReativar(c.ClienteID)}>
                      Reativar
                    </button>
                    <button type="button" onClick={() => navigate(`/clientes/${c.ClienteID}`)}>
                      Editar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {!clientes.length && (
            <div style={{ opacity: 0.8, padding: 12 }}>Não existem clientes para mostrar.</div>
          )}
        </div>
      )}
    </div>
  );
}

function useDebouncedValue(value, delayMs) {
  const [v, setV] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return v;
}