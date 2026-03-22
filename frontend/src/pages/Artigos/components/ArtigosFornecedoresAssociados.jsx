import { useState, useEffect, useCallback } from "react";
import { artigosFornecedoresApi, fornecedoresApi } from "../../../services/api";
import { Button } from "../../../components/ui/Button";

export default function ArtigosFornecedoresAssociados({ artigoId }) {
  const [lista, setLista] = useState([]);
  const [fornecedoresDisponiveis, setFornecedoresDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({ fornecedorId: "", referenciaFornecedor: "", precoCompra: "", prazoEntregaDias: "", fornecedorPreferencial: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await artigosFornecedoresApi.listByArtigo(artigoId);
      setLista(resp || []);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [artigoId]);

  const loadFornecedores = useCallback(async () => {
    try {
      const f = await fornecedoresApi.list();
      setFornecedoresDisponiveis(f || []);
    } catch(e){}
  }, []);

  useEffect(() => {
    load();
    loadFornecedores();
  }, [load, loadFornecedores]);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await artigosFornecedoresApi.create({ ...form, artigoId });
      setForm({ fornecedorId: "", referenciaFornecedor: "", precoCompra: "", prazoEntregaDias: "", fornecedorPreferencial: 0 });
      load();
    } catch (err) {
      alert(err?.data?.error || "Erro ao associar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id) {
    if(!window.confirm("Remover este fornecedor?")) return;
    try {
      await artigosFornecedoresApi.remove(id);
      load();
    } catch (e) {
      alert("Erro ao remover");
    }
  }

  return (
    <div className="card" style={{ marginTop: 24, borderTop: "2px solid rgba(255,255,255,0.1)" }}>
      <h3>Fornecedores Associados</h3>
      
      <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 150px 100px 100px auto auto", gap: 10, alignItems: "end", marginBottom: 24, background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8 }}>
        <div>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Fornecedor *</label>
          <select required style={{ width: "100%" }} value={form.fornecedorId} onChange={e => setForm({...form, fornecedorId: e.target.value})}>
            <option value="">Selecione...</option>
            {fornecedoresDisponiveis.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Ref. Fornecedor</label>
          <input style={{ width: "100%" }} value={form.referenciaFornecedor} onChange={e => setForm({...form, referenciaFornecedor: e.target.value})} />
        </div>
        <div>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Preço Compra</label>
          <input type="number" step="0.001" style={{ width: "100%" }} value={form.precoCompra} onChange={e => setForm({...form, precoCompra: e.target.value})} />
        </div>
        <div>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Prazo (Dias)</label>
          <input type="number" style={{ width: "100%" }} value={form.prazoEntregaDias} onChange={e => setForm({...form, prazoEntregaDias: e.target.value})} />
        </div>
        <div style={{ paddingBottom: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={form.fornecedorPreferencial===1} onChange={e=>setForm({...form, fornecedorPreferencial: e.target.checked?1:0})} /> Preferencial
          </label>
        </div>
        <Button loading={saving} type="submit">Adicionar</Button>
      </form>

      {loading ? <div>A carregar...</div> : (
        <table style={{ width: "100%", background: "rgba(0,0,0,0.2)", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
              <th style={{ padding: 10 }}>Fornecedor</th>
              <th style={{ padding: 10 }}>Referência</th>
              <th style={{ padding: 10 }}>Preço</th>
              <th style={{ padding: 10 }}>Prazo</th>
              <th style={{ padding: 10 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(f => (
              <tr key={f.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td style={{ padding: 10 }}>
                  {f.fornecedorNome}
                  {f.fornecedorPreferencial===true && <span style={{marginLeft:8, fontSize:10, background:"green", padding:"2px 4px", borderRadius:4}}>Preferencial</span>}
                </td>
                <td style={{ padding: 10 }}>{f.referenciaFornecedor || "-"}</td>
                <td style={{ padding: 10 }}>{f.precoCompra ? `${f.precoCompra}€` : "-"}</td>
                <td style={{ padding: 10 }}>{f.prazoEntregaDias || "-"}</td>
                <td style={{ padding: 10 }}>
                   <Button variant="danger" onClick={()=>handleRemove(f.id)}>Remover</Button>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 10, opacity: 0.6 }}>Nenhum fornecedor registado para este artigo.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
