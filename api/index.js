const express = require("express");
const cors = require("cors");
require("dotenv").config();

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


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API a correr em http://localhost:${port}`);
});
