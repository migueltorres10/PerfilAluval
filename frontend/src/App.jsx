import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch((e) => setErr(String(e)));
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Perfil Aluval</h1>

      <h2>API Health</h2>
      {err && <p style={{ color: "red" }}>Erro: {err}</p>}
      {!err && !health && <p>A carregar...</p>}
      {health && (
        <pre style={{ background: "#f4f4f4", padding: 12 }}>
          {JSON.stringify(health, null, 2)}
        </pre>
      )}
    </div>
  );
}
