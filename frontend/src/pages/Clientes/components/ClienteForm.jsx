import { useEffect, useRef } from "react";
import { FormField } from "../../../components/ui/FormField";
import { TextInput, SelectInput } from "../../../components/ui/Input";
import { AlertBox } from "../../../components/ui/AlertBox";
import EnderecoFields from "./EnderecoFields";

export default function ClienteForm({
  form,
  errors,
  apiError,
  apiSuccess,
  saving,
  onChange,
  onSubmit,
  onBack,
  paises,
  loadingPaises,
  distritos,
  loadingDistritos,
  concelhos,
  loadingConcelhos,
  title = "Novo Cliente",
  subtitle = "Criar ficha de cliente",
  submitLabel = "Criar Cliente",
}) {
  const topRef = useRef(null);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" }); // fallback
  };

  // sempre que houver erro/sucesso, sobe
  useEffect(() => {
    if (apiError || apiSuccess) scrollToTop();
  }, [apiError, apiSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    scrollToTop();      // sobe logo ao clicar em "Criar Cliente"
    onSubmit?.(e);      // chama o submit real (parent)
  };

  return (
    <div className="clienteFormPage">
      {/* anchor no topo */}
      <div ref={topRef} />

      <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0 }}>{title}</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.75 }}>{subtitle}</p>
        </div>
        <button type="button" onClick={onBack}>Voltar</button>
      </header>

      {/* mensagens no topo */}
      {apiError && <AlertBox>{apiError}</AlertBox>}
      {apiSuccess && <AlertBox variant="success">{apiSuccess}</AlertBox>}

      <form onSubmit={handleSubmit} className="clienteFormGrid">
        <div className="col">
          <FormField label="Tipo de Cliente" error={errors.tipoCliente}>
            <SelectInput name="tipoCliente" value={form.tipoCliente} onChange={onChange}>
              <option value="E">E — Empresa</option>
              <option value="P">P — Particular</option>
            </SelectInput>
          </FormField>
        </div>

        <FormField label="País *" error={errors.paisId}>
          <SelectInput name="paisId" value={form.paisId} onChange={onChange} disabled={loadingPaises}>
            {paises.map((p) => (
              <option key={p.PaisID} value={p.PaisID}>
                {p.NomePT}
              </option>
            ))}
          </SelectInput>
        </FormField>

        <div className="col span2">
          <FormField label="Nome *" error={errors.nome}>
            <TextInput name="nome" value={form.nome} onChange={onChange} placeholder="Ex: Miguel Torres / Empresa" />
          </FormField>
        </div>

        <FormField label="Nome Comercial" error={errors.nomeComercial}>
          <TextInput name="nomeComercial" value={form.nomeComercial} onChange={onChange} placeholder="Ex: Aluval" />
        </FormField>

        <FormField label="NIF*" error={errors.nif}>
          <TextInput name="nif" value={form.nif} maxLength={20} onChange={onChange} placeholder="NIF" />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <TextInput name="email" value={form.email} onChange={onChange} placeholder="Ex: mail@empresa.pt" />
        </FormField>

        <FormField label="Telefone" error={errors.telefone}>
          <TextInput name="telefone" value={form.telefone} onChange={onChange} placeholder="Ex: +351 ..." />
        </FormField>

        <FormField label="Telemóvel" error={errors.telemovel}>
          <TextInput name="telemovel" value={form.telemovel} onChange={onChange} placeholder="Ex: +351 ..." />
        </FormField>

        <EnderecoFields
          form={form}
          errors={errors}
          onChange={onChange}
          distritos={distritos}
          loadingDistritos={loadingDistritos}
          concelhos={concelhos}
          loadingConcelhos={loadingConcelhos}
        />

        <FormField label="Observações" error={errors.observacoes}>
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={onChange}
            placeholder="Notas internas…"
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.92)",
              outline: "none",
              minHeight: 90,
              resize: "vertical",
            }}
          />
        </FormField>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="submit" disabled={saving}>
            {saving ? "A guardar..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}