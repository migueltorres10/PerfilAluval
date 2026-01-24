import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ClienteForm from "./components/ClienteForm";
import { useClienteCreate } from "./hooks/useClienteCreate";

export default function ClienteFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const mode = useMemo(() => {
    if (!id) return "create";
    if (location.pathname.endsWith("/eliminar")) return "delete";
    return "edit";
  }, [id, location.pathname]);

  // ✅ hook SEMPRE chamado (ordem estável)
  const vm = useClienteCreate({
    onCreated: (newId) => navigate(`/clientes/${newId}`, { replace: true }),
  });

  // por agora: só create
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
    <ClienteForm
      title="Novo Cliente"
      subtitle="Criar ficha de cliente"
      submitLabel="Criar Cliente"
      onBack={() => navigate("/clientes")}
      {...vm}
    />
  );
}
