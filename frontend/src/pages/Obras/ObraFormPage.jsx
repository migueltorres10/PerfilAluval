import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obrasApi } from "../../services/api";
import ObraForm from "./components/ObraForm";
import ObrasArtigosAssociados from "./components/ObrasArtigosAssociados";

export default function ObraFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [initialData, setInitialData] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(isEditing);
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchForm() {
      try {
        const data = await obrasApi.getById(id);
        if (!data) throw new Error("Obra não existe");
        setInitialData(data);
      } catch (err) {
        setApiError("Erro ao carregar obra.");
      } finally {
        setLoadingConfig(false);
      }
    }

    if (isEditing) {
      fetchForm();
    }
  }, [id, isEditing]);

  const handleSubmit = async (formPayload) => {
    setApiError("");
    setSaving(true);
    try {
      if (isEditing) {
        await obrasApi.update(id, formPayload);
        navigate("/obras", { replace: true });
      } else {
        const res = await obrasApi.create(formPayload);
        navigate(`/obras/${res.id}`, { replace: true });
      }
    } catch (err) {
      setApiError(err?.data?.error || `Erro ao ${isEditing ? "guardar" : "criar"} obra.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  if (loadingConfig) {
    return <div className="pageContent">A carregar detalhes...</div>;
  }

  return (
    <div className="pageContent">
      <div className="pageHeader">
        <div>
          <h1>{isEditing ? "Gestão da Obra" : "Nova Obra"}</h1>
          <p className="pageHeaderSub">
            {isEditing ? "Atualize os detalhes de produção e orçamentação." : "Inicie o registo de um novo projeto/obra."}
          </p>
        </div>
      </div>

      <ObraForm
        isEditing={isEditing}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/obras")}
        apiError={apiError}
        saving={saving}
      />

      {isEditing && (
        <ObrasArtigosAssociados obraId={id} />
      )}
    </div>
  );
}
