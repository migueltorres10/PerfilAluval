import { useNavigate } from "react-router-dom";

const mockClientes = [
  { id: 101, nome: "Cliente X", nif: "123456789", localidade: "Penafiel" },
  { id: 102, nome: "Cliente Y", nif: "987654321", localidade: "Porto" },
  { id: 103, nome: "Cliente Z", nif: "555666777", localidade: "Maia" },
];

export default function ClientesListPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>Clientes</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.75 }}>Lista (mock) — vamos ligar ao SQL mais tarde</p>
        </div>

        <button type="button" onClick={() => navigate("/clientes/novo")}>
          + Novo Cliente
        </button>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {mockClientes.map((c) => (
          <div
            key={c.id}
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
                {c.nome}
              </div>
              <div style={{ opacity: 0.75, fontSize: 13, marginTop: 2 }}>
                NIF: {c.nif} • {c.localidade}
              </div>
              <button
                type="button"
                onClick={() => navigate(`/clientes/${c.id}`)}
                style={{ marginTop: 10 }}
              >
                Abrir
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button type="button" onClick={() => navigate(`/clientes/${c.id}`)}>
                Editar
              </button>
              <button type="button" onClick={() => navigate(`/clientes/${c.id}/eliminar`)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
