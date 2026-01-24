import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientesApi } from "../../services/api"; // ajusta o caminho se necessário
import { AlertBox } from "../../components/ui/AlertBox"; // ajusta se necessário

export default function ClientesListPage() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setApiError("");

      try {
        const res = await clientesApi.list();

        // suporta request que devolve:
        //  - array direto
        //  - { data: array }
        const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];

        if (!alive) return;
        setClientes(list);
      } catch (err) {
        console.error("ERRO LISTA:", err); // <-- deixa isto enquanto testas
        if (!alive) return;
        setApiError(err?.data?.error || err?.message || "Erro ao carregar lista de clientes.");
        setClientes([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Clientes</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.75 }}>
            Lista de clientes
          </p>
        </div>

        <button type="button" onClick={() => navigate("/clientes/novo")}>
          + Novo Cliente
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
                </div>

                <div style={{ opacity: 0.75, fontSize: 13, marginTop: 2 }}>
                  NIF: {c.NIF || "—"} • {c.NomeLocalidade || "—"}
                </div>

              </div>

              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button type="button" onClick={() => navigate(`/clientes/${c.ClienteID}`)}>
                  Editar
                </button>
                <button type="button" onClick={() => navigate(`/clientes/${c.ClienteID}/eliminar`)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {!clientes.length && (
            <div style={{ opacity: 0.8, padding: 12 }}>
              Não existem clientes para mostrar.
            </div>
          )}
        </div>
      )}
    </div>
  );
}