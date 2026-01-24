import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ClienteForm from "./components/ClienteForm";
import { useClienteCreate } from "./hooks/useClienteCreate";
import { useClienteEdit } from "./hooks/useClienteEdit";
import { useClienteDelete } from "./hooks/useClienteDelete";
import { AlertBox } from "../../components/ui/AlertBox"; // ajusta caminho se necessário

export default function ClienteFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const mode = useMemo(() => {
    if (!id) return "create";
    if (location.pathname.endsWith("/eliminar")) return "delete";
    return "edit";
  }, [id, location.pathname]);

  const vmCreate = useClienteCreate({
    onCreated: (newId) => navigate(`/clientes/${newId}`, { replace: true }),
  });

  const vmEdit = useClienteEdit(id, {
    onUpdated: () => {}, // opcional
  });

  const vmDelete = useClienteDelete(id, {
    onDeleted: () => navigate("/clientes", { replace: true }),
  });

  if (mode === "delete") {
    if (vmDelete.loading) return <div style={{ padding: 16 }}>A carregar…</div>;

    return (
      <div className="clienteFormPage">
        <h1 style={{ margin: 0 }}>Eliminar Cliente</h1>
        <p style={{ opacity: 0.8 }}>
          Tens a certeza que queres eliminar o cliente{" "}
          <b>{vmDelete.cliente?.Nome || `#${id}`}</b>?
        </p>

        {vmDelete.apiError ? <AlertBox>{vmDelete.apiError}</AlertBox> : null}
        {vmDelete.apiSuccess ? <AlertBox variant="success">{vmDelete.apiSuccess}</AlertBox> : null}

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button type="button" onClick={() => navigate(-1)} disabled={vmDelete.saving}>
            Cancelar
          </button>
          <button type="button" onClick={vmDelete.onSubmit} disabled={vmDelete.saving}>
            {vmDelete.saving ? "A eliminar..." : "Confirmar eliminar"}
          </button>
        </div>
      </div>
    );
  }

  if (mode === "edit") {
    if (vmEdit.loadingCliente) return <div style={{ padding: 16 }}>A carregar…</div>;

    return (
      <ClienteForm
        title="Editar Cliente"
        subtitle="Atualizar ficha de cliente"
        submitLabel="Guardar Alterações"
        onBack={() => navigate("/clientes")}
        {...vmEdit}
      />
    );
  }

  // create
  return (
    <ClienteForm
      title="Novo Cliente"
      subtitle="Criar ficha de cliente"
      submitLabel="Criar Cliente"
      onBack={() => navigate("/clientes")}
      {...vmCreate}
    />
  );
}