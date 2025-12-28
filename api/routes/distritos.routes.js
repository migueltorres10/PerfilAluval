const express = require("express");
const router = express.Router();
const { getPool } = require("../db/sql");

router.get("/", async (_req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT cod_distrito AS CodDistrito, nome_distrito AS NomeDistrito
      FROM rg.Distritos
      ORDER BY nome_distrito
    `);
    res.json(r.recordset);
  } catch (e) {
    res.status(500).json({ error: "Erro ao listar distritos", detail: e.message });
  }
});

module.exports = router;
