import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientesApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import { useAutoClearMessage } from "../../utils/useAutoClearMessage";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

export default function ClientesListPage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("active"); // active | inactive | all
  const [q, setQ] = useState("");

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const [stats, setStats] = useState({
    Ativos: 0,
    Inativos: 0,
    Total: 0,
  });

  const [confirm, setConfirm] = useState(null);
  // confirm = { cliente, action: "deactivate" | "reactivate" }

  useAutoClearMessage(apiSuccess, setApiSuccess, 3000);
  useAutoClearMessage(apiError, setApiError, 5000);

  // debounce simples para não fazer request a cada tecla
  const qDebounced = useDebouncedValue(q, 250);

  const titleLine = useMemo(() => {
    if (status === "active") return "Ativos";
    if (status === "inactive") return "Inativos";
    return "Todos";
  }, [status]);

  // ---------- LOAD LIST ----------
  const load = useCallback(async () => {
    setLoading(true);
    setApiError("");

    try {
      const list = await clientesApi.list({ status, q: qDebounced });
      setClientes(Array.isArray(list) ? list : []);
    } catch (err) {
      setClientes([]);
      setApiError(err?.data?.error || "Erro ao carregar lista de clientes.");
    } finally {
      setLoading(false);
    }
  }, [status, qDebounced]);

  // ---------- LOAD STATS ----------
  async function loadStats() {
    try {
      const data = await clientesApi.stats({ q: qDebounced });

      setStats({
        Ativos: Number(data?.Ativos ?? 0),
        Inativos: Number(data?.Inativos ?? 0),
        Total: Number(data?.Total ?? 0),
      });
    } catch (err) {
      console.error("Erro a carregar stats:", err);
    }
  }

  useEffect(() => {
    load();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDebounced, status]);

  // ---------- OPEN MODAL ----------
  function onToggleAtivo(cliente) {
    const ativo = Number(cliente.Ativo) === 1;

    setConfirm({
      cliente,
      action: ativo ? "deactivate" : "reactivate",
    });
  }

  // ---------- CONFIRM ACTION ----------
  async function confirmToggle() {
    if (!confirm) return;

    const { cliente, action } = confirm;
    const id = cliente.ClienteID;
    const nome = cliente.Nome || `#${id}`;

    setConfirm(null);
    setApiError("");
    setApiSuccess("");

    try {
      if (action === "deactivate") {
        await clientesApi.remove(id);
        setApiSuccess(`Cliente desativado com sucesso: ${nome}`);
      } else {
        await clientesApi.reativar(id);
        setApiSuccess(`Cliente reativado com sucesso: ${nome}`);
      }

      await load();
      await loadStats();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setApiError(
        err?.data?.error ||
          err?.message ||
          "Ocorreu um erro ao executar a ação."
      );
    }
  }

  // ---------- RENDER ----------
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Clientes</h1>
          <p className="pageHeaderSub">A mostrar: {titleLine}</p>
        </div>

        <button type="button" onClick={() => navigate("/clientes/novo")}>
          + Novo Cliente
        </button>
      </div>

      {/* Barra de pesquisa + filtros */}
      <div className="toolbar">
        <input
          className="searchInput"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar por nome, NIF ou localidade…"
        />

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            type="button"
            onClick={() => setStatus("active")}
            style={{ fontWeight: status === "active" ? 700 : 400 }}
          >
            Ativos ({stats.Ativos})
          </button>

          <button
            type="button"
            onClick={() => setStatus("inactive")}
            style={{ fontWeight: status === "inactive" ? 700 : 400 }}
          >
            Inativos ({stats.Inativos})
          </button>

          <button
            type="button"
            onClick={() => setStatus("all")}
            style={{ fontWeight: status === "all" ? 700 : 400 }}
          >
            Todos ({stats.Total})
          </button>
        </div>
      </div>

      {/* mensagens */}
      {apiError ? <AlertBox>{apiError}</AlertBox> : null}
      {apiSuccess ? <AlertBox variant="success">{apiSuccess}</AlertBox> : null}

      {loading ? (
        <div style={{ marginTop: 16, opacity: 0.8 }}>A carregar…</div>
      ) : (
        <div className="listStack">
          {clientes.map((c) => {
            const ativo = Number(c.Ativo) === 1;

            return (
              <div key={c.ClienteID} className="listRow">
                <div className="rowMain">
                  <div className="rowTitle">
                    {c.Nome}
                    {!ativo ? (
                      <span className="listRowTag"> (Inativo)</span>
                    ) : null}
                  </div>

                  <div className="rowSub">
                    NIF: {c.NIF || "—"} • {c.NomeLocalidade || "—"}
                  </div>
                </div>

                <div className="listRowActions">
                  <button
                    type="button"
                    onClick={() => navigate(`/clientes/${c.ClienteID}`)}
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className={ativo ? "btnDanger" : "btnSuccess"}
                    onClick={() => onToggleAtivo(c)}
                  >
                    {ativo ? "Eliminar" : "Reativar"}
                  </button>
                </div>
              </div>
            );
          })}

          {!clientes.length && (
            <div style={{ opacity: 0.8, padding: 12 }}>
              Não existem clientes para mostrar.
            </div>
          )}
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO */}
      <ConfirmModal
        open={!!confirm}
        title={
          confirm?.action === "deactivate"
            ? "Desativar cliente"
            : "Reativar cliente"
        }
        message={
          confirm
            ? `Pretende ${
                confirm.action === "deactivate"
                  ? "desativar"
                  : "reativar"
              } o cliente ${confirm.cliente.Nome}?`
            : ""
        }
        confirmText={
          confirm?.action === "deactivate" ? "Desativar" : "Reativar"
        }
        confirmVariant={
          confirm?.action === "deactivate" ? "danger" : "success"
        }
        onCancel={() => setConfirm(null)}
        onConfirm={confirmToggle}
      />
    </div>
  );
}

// ---------- debounce helper ----------
function useDebouncedValue(value, delayMs) {
  const [v, setV] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return v;
}