import { useState, useEffect, useCallback } from "react";
import { obrasArtigosApi, artigosApi } from "../../../services/api";
import { Button } from "../../../components/ui/Button";

export default function ObrasArtigosAssociados({ obraId }) {
  const [lista, setLista] = useState([]);
  const [artigosDisponiveis, setArtigosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({ 
    artigoId: "", tipoLinha: "M", descricao: "", quantidade: 1, precoUnitarioCompra: "", precoUnitarioVenda: "", descontoPercentual: 0, ivaPercentual: 0
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await obrasArtigosApi.listByObra(obraId);
      setLista(resp || []);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [obraId]);

  const loadArtigos = useCallback(async () => {
    try {
      const a = await artigosApi.list();
      setArtigosDisponiveis(a || []);
    } catch(e){}
  }, []);

  useEffect(() => {
    load();
    loadArtigos();
  }, [load, loadArtigos]);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await obrasArtigosApi.create({ ...form, obraId });
      setForm({ ...form, artigoId: "", descricao: "", quantidade: 1, precoUnitarioCompra: "", precoUnitarioVenda: "" });
      load();
    } catch (err) {
      alert(err?.data?.error || "Erro ao adicionar rubrica.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id) {
    if(!window.confirm("Remover esta rubrica/artigo desta obra?")) return;
    try {
      await obrasArtigosApi.remove(id);
      load();
    } catch (e) {
      alert("Erro ao remover");
    }
  }

  const handleArtigoSelect = (artigoIdStr) => {
    if (!artigoIdStr) {
      setForm({...form, artigoId: "", precoUnitarioVenda: "", precoUnitarioCompra: ""});
      return;
    }
    const a = artigosDisponiveis.find(x => x.id === Number(artigoIdStr));
    if(a) {
      setForm({
        ...form, 
        artigoId: a.id, 
        precoUnitarioCompra: a.precoCompra ? a.precoCompra.toString() : "",
        precoUnitarioVenda: a.precoVenda ? a.precoVenda.toString() : "",
      });
    }
  };

  const decodeLinha = (char) => {
    if(char === 'M') return 'Material';
    if(char === 'S') return 'Serviço/MO';
    if(char === 'P') return 'Produto';
    return char;
  };

  return (
    <div className="card" style={{ marginTop: 24, borderTop: "2px solid rgba(255,255,255,0.1)" }}>
      <h3>Rubricas / Materiais da Obra</h3>
      
      <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "1fr 150px 100px 100px 100px auto", gap: 10, alignItems: "end", marginBottom: 24, background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8 }}>
        <div>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Artigo/Serviço *</label>
          <select required style={{ width: "100%" }} value={form.artigoId} onChange={e => handleArtigoSelect(e.target.value)}>
            <option value="">Selecione...</option>
            {artigosDisponiveis.map(a => <option key={a.id} value={a.id}>{a.codigo} - {a.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Tipo Linha *</label>
          <select required style={{ width: "100%" }} value={form.tipoLinha} onChange={e => setForm({...form, tipoLinha: e.target.value})}>
             <option value="M">Material</option>
             <option value="S">Serviço / MO</option>
             <option value="P">Produto Fabricado</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Qtd *</label>
          <input required type="number" step="0.001" style={{ width: "100%" }} value={form.quantidade} onChange={e => setForm({...form, quantidade: e.target.value})} />
        </div>
        <div>
          <label style={{ fontSize: 12, opacity: 0.8 }}>P.C Unit.</label>
          <input type="number" step="0.001" style={{ width: "100%" }} value={form.precoUnitarioCompra} onChange={e => setForm({...form, precoUnitarioCompra: e.target.value})} />
        </div>
        <div>
          <label style={{ fontSize: 12, opacity: 0.8 }}>P.V Unit.</label>
          <input type="number" step="0.001" style={{ width: "100%" }} value={form.precoUnitarioVenda} onChange={e => setForm({...form, precoUnitarioVenda: e.target.value})} />
        </div>
        <div style={{ paddingBottom: 0 }}>
          <Button loading={saving} type="submit" style={{height: 38}}>+ Inserir Linha</Button>
        </div>
      </form>

      {loading ? <div>A carregar...</div> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: 800, width: "100%", background: "rgba(0,0,0,0.2)", borderRadius: 8, overflow: "hidden" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.1)", textAlign: "left" }}>
                <th style={{ padding: 10 }}>Artigo</th>
                <th style={{ padding: 10 }}>Tipo</th>
                <th style={{ padding: 10 }}>Qtd</th>
                <th style={{ padding: 10 }}>Unid.</th>
                <th style={{ padding: 10 }}>P.V Unit</th>
                <th style={{ padding: 10 }}>Total S/ IVA</th>
                <th style={{ padding: 10 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(a => {
                const total = Number(a.quantidade) * (Number(a.precoUnitarioVenda) || 0) * (1 - (Number(a.descontoPercentual||0)/100));
                return(
                <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: 10 }}>
                    <div style={{fontWeight:"bold", fontSize: 12}}>{a.artigoCodigo}</div>
                    <div>{a.artigoNome}</div>
                  </td>
                  <td style={{ padding: 10, fontSize: 12 }}>{decodeLinha(a.tipoLinha)}</td>
                  <td style={{ padding: 10, fontWeight: "bold" }}>{a.quantidade}</td>
                  <td style={{ padding: 10 }}>{a.unidadeCodigo}</td>
                  <td style={{ padding: 10 }}>{a.precoUnitarioVenda ? `${a.precoUnitarioVenda.toFixed(2)}€` : "-"}</td>
                  <td style={{ padding: 10, fontWeight: "bold", color: "var(--accent-color)" }}>{total > 0 ? `${total.toFixed(2)}€` : "-"}</td>
                  <td style={{ padding: 10 }}>
                     <Button variant="danger" onClick={()=>handleRemove(a.id)}>Remover</Button>
                  </td>
                </tr>
              )})}
              {lista.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 10, opacity: 0.6 }}>Nenhuma rubrica inserida no orçamento ou produção desta obra.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
