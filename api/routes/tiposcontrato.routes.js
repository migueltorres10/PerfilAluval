const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../db/sql");

// GET /api/tipos-contrato
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT TipoContratoID as id, Nome as nome, Descricao as descricao, Ativo as ativo
      FROM rg.TiposContrato
      ORDER BY Nome
    `);
    res.json(r.recordset);
  } catch (e) {
    res.status(500).json({ error: "Erro ao listar tipos de contrato", detail: e.message });
  }
});

// GET /api/tipos-contrato/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT TipoContratoID as id, Nome as nome, Descricao as descricao, Ativo as ativo
        FROM rg.TiposContrato
        WHERE TipoContratoID = @id
      `);
    if (r.recordset.length === 0) return res.status(404).json({ error: "Tipo de contrato não encontrado" });
    res.json(r.recordset[0]);
  } catch (e) {
    res.status(500).json({ error: "Erro ao obter tipo de contrato", detail: e.message });
  }
});

// POST /api/tipos-contrato
router.post("/", async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    const pool = await getPool();
    const r = await pool.request()
      .input("nome", sql.NVarChar(50), nome)
      .input("descricao", sql.NVarChar(250), descricao)
      .query(`
        INSERT INTO rg.TiposContrato (Nome, Descricao)
        OUTPUT INSERTED.TipoContratoID
        VALUES (@nome, @descricao)
      `);
    res.status(201).json({ id: r.recordset[0].TipoContratoID });
  } catch (e) {
    res.status(500).json({ error: "Erro ao criar", detail: e.message });
  }
});

// PUT /api/tipos-contrato/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, descricao, ativo } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .input("nome", sql.NVarChar(50), nome)
      .input("descricao", sql.NVarChar(250), descricao)
      .input("ativo", sql.Bit, ativo === undefined || ativo === null ? 1 : ativo)
      .query(`
        UPDATE rg.TiposContrato
        SET Nome = @nome, Descricao = @descricao, Ativo = @ativo, DataAtualizacao = SYSDATETIME()
        WHERE TipoContratoID = @id
      `);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao atualizar", detail: e.message });
  }
});

// DELETE /api/tipos-contrato/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE rg.TiposContrato
        SET Ativo = 0, DataAtualizacao = SYSDATETIME()
        WHERE TipoContratoID = @id
      `);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao eliminar", detail: e.message });
  }
});

module.exports = router;
