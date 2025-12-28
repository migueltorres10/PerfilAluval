const express = require("express");
const router = express.Router();

const { sql, getPool } = require("../db/sql");

// GET lista de países ativos
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT
        PaisID,
        ISO2,
        ISO3,
        ISOnumeric,
        NomePT
      FROM rg.Paises
      WHERE Ativo = 1
      ORDER BY NomePT
    `);

    res.json(r.recordset);
  } catch (e) {
    res.status(500).json({ error: "Erro ao listar países", detail: e.message });
  }
});

module.exports = router;
