import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fornecedoresApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import { useAutoClearMessage } from "../../utils/useAutoClearMessage";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

export default function FornecedoresListPage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("active"); // active | inactive | all
  const [q, setQ] = useState("");

  const [Fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const [stats, setStats] = useState({
    Ativos: 0,
    Inativos: 0,
    Total: 0,
  });

  const [confirm, setConfirm] = useState(null);
  // confirm = { Fornecedor, action: "deactivate" | "reactivate" }

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
      const list = await fornecedoresApi.list({ status, q: qDebounced });
      setFornecedores(Array.isArray(list) ? list : []);
    } catch (err) {
      setFornecedores([]);
      setApiError(err?.data?.error || "Erro ao carregar lista de Fornecedores.");
    } finally {
      setLoading(false);
    }
  }, [status, qDebounced]);

  // ---------- LOAD STATS ----------
  async function loadStats() {
    try {
      const data = await fornecedoresApi.stats({ q: qDebounced });

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
  function onToggleAtivo(Fornecedor) {
    const ativo = Number(Fornecedor.Ativo) === 1;

    setConfirm({
      Fornecedor,
      action: ativo ? "deactivate" : "reactivate",
    });
  }

  // ---------- CONFIRM ACTION ----------
  async function confirmToggle() {
    if (!confirm) return;

    const { Fornecedor, action } = confirm;
    const id = Fornecedor.FornecedorID;
    const nome = Fornecedor.Nome || `#${id}`;

    setConfirm(null);
    setApiError("");
    setApiSuccess("");

    try {
      if (action === "deactivate") {
        await fornecedoresApi.remove(id);
        setApiSuccess(`Fornecedor desativado com sucesso: ${nome}`);
      } else {
        await fornecedoresApi.reativar(id);
        setApiSuccess(`Fornecedor reativado com sucesso: ${nome}`);
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
          <h1>Fornecedores</h1>
          <p className="pageHeaderSub">A mostrar: {titleLine}</p>
        </div>

        <button type="button" onClick={() => navigate("/Fornecedores/novo")}>
          + Novo Fornecedor
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
          {Fornecedores.map((c) => {
            const ativo = Number(c.Ativo) === 1;

            return (
              <div key={c.FornecedorID} className="listRow">
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
                    onClick={() => navigate(`/Fornecedores/${c.FornecedorID}`)}
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

          {!Fornecedores.length && (
            <div style={{ opacity: 0.8, padding: 12 }}>
              Não existem Fornecedores para mostrar.
            </div>
          )}
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO */}
      <ConfirmModal
        open={!!confirm}
        title={
          confirm?.action === "deactivate"
            ? "Desativar Fornecedor"
            : "Reativar Fornecedor"
        }
        message={
          confirm
            ? `Pretende ${
                confirm.action === "deactivate"
                  ? "desativar"
                  : "reativar"
              } o Fornecedor ${confirm.Fornecedor.Nome}?`
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