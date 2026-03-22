import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obrasApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Button } from "../../components/ui/Button";

export default function ObrasListPage() {
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setApiError("");
    try {
      const data = await obrasApi.list();
      setLista(data || []);
    } catch (err) {
      setApiError("Erro ao carregar lista de obras.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function confirmDelete() {
    if (!confirm) return;
    try {
      await obrasApi.remove(confirm.id);
      setApiSuccess("Obra inativada.");
      load();
    } catch (err) {
      setApiError("Erro ao inativar.");
    } finally {
      setConfirm(null);
    }
  }

  return (
    <div className="pageContent">
      <div className="pageHeader">
        <div>
          <h1>Obras</h1>
          <p className="pageHeaderSub">Gestão de Projetos e Produção</p>
        </div>
        <Button onClick={() => navigate("/obras/nova")}>+ Nova Obra</Button>
      </div>

      {apiError && <AlertBox>{apiError}</AlertBox>}
      {apiSuccess && <AlertBox variant="success">{apiSuccess}</AlertBox>}

      {loading ? <div style={{marginTop: 16}}>A carregar...</div> : (
        <div className="listStack" style={{ marginTop: 24 }}>
          {lista.map(o => (
            <div key={o.id} className="listRow">
              <div className="rowMain">
                <div className="rowTitle">
                  <span style={{background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4, marginRight: 8, fontSize: 13}}>{o.codigo}</span>
                  {o.nome}
                  {o.ativo === 0 && <span className="listRowTag">(Inativa)</span>}
                </div>
                <div className="rowSub">
                  Cliente: {o.clienteNome} • Estado: {o.estadoNome} {o.tipoNome && `• Tipo: ${o.tipoNome}`} 
                  {o.percentagemConclusao > 0 && ` • Concluída: ${o.percentagemConclusao}%`}
                  {o.orcamentoEntregue ? <span style={{marginLeft:8, fontSize:10, background:"var(--accent-color)", padding:"2px 4px", borderRadius:4, color:"#fff"}}>Orçamento Entregue</span> : ""}
                </div>
              </div>
              <div className="listRowActions">
                <Button onClick={() => navigate(`/obras/${o.id}`)}>Detalhes</Button>
                {o.ativo !== 0 && (
                  <Button variant="danger" onClick={() => setConfirm(o)}>Inativar</Button>
                )}
              </div>
            </div>
          ))}
          {lista.length === 0 && <p style={{opacity: 0.8}}>Nenhuma obra encontrada.</p>}
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Inativar Obra"
        message={`Pretende inativar a obra ${confirm?.nome}?`}
        confirmText="Inativar"
        confirmVariant="danger"
        onCancel={() => setConfirm(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
