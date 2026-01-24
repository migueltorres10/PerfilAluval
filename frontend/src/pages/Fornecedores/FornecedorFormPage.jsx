import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FornecedorForm from "./components/FornecedorForm";
import { useFornecedorCreate } from "./hooks/useFornecedorCreate";
import { useFornecedorEdit } from "./hooks/useFornecedorEdit";
import { useFornecedorDelete } from "./hooks/useFornecedorDelete";
import { AlertBox } from "../../components/ui/AlertBox";

export default function FornecedorFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const mode = useMemo(() => {
    if (!id) return "create";
    if (location.pathname.endsWith("/eliminar")) return "delete";
    return "edit";
  }, [id, location.pathname]);

  const vmCreate = useFornecedorCreate({
    enabled: mode === "create",
    onCreated: (newId) => navigate(`/fornecedores/${newId}`, { replace: true }),
  });

  const vmEdit = useFornecedorEdit(id, {
    enabled: mode === "edit",
    onUpdated: () => {},
  });

  const vmDelete = useFornecedorDelete(id, {
    enabled: mode === "delete",
    onDeleted: () => navigate("/fornecedores", { replace: true }),
  });

  if (mode === "delete") {
    if (vmDelete.loading) return <div style={{ padding: 16 }}>A carregar…</div>;

    return (
      <div className="FornecedorFormPage">
        <h1 style={{ margin: 0 }}>Eliminar Fornecedor</h1>
        <p style={{ opacity: 0.8 }}>
          Tens a certeza que queres eliminar o Fornecedor{" "}
          <b>{vmDelete.fornecedor?.Nome || `#${id}`}</b>?
        </p>

        {vmDelete.apiError ? <AlertBox>{vmDelete.apiError}</AlertBox> : null}
        {vmDelete.apiSuccess ? (
          <AlertBox variant="success">{vmDelete.apiSuccess}</AlertBox>
        ) : null}

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
    if (vmEdit.loadingFornecedor) return <div style={{ padding: 16 }}>A carregar…</div>;

    return (
      <FornecedorForm
        title="Editar Fornecedor"
        subtitle="Atualizar ficha de Fornecedor"
        submitLabel="Guardar Alterações"
        onBack={() => navigate("/fornecedores")}
        {...vmEdit}
      />
    );
  }

  return (
    <FornecedorForm
      title="Novo Fornecedor"
      subtitle="Criar ficha de Fornecedor"
      submitLabel="Criar Fornecedor"
      onBack={() => navigate("/fornecedores")}
      {...vmCreate}
    />
  );
}