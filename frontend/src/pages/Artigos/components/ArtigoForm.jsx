import { useEffect, useState, useCallback } from "react";
import { artigoFamiliasApi, artigoUnidadesApi } from "../../../services/api";
import { Button } from "../../../components/ui/Button";

export default function ArtigoForm({
  initialData, isEditing, onSubmit, onCancel, apiError, saving 
}) {
  const [form, setForm] = useState(initialData || {
    codigo: "", referencia: "", nome: "", descricao: "", 
    tipoArtigo: "C", tipoRegisto: "A", artigoFamiliaId: "", unidadeId: "",
    controlaStock: 1, stockAtual: 0, stockMinimo: 0, stockMaximo: "",
    precoCompra: "", precoVenda: "", margemPercentual: "",
    temDimensoes: 0, comprimento: "", largura: "", altura: "", espessura: "", pesoUnitario: "",
    cor: "", acabamento: "", material: "", permiteProducao: 0,
    ativo: 1
  });

  const [lookups, setLookups] = useState({
    familias: [], unidades: []
  });

  const carregarLookups = useCallback(async () => {
    try {
      const [fam, uni] = await Promise.all([
        artigoFamiliasApi.list(), artigoUnidadesApi.list()
      ]);
      setLookups({ familias: fam || [], unidades: uni || [] });
      
      // Auto-select first unidade (usually UN) if creating new
      if (!isEditing && !form.unidadeId && uni && uni.length > 0) {
        setForm(prev => ({ ...prev, unidadeId: uni[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isEditing, form.unidadeId]);

  useEffect(() => { carregarLookups(); }, [carregarLookups]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="formStack">
      
      <div className="card">
        <h3>Dados Básicos</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
             <div className="formGroup">
               <label>Código *</label>
               <input required value={form.codigo} onChange={e => handleChange("codigo", e.target.value.toUpperCase())} placeholder="Ex: PRF-001" />
             </div>
             <div className="formGroup">
               <label>Referência Interna</label>
               <input value={form.referencia || ""} onChange={e => handleChange("referencia", e.target.value)} />
             </div>
             <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
               <label>Nome *</label>
               <input required value={form.nome} onChange={e => handleChange("nome", e.target.value)} />
             </div>
             
             <div className="formGroup">
               <label>Tipo de Registo</label>
               <select required value={form.tipoRegisto} onChange={e => handleChange("tipoRegisto", e.target.value)}>
                 <option value="A">Artigo / Produto</option>
                 <option value="S">Serviço / Mão de Obra</option>
               </select>
             </div>
             <div className="formGroup">
               <label>Tipo de Artigo</label>
               <select required value={form.tipoArtigo} onChange={e => handleChange("tipoArtigo", e.target.value)}>
                 <option value="C">Compra (Matéria Prima / Ferramentas)</option>
                 <option value="V">Venda (Produto Final)</option>
                 <option value="A">Compra e Venda</option>
               </select>
             </div>

             <div className="formGroup">
               <label>Unidade *</label>
               <select required value={form.unidadeId} onChange={e => handleChange("unidadeId", e.target.value)}>
                 <option value="">Selecione...</option>
                 {lookups.unidades.filter(u=>u.ativo).map(u => <option key={u.id} value={u.id}>{u.nome} ({u.codigo})</option>)}
               </select>
             </div>
             <div className="formGroup">
               <label>Família</label>
               <select value={form.artigoFamiliaId || ""} onChange={e => handleChange("artigoFamiliaId", e.target.value)}>
                 <option value="">Sem Família</option>
                 {lookups.familias.filter(f=>f.ativo).map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
               </select>
             </div>
        </div>
      </div>

      <div className="card">
        <h3>Preços & Margens</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
             <div className="formGroup">
               <label>Preço Compra</label>
               <div className="inputAffixWrapper">
                 <input type="number" step="0.0001" value={form.precoCompra || ""} onChange={e => handleChange("precoCompra", e.target.value)} />
                 <span className="inputAffix">€</span>
               </div>
             </div>
             <div className="formGroup">
               <label>Preço Venda</label>
               <div className="inputAffixWrapper">
                 <input type="number" step="0.0001" value={form.precoVenda || ""} onChange={e => handleChange("precoVenda", e.target.value)} />
                 <span className="inputAffix">€</span>
               </div>
             </div>
             <div className="formGroup">
               <label>Margem Desejada (%)</label>
               <div className="inputAffixWrapper">
                 <input type="number" step="0.01" value={form.margemPercentual || ""} onChange={e => handleChange("margemPercentual", e.target.value)} />
                 <span className="inputAffix">%</span>
               </div>
             </div>
        </div>
      </div>

      {form.tipoRegisto === 'A' && (
        <div className="card">
          <h3>Gestão de Stock</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
                  <input type="checkbox" checked={Number(form.controlaStock)===1} onChange={e => handleChange("controlaStock", e.target.checked ? 1 : 0)} />
                  Controlar Stock no Sistema para este artigo
                </label>
              </div>
              <div className="formGroup">
                <label>Stock Real Atual</label>
                <input type="number" step="0.001" value={form.stockAtual} onChange={e => handleChange("stockAtual", e.target.value)} />
              </div>
              <div className="formGroup">
                <label>Stock Mínimo (Alerta)</label>
                <input type="number" step="0.001" value={form.stockMinimo} onChange={e => handleChange("stockMinimo", e.target.value)} />
              </div>
              <div className="formGroup">
                <label>Stock Máximo</label>
                <input type="number" step="0.001" value={form.stockMaximo || ""} onChange={e => handleChange("stockMaximo", e.target.value)} />
              </div>
          </div>
        </div>
      )}

      {form.tipoRegisto === 'A' && (
        <div className="card">
          <h3>Dimensões e Materiais</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
                  <input type="checkbox" checked={Number(form.temDimensoes)===1} onChange={e => handleChange("temDimensoes", e.target.checked ? 1 : 0)} />
                  Ativar dados dimensionais
                </label>
              </div>
              <div className="formGroup">
                <label>Comprimento</label>
                <input type="number" step="0.001" value={form.comprimento || ""} onChange={e => handleChange("comprimento", e.target.value)} disabled={!Number(form.temDimensoes)}/>
              </div>
              <div className="formGroup">
                <label>Largura</label>
                <input type="number" step="0.001" value={form.largura || ""} onChange={e => handleChange("largura", e.target.value)} disabled={!Number(form.temDimensoes)}/>
              </div>
              <div className="formGroup">
                <label>Altura</label>
                <input type="number" step="0.001" value={form.altura || ""} onChange={e => handleChange("altura", e.target.value)} disabled={!Number(form.temDimensoes)}/>
              </div>
              <div className="formGroup">
                <label>Espessura</label>
                <input type="number" step="0.001" value={form.espessura || ""} onChange={e => handleChange("espessura", e.target.value)} disabled={!Number(form.temDimensoes)}/>
              </div>
              <div className="formGroup">
                <label>Peso (KG)</label>
                <input type="number" step="0.001" value={form.pesoUnitario || ""} onChange={e => handleChange("pesoUnitario", e.target.value)} />
              </div>
              
              <div className="formGroup">
                <label>Material</label>
                <input value={form.material || ""} onChange={e => handleChange("material", e.target.value)} />
              </div>
              <div className="formGroup">
                <label>Cor / RAL</label>
                <input value={form.cor || ""} onChange={e => handleChange("cor", e.target.value)} />
              </div>
              <div className="formGroup">
                <label>Acabamento</label>
                <input value={form.acabamento || ""} onChange={e => handleChange("acabamento", e.target.value)} />
              </div>
          </div>
        </div>
      )}

      <div className="card">
         <div className="formGroup">
           <label>Observações</label>
           <textarea rows={4} style={{ width: "100%", padding: 8 }} value={form.descricao || ""} onChange={e => handleChange("descricao", e.target.value)} />
         </div>
         <div className="formGroup" style={{ marginTop: 16 }}>
           <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
             <input type="checkbox" checked={Number(form.permiteProducao)===1} onChange={e => handleChange("permiteProducao", e.target.checked ? 1 : 0)} />
             Pode ser produzido internamente
           </label>
         </div>
         {isEditing && (
           <div className="formGroup" style={{ marginTop: 16 }}>
             <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
               <input type="checkbox" checked={Number(form.ativo)===1} onChange={e => handleChange("ativo", e.target.checked ? 1 : 0)} />
               Ativo
             </label>
           </div>
         )}
      </div>

      {apiError && <div style={{ color: "red", padding: 12, background: "rgba(255,0,0,0.1)", borderRadius: 6 }}>{apiError}</div>}

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>Voltar</Button>
        <Button type="submit" loading={saving}>{isEditing ? "Guardar" : "Criar"}</Button>
      </div>

    </form>
  );
}
