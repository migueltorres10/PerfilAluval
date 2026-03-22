import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { funcionariosApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { Button } from "../../components/ui/Button";

export default function FuncionariosListPage() {
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setApiError("");
    try {
      const data = await funcionariosApi.list();
      setLista(data || []);
    } catch (err) {
      setApiError("Erro ao carregar lista de funcionários.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function confirmDelete() {
    if (!confirm) return;
    try {
      await funcionariosApi.remove(confirm.id);
      setApiSuccess("Funcionário inativado.");
      load();
    } catch (err) {
      setApiError("Erro ao eliminar.");
    } finally {
      setConfirm(null);
    }
  }

  return (
    <div className="pageContent">
      <div className="pageHeader">
        <div>
          <h1>Funcionários</h1>
          <p className="pageHeaderSub">Gestão de Recursos Humanos</p>
        </div>
        <Button onClick={() => navigate("/funcionarios/novo")}>+ Novo Funcionário</Button>
      </div>

      {apiError && <AlertBox>{apiError}</AlertBox>}
      {apiSuccess && <AlertBox variant="success">{apiSuccess}</AlertBox>}

      {loading ? <div style={{marginTop: 16}}>A carregar...</div> : (
        <div className="listStack" style={{ marginTop: 24 }}>
          {lista.map(f => (
            <div key={f.id} className="listRow">
              <div className="rowMain">
                <div className="rowTitle">
                  {f.nome} {f.ativo === 0 && <span className="listRowTag">(Inativo)</span>}
                </div>
                <div className="rowSub">
                  {f.departamentoNome ? `${f.departamentoNome} - ${f.funcaoNome || "Sem Função"}` : (f.funcaoNome || "Sem Cargo")} • {f.telemovel || f.telefone || "Sem telefone"} • {f.email || "Sem email"}
                </div>
              </div>
              <div className="listRowActions">
                <Button onClick={() => navigate(`/funcionarios/${f.id}`)}>Editar</Button>
                {f.ativo !== 0 && (
                  <Button variant="danger" onClick={() => setConfirm(f)}>Eliminar</Button>
                )}
              </div>
            </div>
          ))}
          {lista.length === 0 && <p style={{opacity: 0.8}}>Nenhum funcionário encontrado.</p>}
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Inativar Funcionário"
        message={`Pretende inativar o funcionário ${confirm?.nome}?`}
        confirmText="Inativar"
        confirmVariant="danger"
        onCancel={() => setConfirm(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
