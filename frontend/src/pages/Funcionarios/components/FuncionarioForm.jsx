import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { departamentosApi, funcoesApi, paisesApi, distritosApi, concelhosApi, tiposContratoApi, funcionariosApi } from "../../../services/api";
import { Button } from "../../../components/ui/Button";

function SDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

export default function FuncionarioForm({
  initialData, isEditing, onSubmit, onCancel, apiError, saving 
}) {
  const [form, setForm] = useState(initialData || {
    nome: "", dataNascimento: "", nif: "", numeroSegurancaSocial: "", numeroCartaoCidadao: "",
    email: "", telefone: "", telemovel: "", 
    moradaLinha1: "", moradaLinha2: "", nomeLocalidade: "", numCodPostal: "", extCodPostal: "", codDistrito: "", codConcelho: "", paisId: 178, // 178 = Portugal
    funcaoId: "", departamentoId: "", tipoContratoId: "", dataAdmissao: "", dataSaida: "", salarioBaseMensal: "",
    observacoes: "", ativo: 1
  });

  const [lookups, setLookups] = useState({
    paises: [], distritos: [], concelhos: [], departamentos: [], funcoes: [], tiposContrato: []
  });

  const carregarLookups = useCallback(async () => {
    try {
      const [ps, ds, dt, fn, tc] = await Promise.all([
        paisesApi.list(), distritosApi.list(), departamentosApi.list(), funcoesApi.list(), tiposContratoApi.list()
      ]);
      setLookups(prev => ({ ...prev, paises: ps||[], distritos: ds||[], departamentos: dt||[], funcoes: fn||[], tiposContrato: tc||[] }));
      if (form.codDistrito) {
        carregarConcelhos(form.codDistrito);
      }
    } catch (e) {
      console.error(e);
    }
  }, [form.codDistrito]);

  useEffect(() => { carregarLookups(); }, [carregarLookups]);

  const carregarConcelhos = async (distId) => {
    try {
      if (!distId) {
        setLookups(p => ({ ...p, concelhos: [] }));
        return;
      }
      const c = await concelhosApi.listByDistrito(distId);
      setLookups(p => ({ ...p, concelhos: c || [] }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => {
      const nov = { ...prev, [field]: value };
      if (field === "codDistrito") {
        nov.codConcelho = "";
        carregarConcelhos(value);
      }
      // Automatch form funcoes
      if (field === "departamentoId") {
        nov.funcaoId = "";
      }
      return nov;
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="formStack">
      
      <div className="card">
        <h3>Dados Pessoais</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
             <div className="formGroup">
               <label>Nome *</label>
               <input required value={form.nome} onChange={e => handleChange("nome", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Data Nascimento</label>
               <input type="date" value={SDate(form.dataNascimento)} onChange={e => handleChange("dataNascimento", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>NIF *</label>
               <input required value={form.nif} onChange={e => handleChange("nif", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>N.º Seg. Social</label>
               <input value={form.numeroSegurancaSocial} onChange={e => handleChange("numeroSegurancaSocial", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Cartão de Cidadão</label>
               <input value={form.numeroCartaoCidadao} onChange={e => handleChange("numeroCartaoCidadao", e.target.value)} />
             </div>
        </div>
      </div>

      <div className="card">
        <h3>Contactos & Morada</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
             <div className="formGroup">
               <label>Email</label>
               <input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Telemóvel</label>
               <input value={form.telemovel} onChange={e => handleChange("telemovel", e.target.value)} />
             </div>
             <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
               <label>Morada (Linha 1)</label>
               <input value={form.moradaLinha1} onChange={e => handleChange("moradaLinha1", e.target.value)} />
             </div>
             <div className="formGroup" style={{ gridColumn: "1 / -1" }}>
               <label>Localidade</label>
               <input value={form.nomeLocalidade} onChange={e => handleChange("nomeLocalidade", e.target.value)} />
             </div>
             <div className="formGroup">
                 <label>Código Postal</label>
                 <div style={{ display: "flex", gap: 4 }}>
                   <input style={{ width: 80 }} value={form.numCodPostal} onChange={e => handleChange("numCodPostal", e.target.value)} placeholder="0000" maxLength={4} />
                   <span style={{ alignSelf: "center" }}>-</span>
                   <input style={{ width: 60 }} value={form.extCodPostal} onChange={e => handleChange("extCodPostal", e.target.value)} placeholder="000" maxLength={3} />
                 </div>
             </div>
             <div className="formGroup">
               <label>País</label>
               <select required value={form.paisId} onChange={e => handleChange("paisId", e.target.value)}>
                 {lookups.paises.map(p => <option key={p.PaisID} value={p.PaisID}>{p.NomePT}</option>)}
               </select>
             </div>
        </div>
      </div>


      <div className="card">
        <h3>Dados Profissionais</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
             <div className="formGroup">
               <label>Departamento</label>
               <select value={form.departamentoId} onChange={e => handleChange("departamentoId", e.target.value)}>
                 <option value="">Selecione...</option>
                 {lookups.departamentos.filter(d=>d.ativo).map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
               </select>
             </div>
             <div className="formGroup">
               <label>Função</label>
               <select value={form.funcaoId} onChange={e => handleChange("funcaoId", e.target.value)} disabled={!form.departamentoId}>
                 <option value="">Selecione...</option>
                 {lookups.funcoes.filter(f=> f.ativo && f.departamentoId == form.departamentoId).map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
               </select>
             </div>
             <div className="formGroup">
               <label>Tipo de Contrato</label>
               <select value={form.tipoContratoId} onChange={e => handleChange("tipoContratoId", e.target.value)}>
                 <option value="">Selecione...</option>
                 {lookups.tiposContrato.filter(t=>t.ativo).map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
               </select>
             </div>
             <div className="formGroup">
               <label>Salário Base (€)</label>
               <input type="number" step="0.01" value={form.salarioBaseMensal} onChange={e => handleChange("salarioBaseMensal", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Data Admissão</label>
               <input type="date" value={SDate(form.dataAdmissao)} onChange={e => handleChange("dataAdmissao", e.target.value)} />
             </div>
             <div className="formGroup">
               <label>Data Saída</label>
               <input type="date" value={SDate(form.dataSaida)} onChange={e => handleChange("dataSaida", e.target.value)} />
             </div>
        </div>
      </div>

      <div className="card">
         <div className="formGroup">
           <label>Observações</label>
           <textarea rows={4} style={{ width: "100%", padding: 8 }} value={form.observacoes} onChange={e => handleChange("observacoes", e.target.value)} />
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
