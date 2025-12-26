import { useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function ClienteFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const mode = useMemo(() => {
    if (!id) return "create";
    if (location.pathname.endsWith("/eliminar")) return "delete";
    return "edit";
  }, [id, location.pathname]);

  const title = mode === "create" ? "Novo Cliente" : mode === "edit" ? "Editar Cliente" : "Eliminar Cliente";

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
      <p style={{ opacity: 0.8 }}>
        {mode === "create" && "Formulário vazio (criar)"}
        {mode === "edit" && `Carregar dados do cliente #${id} (editar)`}
        {mode === "delete" && `Confirmar eliminação do cliente #${id}`}
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button type="button" onClick={() => navigate("/clientes")}>Voltar</button>
        {mode !== "delete" && <button type="button">Guardar (mock)</button>}
        {mode === "delete" && <button type="button">Eliminar (mock)</button>}
      </div>
    </div>
  );
}
