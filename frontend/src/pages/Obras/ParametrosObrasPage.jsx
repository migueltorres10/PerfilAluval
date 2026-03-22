import { useCallback, useEffect, useState } from "react";
import { obrasEstadosApi, obrasTiposApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import { Button } from "../../components/ui/Button";

export default function ParametrosObrasPage() {
  const [estados, setEstados] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const [formEstado, setFormEstado] = useState({ nome: "", descricao: "", ordem: 0 });
  const [formTipo, setFormTipo] = useState({ nome: "", descricao: "" });
  
  const [savingEstado, setSavingEstado] = useState(false);
  const [savingTipo, setSavingTipo] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setApiError("");
    try {
      const [est, tp] = await Promise.all([obrasEstadosApi.list(), obrasTiposApi.list()]);
      setEstados(est || []);
      setTipos(tp || []);
    } catch (err) {
      setApiError("Erro ao carregar os parâmetros de obra.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAddEstado(e) {
    e.preventDefault();
    setApiError(""); setApiSuccess(""); setSavingEstado(true);
    try {
      await obrasEstadosApi.create(formEstado);
      setApiSuccess("Estado criado com sucesso!");
      setFormEstado({ nome: "", descricao: "", ordem: 0 });
      load();
    } catch (err) { setApiError(err?.data?.error || "Erro ao criar estado."); }
    finally { setSavingEstado(false); }
  }

  async function handleDeleteEstado(id) {
    if (!window.confirm("Pretende eliminar este estado? (Obras associadas podem ser afetadas)")) return;
    setApiError(""); setApiSuccess("");
    try {
      await obrasEstadosApi.remove(id);
      setApiSuccess("Estado eliminado!");
      load();
    } catch (err) { setApiError("Erro ao eliminar estado."); }
  }

  async function handleAddTipo(e) {
    e.preventDefault();
    setApiError(""); setApiSuccess(""); setSavingTipo(true);
    try {
      await obrasTiposApi.create(formTipo);
      setApiSuccess("Tipo criado com sucesso!");
      setFormTipo({ nome: "", descricao: "" });
      load();
    } catch (err) { setApiError(err?.data?.error || "Erro ao criar tipo."); }
    finally { setSavingTipo(false); }
  }

  async function handleDeleteTipo(id) {
    if (!window.confirm("Pretende eliminar este tipo de obra?")) return;
    setApiError(""); setApiSuccess("");
    try {
      await obrasTiposApi.remove(id);
      setApiSuccess("Tipo eliminado!");
      load();
    } catch (err) { setApiError("Erro ao eliminar tipo."); }
  }

  return (
    <div className="pageContent">
      <div className="pageHeader">
        <div>
          <h1>Tipos e Estados de Obra</h1>
          <p className="pageHeaderSub">Gestão de parâmetros de categorização e tracking de Obras</p>
        </div>
      </div>

      {apiError && <AlertBox>{apiError}</AlertBox>}
      {apiSuccess && <AlertBox variant="success">{apiSuccess}</AlertBox>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 16 }}>
        {/* COLUNA TIPOS */}
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Tipos de Obra</h2>
          <form onSubmit={handleAddTipo} style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Nome *</label>
              <input required value={formTipo.nome} onChange={e => setFormTipo({...formTipo, nome: e.target.value})} style={{ width: "100%" }}/>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Descrição</label>
              <input value={formTipo.descricao} onChange={e => setFormTipo({...formTipo, descricao: e.target.value})} style={{ width: "100%" }}/>
            </div>
            <Button type="submit" loading={savingTipo} style={{ alignSelf: "flex-end" }}>Adicionar Tipo</Button>
          </form>

          {loading ? <div style={{marginTop:16}}>A carregar...</div> : (
            <div className="listStack" style={{ marginTop: 16 }}>
              {tipos.map(t => (
                <div key={t.id} className="listRow">
                  <div className="rowMain">
                    <div className="rowTitle">{t.nome}</div>
                    <div className="rowSub">{t.descricao || "Sem desc."}</div>
                  </div>
                  {t.ativo !== 0 && <Button variant="danger" onClick={() => handleDeleteTipo(t.id)}>Eliminar</Button>}
                </div>
              ))}
              {tipos.length === 0 && <p style={{opacity:0.8}}>Nenhum tipo.</p>}
            </div>
          )}
        </div>

        {/* COLUNA ESTADOS */}
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Estados de Obra</h2>
          <form onSubmit={handleAddEstado} style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Nome *</label>
                <input required value={formEstado.nome} onChange={e => setFormEstado({...formEstado, nome: e.target.value})} style={{ width: "100%" }}/>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Ordem</label>
                <input type="number" required value={formEstado.ordem} onChange={e => setFormEstado({...formEstado, ordem: Number(e.target.value)})} style={{ width: "100%" }}/>
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Descrição</label>
              <input value={formEstado.descricao} onChange={e => setFormEstado({...formEstado, descricao: e.target.value})} style={{ width: "100%" }}/>
            </div>
            <Button type="submit" loading={savingEstado} style={{ alignSelf: "flex-end" }}>Adicionar Estado</Button>
          </form>

          {loading ? <div style={{marginTop:16}}>A carregar...</div> : (
            <div className="listStack" style={{ marginTop: 16 }}>
              {estados.map(e => (
                <div key={e.id} className="listRow">
                  <div className="rowMain">
                    <div className="rowTitle">
                      <span style={{opacity: 0.5, marginRight: 8}}>#{e.ordem}</span> 
                      {e.nome}
                    </div>
                    <div className="rowSub">{e.descricao || "Sem desc."}</div>
                  </div>
                  {e.ativo !== 0 && <Button variant="danger" onClick={() => handleDeleteEstado(e.id)}>Eliminar</Button>}
                </div>
              ))}
              {estados.length === 0 && <p style={{opacity:0.8}}>Nenhum estado.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
