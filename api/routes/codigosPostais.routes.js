const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../db/sql");

// GET /api/codigos-postais?q=3020-265  OU q=coimbra OU q=Rua
router.get("/", async (req, res) => {
  try {
    const qRaw = (req.query.q || "").toString().trim();
    if (qRaw.length < 2) return res.json([]);

    const q = `%${qRaw}%`;

    const pool = await getPool();
    const r = await pool.request()
      .input("q", sql.NVarChar(200), q)
      .query(`
        SELECT TOP 20
          cod_distrito    AS CodDistrito,
          cod_concelho    AS CodConcelho,
          nome_localidade AS NomeLocalidade,
          morada_1        AS Morada1,
          morada_2        AS Morada2,
          num_cod_postal  AS NumCodPostal,
          ext_cod_postal  AS ExtCodPostal,
          desig_postal    AS DesigPostal
        FROM rg.CodigosPostais
        WHERE
          CONCAT(num_cod_postal, '-', ext_cod_postal) LIKE @q
          OR nome_localidade LIKE @q
          OR desig_postal LIKE @q
          OR morada_1 LIKE @q
          OR ISNULL(morada_2, '') LIKE @q
        ORDER BY
          num_cod_postal, ext_cod_postal
      `);

    res.json(r.recordset);
  } catch (e) {
    res.status(500).json({ error: "Erro ao sugerir códigos postais", detail: e.message });
  }
});

module.exports = router;
