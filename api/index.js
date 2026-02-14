const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log(">> API entrypoint: api/index.js");

console.log(">> DB Server Config:", process.env.DB_SERVER);

const app = express();
app.use(cors());
app.use(express.json());

const { getPool } = require("./db/sql");

app.get("/api/health", async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query("SELECT 1 AS ok");
    res.json({ ok: true, db: r.recordset[0].ok });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use("/api/paises", require("./routes/paises.routes"));
app.use("/api/distritos", require("./routes/distritos.routes"));
app.use("/api/concelhos", require("./routes/concelhos.routes"));
app.use("/api/clientes", require("./routes/clientes.routes"));
app.use("/api/fornecedores", require("./routes/fornecedores.routes"));

// (opcional) 404 JSON
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ✅ error handler TEM de ser o último
app.use((err, req, res, next) => {
  console.error("🔥 API error:", err);
  res.status(err.status || 500).json({
    error: err?.message || "Internal Server Error",
    // opcional para debugging:
    // detail: err?.data || err
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API a correr em http://localhost:${port}`);
});