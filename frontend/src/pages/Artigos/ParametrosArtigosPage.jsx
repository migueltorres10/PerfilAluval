import { useCallback, useEffect, useState } from "react";
import { artigoUnidadesApi, artigoFamiliasApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import { Button } from "../../components/ui/Button";

export default function ParametrosArtigosPage() {
  const [unidades, setUnidades] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const [formUnidade, setFormUnidade] = useState({ codigo: "", nome: "", descricao: "" });
  const [formFamilia, setFormFamilia] = useState({ nome: "", descricao: "" });
  
  const [savingUnidade, setSavingUnidade] = useState(false);
  const [savingFamilia, setSavingFamilia] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setApiError("");
    try {
      const [uni, fam] = await Promise.all([artigoUnidadesApi.list(), artigoFamiliasApi.list()]);
      setUnidades(uni || []);
      setFamilias(fam || []);
    } catch (err) {
      setApiError("Erro ao carregar os parâmetros de artigos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAddUnidade(e) {
    e.preventDefault();
    setApiError(""); setApiSuccess(""); setSavingUnidade(true);
    try {
      await artigoUnidadesApi.create(formUnidade);
      setApiSuccess("Unidade criada com sucesso!");
      setFormUnidade({ codigo: "", nome: "", descricao: "" });
      load();
    } catch (err) { setApiError(err?.data?.error || "Erro ao criar unidade."); }
    finally { setSavingUnidade(false); }
  }

  async function handleDeleteUnidade(id) {
    if (!window.confirm("Pretende eliminar esta unidade? (Artigos associados podem ser afetados)")) return;
    setApiError(""); setApiSuccess("");
    try {
      await artigoUnidadesApi.remove(id);
      setApiSuccess("Unidade eliminada!");
      load();
    } catch (err) { setApiError("Erro ao eliminar unidade."); }
  }

  async function handleAddFamilia(e) {
    e.preventDefault();
    setApiError(""); setApiSuccess(""); setSavingFamilia(true);
    try {
      await artigoFamiliasApi.create(formFamilia);
      setApiSuccess("Família criada com sucesso!");
      setFormFamilia({ nome: "", descricao: "" });
      load();
    } catch (err) { setApiError(err?.data?.error || "Erro ao criar família."); }
    finally { setSavingFamilia(false); }
  }

  async function handleDeleteFamilia(id) {
    if (!window.confirm("Pretende eliminar esta família?")) return;
    setApiError(""); setApiSuccess("");
    try {
      await artigoFamiliasApi.remove(id);
      setApiSuccess("Família eliminada!");
      load();
    } catch (err) { setApiError("Erro ao eliminar família."); }
  }

  return (
    <div className="pageContent">
      <div className="pageHeader">
        <div>
          <h1>Unidades e Famílias</h1>
          <p className="pageHeaderSub">Gestão de parâmetros base para Artigos e Serviços</p>
        </div>
      </div>

      {apiError && <AlertBox>{apiError}</AlertBox>}
      {apiSuccess && <AlertBox variant="success">{apiSuccess}</AlertBox>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 16 }}>
        {/* COLUNA UNIDADES */}
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Unidades de Medida</h2>
          <form onSubmit={handleAddUnidade} style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Código *</label>
                <input required value={formUnidade.codigo} onChange={e => setFormUnidade({...formUnidade, codigo: e.target.value.toUpperCase()})} placeholder="Ex: M2" style={{ width: "100%" }}/>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Nome *</label>
                <input required value={formUnidade.nome} onChange={e => setFormUnidade({...formUnidade, nome: e.target.value})} placeholder="Ex: Metro Quadrado" style={{ width: "100%" }}/>
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Descrição</label>
              <input value={formUnidade.descricao} onChange={e => setFormUnidade({...formUnidade, descricao: e.target.value})} style={{ width: "100%" }}/>
            </div>
            <Button type="submit" loading={savingUnidade} style={{ alignSelf: "flex-end" }}>Adicionar Unidade</Button>
          </form>

          {loading ? <div style={{marginTop:16}}>A carregar...</div> : (
            <div className="listStack" style={{ marginTop: 16 }}>
              {unidades.map(u => (
                <div key={u.id} className="listRow">
                  <div className="rowMain">
                    <div className="rowTitle">
                      <span style={{background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4, marginRight: 8, fontSize: 12}}>{u.codigo}</span> 
                      {u.nome}
                    </div>
                    <div className="rowSub">{u.descricao || "Sem desc."}</div>
                  </div>
                  {u.ativo !== 0 && <Button variant="danger" onClick={() => handleDeleteUnidade(u.id)}>Eliminar</Button>}
                </div>
              ))}
              {unidades.length === 0 && <p style={{opacity:0.8}}>Nenhuma unidade.</p>}
            </div>
          )}
        </div>

        {/* COLUNA FAMILIAS */}
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Famílias de Artigo</h2>
          <form onSubmit={handleAddFamilia} style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Nome *</label>
              <input required value={formFamilia.nome} onChange={e => setFormFamilia({...formFamilia, nome: e.target.value})} style={{ width: "100%" }}/>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Descrição</label>
              <input value={formFamilia.descricao} onChange={e => setFormFamilia({...formFamilia, descricao: e.target.value})} style={{ width: "100%" }}/>
            </div>
            <Button type="submit" loading={savingFamilia} style={{ alignSelf: "flex-end" }}>Adicionar Família</Button>
          </form>

          {loading ? <div style={{marginTop:16}}>A carregar...</div> : (
            <div className="listStack" style={{ marginTop: 16 }}>
              {familias.map(f => (
                <div key={f.id} className="listRow">
                  <div className="rowMain">
                    <div className="rowTitle">{f.nome}</div>
                    <div className="rowSub">{f.descricao || "Sem desc."}</div>
                  </div>
                  {f.ativo !== 0 && <Button variant="danger" onClick={() => handleDeleteFamilia(f.id)}>Eliminar</Button>}
                </div>
              ))}
              {familias.length === 0 && <p style={{opacity:0.8}}>Nenhuma família.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
