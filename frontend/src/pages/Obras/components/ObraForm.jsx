import { useEffect, useState, useCallback } from "react";
import { clientesApi, obrasTiposApi, obrasEstadosApi } from "../../../services/api";
import { Button } from "../../../components/ui/Button";

function SDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

export default function ObraForm({
  initialData, isEditing, onSubmit, onCancel, apiError, saving 
}) {
  const [form, setForm] = useState(initialData || {
    codigo: "", referencia: "", nome: "", descricao: "", 
    clienteId: "", obraTipoId: "", obraEstadoId: "",
    morada: "", codigoPostal: "", localidade: "", distrito: "", pais: "",
    dataPedido: "", dataOrcamento: "", dataAdjudicacao: "", 
    dataInicioPrevista: "", dataFimPrevista: "", dataInicioReal: "", dataFimReal: "",
    valorOrcamentado: "", valorAdjudicado: "", percentagemConclusao: 0,
    valorMaxDesc: "", orcamentoEntregue: 0,
    observacoes: "", ativo: 1
  });

  const [lookups, setLookups] = useState({
    clientes: [], tipos: [], estados: []
  });

  const carregarLookups = useCallback(async () => {
    try {
      const [cli, tp, est] = await Promise.all([
        clientesApi.list({status: "active"}), obrasTiposApi.list(), obrasEstadosApi.list()
      ]);
      setLookups({ clientes: cli || [], tipos: tp || [], estados: est || [] });
      
      // Auto-select estado 'EmOrçamentação' or first available state if creating new
      if (!isEditing && !form.obraEstadoId && est && est.length > 0) {
        setForm(prev => ({ ...prev, obraEstadoId: est[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isEditing, form.obraEstadoId]);

  useEffect(() => { carregarLookups(); }, [carregarLookups]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="formStack">
      
      <div className="card">
        <h3>Dados Principais</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
             <div className="formGroup">
               <label>Código da Obra *</label>
               <input required value={form.codigo} onChange={e => handleChange("codigo", e.target.value.toUpperCase())} placeholder="Ex: OB-2023-01D" />
             </div>
             <div className="formGroup">
               <label>Referência de Cliente</label>
               <input value={form.referencia || ""} onChange={e => handleChange("referencia", e.target.value)} />
             </div>
             <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
               <label>Nome / Designação da Obra *</label>
               <input required value={form.nome} onChange={e => handleChange("nome", e.target.value)} />
             </div>
             
             <div className="formGroup">
               <label>Cliente *</label>
               <select required value={form.clienteId} onChange={e => handleChange("clienteId", e.target.value)}>
                 <option value="">Selecione...</option>
                 {lookups.clientes.map(c => <option key={c.ClienteID} value={c.ClienteID}>{c.Nome}</option>)}
               </select>
             </div>
             <div className="formGroup" style={{ visibility: "hidden" }}></div>
             
             <div className="formGroup">
               <label>Estado da Obra *</label>
               <select required value={form.obraEstadoId} onChange={e => handleChange("obraEstadoId", e.target.value)}>
                 <option value="">Selecione...</option>
                 {lookups.estados.filter(e=>e.ativo).map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
               </select>
             </div>
             <div className="formGroup">
               <label>Tipo de Obra</label>
               <select value={form.obraTipoId || ""} onChange={e => handleChange("obraTipoId", e.target.value)}>
                 <option value="">Selecione...</option>
                 {lookups.tipos.filter(t=>t.ativo).map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
               </select>
             </div>
        </div>
      </div>

      <div className="card">
        <h3>Valores e Conclusão</h3>
         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
             <div className="formGroup">
               <label>Valor Orçamentado</label>
               <div className="inputAffixWrapper">
                 <input type="number" step="0.01" value={form.valorOrcamentado || ""} onChange={e => handleChange("valorOrcamentado", e.target.value)} />
                 <span className="inputAffix">€</span>
               </div>
             </div>
             <div className="formGroup">
               <label>Valor Adjudicado</label>
               <div className="inputAffixWrapper">
                 <input type="number" step="0.01" value={form.valorAdjudicado || ""} onChange={e => handleChange("valorAdjudicado", e.target.value)} />
                 <span className="inputAffix">€</span>
               </div>
             </div>
             <div className="formGroup">
               <label>Percentagem Conclusão</label>
               <div className="inputAffixWrapper">
                 <input type="number" step="0.01" value={form.percentagemConclusao} onChange={e => handleChange("percentagemConclusao", e.target.value)} />
                 <span className="inputAffix">%</span>
               </div>
             </div>

             <div className="formGroup">
               <label>Valor Max Desc</label>
               <div className="inputAffixWrapper">
                 <input type="number" step="0.01" value={form.valorMaxDesc || ""} onChange={e => handleChange("valorMaxDesc", e.target.value)} />
                 <span className="inputAffix">€</span>
               </div>
             </div>
             <div className="formGroup" style={{ display: "flex", alignItems: "flex-end" }}>
               <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", height: 38 }}>
                 <input type="checkbox" checked={Number(form.orcamentoEntregue)===1} onChange={e => handleChange("orcamentoEntregue", e.target.checked ? 1 : 0)} />
                 Orçamento Entregue
               </label>
             </div>
        </div>
      </div>

      <div className="card">
        <h3>Datas e Cronograma</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
             <div className="formGroup">
               <label>Data Pedido</label>
               <input type="date" value={SDate(form.dataPedido)} onChange={e => handleChange("dataPedido", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Data Orçamento</label>
               <input type="date" value={SDate(form.dataOrcamento)} onChange={e => handleChange("dataOrcamento", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Data Adjudicação</label>
               <input type="date" value={SDate(form.dataAdjudicacao)} onChange={e => handleChange("dataAdjudicacao", e.target.value)} />
             </div>
             
             <div className="formGroup">
               <label style={{color: "var(--accent-color)"}}>Início Previsto</label>
               <input type="date" value={SDate(form.dataInicioPrevista)} onChange={e => handleChange("dataInicioPrevista", e.target.value)} />
             </div>
             <div className="formGroup">
               <label style={{color: "var(--accent-color)"}}>Fim Previsto</label>
               <input type="date" value={SDate(form.dataFimPrevista)} onChange={e => handleChange("dataFimPrevista", e.target.value)} />
             </div>
             <div className="formGroup" style={{ visibility: "hidden" }}></div>
             
             <div className="formGroup">
               <label>Início Real</label>
               <input type="date" value={SDate(form.dataInicioReal)} onChange={e => handleChange("dataInicioReal", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Fim Real</label>
               <input type="date" value={SDate(form.dataFimReal)} onChange={e => handleChange("dataFimReal", e.target.value)} />
             </div>
        </div>
      </div>

      <div className="card">
        <h3>Local da Obra</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
             <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
               <label>Morada / Endereço Completo</label>
               <input value={form.morada || ""} onChange={e => handleChange("morada", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Localidade</label>
               <input value={form.localidade || ""} onChange={e => handleChange("localidade", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Código Postal</label>
               <input value={form.codigoPostal || ""} onChange={e => handleChange("codigoPostal", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Distrito</label>
               <input value={form.distrito || ""} onChange={e => handleChange("distrito", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>País</label>
               <input value={form.pais || ""} onChange={e => handleChange("pais", e.target.value)} />
             </div>
        </div>
      </div>

      <div className="card">
         <div className="formGroup">
           <label>Descrição Opcional</label>
           <textarea rows={2} style={{ width: "100%", padding: 8 }} value={form.descricao || ""} onChange={e => handleChange("descricao", e.target.value)} />
         </div>
         <div className="formGroup" style={{marginTop: 8}}>
           <label>Observações Internas (Não aparecem no orçamento)</label>
           <textarea rows={4} style={{ width: "100%", padding: 8 }} value={form.observacoes || ""} onChange={e => handleChange("observacoes", e.target.value)} />
         </div>
         {isEditing && (
           <div className="formGroup" style={{ marginTop: 16 }}>
             <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
               <input type="checkbox" checked={Number(form.ativo)===1} onChange={e => handleChange("ativo", e.target.checked ? 1 : 0)} />
               Ativa
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
