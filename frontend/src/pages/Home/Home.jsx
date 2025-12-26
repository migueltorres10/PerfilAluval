import "./home.css";
import { useNavigate } from "react-router-dom";


const actions = [
  { title: "Novo Cliente", hint: "Criar ficha", icon: "👤", to: "/clientes/novo" },
  { title: "Nova Obra", hint: "Abrir obra", icon: "🏗️", to: "/obras/novo" },
  { title: "Carregar Orçamento", hint: "Importar/associar", icon: "📄", to: "/orcamentos/carregar" },
  { title: "Registar Compra", hint: "Fatura/guia", icon: "🧾", to: "/compras/registar" },
  { title: "Registar Venda", hint: "Fatura/recibo", icon: "🛒", to: "/vendas/registar" },
  { title: "Registar Pagamento", hint: "Saída", icon: "💸", to: "/financeiro/pagamento" },
  { title: "Registar Recebimento", hint: "Entrada", icon: "💰", to: "/financeiro/recebimento" },
];


const week = [
  { title: "Montagem — Obra #1024", sub: "Penafiel • 09:00", right: "Seg" },
  { title: "Entrega — Obra #1031", sub: "Porto • 14:30", right: "Ter" },
  { title: "Montagem — Obra #1018", sub: "Maia • 08:00", right: "Qui" },
  { title: "Entrega — Obra #1040", sub: "Braga • 16:00", right: "Sex" },
];

const receber = [
  { title: "Cliente X", sub: "Vence em 3 dias", right: "€ 2 450" },
  { title: "Cliente Y", sub: "Vencido (2 dias)", right: "€ 980" },
];

const pagar = [
  { title: "Fornecedor A", sub: "Vence amanhã", right: "€ 1 120" },
  { title: "Fornecedor B", sub: "Vence em 5 dias", right: "€ 640" },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="homeWrap">
      <div className="homeHeader">
        <div>
          <h1 className="homeTitle">Home</h1>
          <p className="homeSubtitle">Resumo semanal e atalhos rápidos</p>
        </div>
      </div>

      <div className="actionBar" aria-label="Atalhos rápidos">
        {actions.map((a) => (
          <button
            key={a.title}
            className="actionBtn"
            onClick={() => navigate(a.to)}
            type="button"
          >
            <span className="actionIcon" aria-hidden="true">{a.icon}</span>
            <span className="actionText">
              <span className="actionTitle">{a.title}</span>
              <span className="actionHint">{a.hint}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="homeGrid">
        <section className="card">
          <h2 className="cardTitle">Montagens/Entregas — Semana</h2>
          <p className="cardMeta">Vista rápida (mock) • vamos ligar ao SQL mais tarde</p>

          <div className="list">
            {week.map((r) => (
              <div key={r.title} className="listRow">
                <div className="rowMain">
                  <div className="rowTitle">{r.title}</div>
                  <div className="rowSub">{r.sub}</div>
                </div>
                <div className="rowRight">{r.right}</div>
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <section className="card">
            <h2 className="cardTitle">A receber</h2>
            <p className="cardMeta">Total (mock): € 3 430</p>
            <div className="list">
              {receber.map((r) => (
                <div key={r.title} className="listRow">
                  <div className="rowMain">
                    <div className="rowTitle">{r.title}</div>
                    <div className="rowSub">{r.sub}</div>
                  </div>
                  <div className="rowRight">{r.right}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h2 className="cardTitle">A pagar</h2>
            <p className="cardMeta">Total (mock): € 1 760</p>
            <div className="list">
              {pagar.map((r) => (
                <div key={r.title} className="listRow">
                  <div className="rowMain">
                    <div className="rowTitle">{r.title}</div>
                    <div className="rowSub">{r.sub}</div>
                  </div>
                  <div className="rowRight">{r.right}</div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="kpis">
        <div className="card">
          <h2 className="cardTitle">Obras prontas para montagem/entrega</h2>
          <div className="kpiValue">4</div>
          <div className="kpiHint">Clique para ver lista (mais tarde)</div>
        </div>

        <div className="card">
          <h2 className="cardTitle">Obras em produção</h2>
          <div className="kpiValue">9</div>
          <div className="kpiHint">Estado atual do chão de fábrica</div>
        </div>

        <div className="card">
          <h2 className="cardTitle">Orçamentos prontos para produção</h2>
          <div className="kpiValue">3</div>
          <div className="kpiHint">A validar / adjudicar</div>
        </div>
      </section>
    </div>
  );
}
