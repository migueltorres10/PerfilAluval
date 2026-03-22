import { useCallback, useEffect, useState } from "react";
import { tiposContratoApi } from "../../services/api";
import { AlertBox } from "../../components/ui/AlertBox";
import { Button } from "../../components/ui/Button";

export default function TiposContratoPage() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const [form, setForm] = useState({ nome: "", descricao: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const data = await tiposContratoApi.list();
      setLista(data || []);
    } catch (err) {
      setApiError("Erro ao carregar tipos de contrato.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e) {
    e.preventDefault();
    setApiError(""); setApiSuccess(""); setSaving(true);
    try {
      await tiposContratoApi.create(form);
      setApiSuccess("Criado com sucesso!");
      setForm({ nome: "", descricao: "" });
      load();
    } catch (err) {
      setApiError(err?.data?.error || "Erro ao criar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Pretende eliminar este registo?")) return;
    setApiError(""); setApiSuccess("");
    try {
      await tiposContratoApi.remove(id);
      setApiSuccess("Eliminado com sucesso!");
      load();
    } catch (err) {
      setApiError("Erro ao eliminar.");
    }
  }

  return (
    <div className="pageContent">
      <div className="pageHeader">
        <div>
          <h1>Tipos de Contrato</h1>
          <p className="pageHeaderSub">Gestão de vínculos laborais</p>
        </div>
      </div>

      {apiError && <AlertBox>{apiError}</AlertBox>}
      {apiSuccess && <AlertBox variant="success">{apiSuccess}</AlertBox>}

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Nome *</label>
          <input required value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} style={{ width: "100%" }} />
        </div>
        <div style={{ flex: 2 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 4, opacity: 0.8 }}>Descrição</label>
          <input value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} style={{ width: "100%" }} />
        </div>
        <Button type="submit" loading={saving}>Adicionar</Button>
      </form>

      {loading ? (
        <div style={{ marginTop: 20 }}>A carregar...</div>
      ) : (
        <div className="listStack" style={{ marginTop: 24 }}>
          {lista.map(item => (
            <div key={item.id} className="listRow" style={{ alignItems: "center" }}>
              <div className="rowMain">
                <div className="rowTitle" style={{ fontSize: 15 }}>{item.nome} {item.ativo === 0 && "(Inativo)"}</div>
                <div className="rowSub">{item.descricao || "Sem descrição"}</div>
              </div>
              {item.ativo !== 0 && (
                <div className="listRowActions">
                  <Button variant="danger" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                </div>
              )}
            </div>
          ))}
          {lista.length === 0 && <p style={{ opacity: 0.8 }}>Nenhum registo encontrado.</p>}
        </div>
      )}
    </div>
  );
}
