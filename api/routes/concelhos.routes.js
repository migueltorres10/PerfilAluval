const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../db/sql");

router.get("/", async (req, res) => {
  try {
    const distrito = (req.query.distrito || "").toString().trim();
    if (!distrito) return res.status(400).json({ error: "Query 'distrito' é obrigatória (ex: ?distrito=13)" });

    const pool = await getPool();
    const r = await pool.request()
      .input("d", sql.Char(2), distrito)
      .query(`
        SELECT cod_concelho AS CodConcelho, nome_concelho AS NomeConcelho
        FROM rg.Concelhos
        WHERE cod_distrito = @d
        ORDER BY nome_concelho
      `);

    res.json(r.recordset);
  } catch (e) {
    res.status(500).json({ error: "Erro ao listar concelhos", detail: e.message });
  }
});

module.exports = router;
