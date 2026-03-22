import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { artigosApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import ArtigoForm from "./components/ArtigoForm";
import ArtigosFornecedoresAssociados from "./components/ArtigosFornecedoresAssociados";

export default function ArtigoFormPage() {
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
        const data = await artigosApi.getById(id);
        if (!data) throw new Error("Artigo não existe");
        setInitialData(data);
      } catch (err) {
        setApiError("Erro ao carregar artigo.");
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
        await artigosApi.update(id, formPayload);
        navigate("/artigos", { replace: true });
      } else {
        const res = await artigosApi.create(formPayload);
        navigate(`/artigos/${res.id}`, { replace: true });
      }
    } catch (err) {
      setApiError(err?.data?.error || `Erro ao ${isEditing ? "guardar" : "criar"} o artigo.`);
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
          <h1>{isEditing ? "Editar Artigo" : "Novo Artigo"}</h1>
          <p className="pageHeaderSub">
            {isEditing ? "Altere as configurações de inventário e catálogo." : "Preencha a ficha para um novo registo."}
          </p>
        </div>
      </div>

      <ArtigoForm
        isEditing={isEditing}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/artigos")}
        apiError={apiError}
        saving={saving}
      />

      {isEditing && (
        <ArtigosFornecedoresAssociados artigoId={id} />
      )}
    </div>
  );
}
