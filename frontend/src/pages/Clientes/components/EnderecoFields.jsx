import { FormField } from "../../../components/ui/FormField";
import { TextInput, SelectInput } from "../../../components/ui/Input";

export default function EnderecoFields({
  form,
  errors,
  onChange,
  distritos,
  loadingDistritos,
  concelhos,
  loadingConcelhos,
}) {
  return (
    <>
      <FormField label="Distrito" error={errors.codDistrito}>
        <SelectInput
          name="codDistrito"
          value={form.codDistrito}
          onChange={onChange}
          disabled={loadingDistritos}
        >
          <option value="">— Selecionar —</option>
          {distritos.map((d) => (
            <option key={d.CodDistrito} value={d.CodDistrito}>
              {d.NomeDistrito}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label="Concelho" error={errors.codConcelho}>
        <SelectInput
          name="codConcelho"
          value={form.codConcelho}
          onChange={onChange}
          disabled={!form.codDistrito || loadingConcelhos}
        >
          <option value="">— Selecionar —</option>
          {concelhos.map((c) => (
            <option key={c.CodConcelho} value={c.CodConcelho}>
              {c.NomeConcelho}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label="Morada Linha 1" error={errors.moradaLinha1}>
        <TextInput
          name="moradaLinha1"
          value={form.moradaLinha1}
          onChange={onChange}
          placeholder="Ex: Rua da Alameda, 123"
        />
      </FormField>

      <FormField label="Morada Linha 2" error={errors.moradaLinha2}>
        <TextInput
          name="moradaLinha2"
          value={form.moradaLinha2}
          onChange={onChange}
          placeholder="Ex: 4º Andar, Apartamento 5"
        />
      </FormField>

      <FormField label="Localidade" error={errors.nomeLocalidade}>
        <TextInput
          name="nomeLocalidade"
          value={form.nomeLocalidade}
          onChange={onChange}
          placeholder="Ex: Aveiro"
        />
      </FormField>

      <FormField label="Código Postal" error={errors.numCodPostal || errors.extCodPostal}>
        <div style={{ display: "flex", gap: 8 }}>
          <TextInput
            name="numCodPostal"
            value={form.numCodPostal}
            onChange={onChange}
            placeholder="1234"
          />
          <TextInput
            name="extCodPostal"
            value={form.extCodPostal}
            onChange={onChange}
            placeholder="567"
          />
        </div>
      </FormField>
    </>
  );
}
