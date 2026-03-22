import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { artigosApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Button } from "../../components/ui/Button";

export default function ArtigosListPage() {
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setApiError("");
    try {
      const data = await artigosApi.list();
      setLista(data || []);
    } catch (err) {
      setApiError("Erro ao carregar lista de artigos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function confirmDelete() {
    if (!confirm) return;
    try {
      await artigosApi.remove(confirm.id);
      setApiSuccess("Artigo inativado.");
      load();
    } catch (err) {
      setApiError("Erro ao eliminar.");
    } finally {
      setConfirm(null);
    }
  }

  const getTipo = (t) => {
    if (t === 'C') return 'Compra';
    if (t === 'V') return 'Venda';
    if (t === 'A') return 'Compra/Venda';
    return t;
  };

  return (
    <div className="pageContent">
      <div className="pageHeader">
        <div>
          <h1>Artigos e Serviços</h1>
          <p className="pageHeaderSub">Gestão de catálogo e inventário</p>
        </div>
        <Button onClick={() => navigate("/artigos/novo")}>+ Novo Artigo</Button>
      </div>

      {apiError && <AlertBox>{apiError}</AlertBox>}
      {apiSuccess && <AlertBox variant="success">{apiSuccess}</AlertBox>}

      {loading ? <div style={{marginTop: 16}}>A carregar...</div> : (
        <div className="listStack" style={{ marginTop: 24 }}>
          {lista.map(a => (
            <div key={a.id} className="listRow">
              <div className="rowMain">
                <div className="rowTitle">
                  <span style={{background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4, marginRight: 8, fontSize: 13}}>{a.codigo}</span>
                  {a.nome}
                  {a.ativo === 0 && <span className="listRowTag">(Inativo)</span>}
                </div>
                <div className="rowSub">
                  {a.tipoRegisto === 'S' ? 'Serviço' : 'Artigo'} • {getTipo(a.tipoArtigo)}
                  {a.familiaNome ? ` • Família: ${a.familiaNome}` : ""}
                  {a.tipoRegisto === 'A' && ` • Stock: ${a.stockAtual} ${a.unidadeNome}`}
                  {a.precoCompra > 0 && ` • Pr. Compra: ${a.precoCompra}€`}
                  {a.precoVenda > 0 && ` • Pr. Venda: ${a.precoVenda}€`}
                </div>
              </div>
              <div className="listRowActions">
                <Button onClick={() => navigate(`/artigos/${a.id}`)}>Editar</Button>
                {a.ativo !== 0 && (
                  <Button variant="danger" onClick={() => setConfirm(a)}>Eliminar</Button>
                )}
              </div>
            </div>
          ))}
          {lista.length === 0 && <p style={{opacity: 0.8}}>Nenhum artigo encontrado.</p>}
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Inativar Artigo"
        message={`Pretende inativar o artigo ${confirm?.nome}?`}
        confirmText="Inativar"
        confirmVariant="danger"
        onCancel={() => setConfirm(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
