import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { funcionariosApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import FuncionarioForm from "./components/FuncionarioForm";

export default function FuncionarioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [errorNotFound, setErrorNotFound] = useState(false);
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!isEditing) return;
    try {
      const target = await funcionariosApi.getById(id);
      setInitialData(target);
    } catch (err) {
      if (err.status === 404) setErrorNotFound(true);
      else setApiError("Erro ao carregar dados do funcionário.");
    } finally {
      setLoading(false);
    }
  }, [id, isEditing]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSubmit(payload) {
    setApiError("");
    setSaving(true);
    try {
      if (isEditing) {
        await funcionariosApi.update(id, payload);
        navigate("/funcionarios"); // return to list on success
      } else {
        await funcionariosApi.create(payload);
        navigate("/funcionarios"); 
      }
    } catch (err) {
      setApiError(err?.data?.error || "Ocorreu um erro ao guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (errorNotFound) {
    return (
      <div className="pageContent">
        <AlertBox variant="danger">Funcionário {id} não encontrado.</AlertBox>
        <button type="button" onClick={() => navigate("/funcionarios")} style={{ marginTop: 16 }}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="pageContent">
      <div className="pageHeader">
        <div>
          <h1>{isEditing ? `Editar Funcionário #${id}` : "Novo Funcionário"}</h1>
        </div>
      </div>

      {loading ? (
        <div style={{ marginTop: 16 }}>A carregar dados...</div>
      ) : (
        <FuncionarioForm
          initialData={initialData}
          isEditing={isEditing}
          saving={saving}
          apiError={apiError}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/funcionarios")}
        />
      )}
    </div>
  );
}
