export default function Home() {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(12, 1fr)" }}>
      <section style={{ gridColumn: "span 4", background: "white", border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
        <h3>Resumo</h3>
        <p>Indicadores rápidos.</p>
      </section>

      <section style={{ gridColumn: "span 4", background: "white", border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
        <h3>Atalhos</h3>
        <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(2, 1fr)" }}>
          <button>Nova Obra</button>
          <button>Novo Orçamento</button>
          <button>Registar Compra</button>
          <button>Registar Pagamento</button>
        </div>
      </section>

      <section style={{ gridColumn: "span 4", background: "white", border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
        <h3>Tarefas</h3>
        <ol>
          <li>Validar encomendas</li>
          <li>Conferir custos</li>
          <li>Fecho semanal</li>
        </ol>
      </section>
    </div>
  );
}
