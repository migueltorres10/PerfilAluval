const express = require("express");
const router = express.Router();

const { sql, getPool } = require("../db/sql");

// GET cliente por ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Id inválido" });
    }

    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT
          ClienteID,
          TipoCliente,
          Nome,
          NomeComercial,
          NIF,
          PaisID,
          Email,
          Telefone,
          Telemovel,
          CodDistrito,
          CodConcelho,
          NomeLocalidade,
          NumCodPostal,
          ExtCodPostal,
          MoradaLinha1,
          MoradaLinha2,
          Observacoes,
          Ativo,
          DataCriacao,
          DataAtualizacao
        FROM rg.Clientes
        WHERE ClienteID = @id
      `);

    if (!r.recordset.length) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json(r.recordset[0]);
  } catch (e) {
    res.status(500).json({
      error: "Erro ao obter cliente",
      detail: e.message,
    });
  }
});

module.exports = router;
