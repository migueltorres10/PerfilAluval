import { useCallback, useEffect, useState } from "react";
import { departamentosApi, funcoesApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import { Button } from "../../components/ui/Button";

export default function DepartamentosFuncoesPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const [formDept, setFormDept] = useState({ nome: "", descricao: "" });
  const [formFunc, setFormFunc] = useState({ nome: "", departamentoId: "", descricao: "" });
  
  const [savingDept, setSavingDept] = useState(false);
  const [savingFunc, setSavingFunc] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setApiError("");
    try {
      const [depts, funcs] = await Promise.all([departamentosApi.list(), funcoesApi.list()]);
      setDepartamentos(depts || []);
      setFuncoes(funcs || []);
    } catch (err) {
      setApiError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAddDept(e) {
    e.preventDefault();
    setApiError(""); setApiSuccess(""); setSavingDept(true);
    try {
      await departamentosApi.create(formDept);
      setApiSuccess("Departamento criado!");
      setFormDept({ nome: "", descricao: "" });
      load();
    } catch (err) { setApiError(err?.data?.error || "Erro ao criar departamento."); }
    finally { setSavingDept(false); }
  }

  async function handleDeleteDept(id) {
    if (!window.confirm("Pretende eliminar este departamento? (Funções associadas podem ser afetadas)")) return;
    setApiError(""); setApiSuccess("");
    try {
      await departamentosApi.remove(id);
      setApiSuccess("Departamento eliminado!");
      load();
    } catch (err) { setApiError("Erro ao eliminar departamento."); }
  }

  async function handleAddFunc(e) {
    e.preventDefault();
    setApiError(""); setApiSuccess(""); setSavingFunc(true);
    if (!formFunc.departamentoId) { setApiError("Selecione um departamento."); setSavingFunc(false); return; }
    try {
      await funcoesApi.create({ ...formFunc, departamentoId: Number(formFunc.departamentoId) });
      setApiSuccess("Função criada!");
      setFormFunc({ nome: "", departamentoId: formFunc.departamentoId, descricao: "" });
      load();
    } catch (err) { setApiError(err?.data?.error || "Erro ao criar função."); }
    finally { setSavingFunc(false); }
  }

  async function handleDeleteFunc(id) {
    if (!window.confirm("Pretende eliminar esta função?")) return;
    setApiError(""); setApiSuccess("");
    try {
      await funcoesApi.remove(id);
      setApiSuccess("Função eliminada!");
      load();
    } catch (err) { setApiError("Erro ao eliminar função."); }
  }

  return (
    <div className="pageContent">
      <div className="pageHeader">
        <div>
          <h1>Funções e Departamentos</h1>
          <p className="pageHeaderSub">Gestão da estrutura orgânica</p>
        </div>
      </div>

      {apiError && <AlertBox>{apiError}</AlertBox>}
      {apiSuccess && <AlertBox variant="success">{apiSuccess}</AlertBox>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 16 }}>
        {/* COLUNA DEPARTAMENTOS */}
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Departamentos</h2>
          <form onSubmit={handleAddDept} style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Nome *</label>
              <input required value={formDept.nome} onChange={e => setFormDept({...formDept, nome: e.target.value})} style={{ width: "100%" }}/>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Descrição</label>
              <input value={formDept.descricao} onChange={e => setFormDept({...formDept, descricao: e.target.value})} style={{ width: "100%" }}/>
            </div>
            <Button type="submit" loading={savingDept} style={{ alignSelf: "flex-end" }}>Adicionar Dept.</Button>
          </form>

          {loading ? <div style={{marginTop:16}}>A carregar...</div> : (
            <div className="listStack" style={{ marginTop: 16 }}>
              {departamentos.map(d => (
                <div key={d.id} className="listRow">
                  <div className="rowMain">
                    <div className="rowTitle">{d.nome} {d.ativo === 0 && "(Inativo)"}</div>
                    <div className="rowSub">{d.descricao || "Sem desc."}</div>
                  </div>
                  {d.ativo !== 0 && <Button variant="danger" onClick={() => handleDeleteDept(d.id)}>Eliminar</Button>}
                </div>
              ))}
              {departamentos.length === 0 && <p style={{opacity:0.8}}>Nenhum departamento.</p>}
            </div>
          )}
        </div>

        {/* COLUNA FUNCOES */}
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Funções</h2>
          <form onSubmit={handleAddFunc} style={{ display: "flex", flexDirection: "column", gap: 10, background: "rgba(255,255,255,0.04)", padding: 16, borderRadius: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Nome *</label>
              <input required value={formFunc.nome} onChange={e => setFormFunc({...formFunc, nome: e.target.value})} style={{ width: "100%" }}/>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Departamento *</label>
              <select required value={formFunc.departamentoId} onChange={e => setFormFunc({...formFunc, departamentoId: e.target.value})} style={{ width: "100%" }}>
                <option value="">Selecione...</option>
                {departamentos.filter(d => d.ativo === 1 || d.ativo === true).map(d => (
                  <option key={d.id} value={d.id}>{d.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Descrição</label>
              <input value={formFunc.descricao} onChange={e => setFormFunc({...formFunc, descricao: e.target.value})} style={{ width: "100%" }}/>
            </div>
            <Button type="submit" loading={savingFunc} style={{ alignSelf: "flex-end" }}>Adicionar Função</Button>
          </form>

          {loading ? <div style={{marginTop:16}}>A carregar...</div> : (
            <div className="listStack" style={{ marginTop: 16 }}>
              {funcoes.map(f => (
                <div key={f.id} className="listRow">
                  <div className="rowMain">
                    <div className="rowTitle">{f.nome} {f.ativo === 0 && "(Inativo)"}</div>
                    <div className="rowSub">Dept: {f.departamentoNome}</div>
                  </div>
                  {f.ativo !== 0 && <Button variant="danger" onClick={() => handleDeleteFunc(f.id)}>Eliminar</Button>}
                </div>
              ))}
              {funcoes.length === 0 && <p style={{opacity:0.8}}>Nenhuma função.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
