const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../db/sql");

// GET /api/funcoes
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT f.FuncaoID as id, f.Nome as nome, f.Descricao as descricao, f.Ativo as ativo,
             f.DepartamentoID as departamentoId, d.Nome as departamentoNome
      FROM rg.Funcoes f
      LEFT JOIN rg.Departamentos d ON f.DepartamentoID = d.DepartamentoID
      ORDER BY f.Nome
    `);
    res.json(r.recordset);
  } catch (e) {
    res.status(500).json({ error: "Erro ao listar funções", detail: e.message });
  }
});

// GET /api/funcoes/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT FuncaoID as id, Nome as nome, DepartamentoID as departamentoId, Descricao as descricao, Ativo as ativo
        FROM rg.Funcoes
        WHERE FuncaoID = @id
      `);
    if (r.recordset.length === 0) return res.status(404).json({ error: "Função não encontrada" });
    res.json(r.recordset[0]);
  } catch (e) {
    res.status(500).json({ error: "Erro ao obter função", detail: e.message });
  }
});

// POST /api/funcoes
router.post("/", async (req, res) => {
  try {
    const { nome, departamentoId, descricao } = req.body;
    if (!nome || !departamentoId) return res.status(400).json({ error: "Nome e Departamento são obrigatórios" });

    const pool = await getPool();
    const r = await pool.request()
      .input("nome", sql.NVarChar(100), nome)
      .input("departamentoId", sql.Int, departamentoId)
      .input("descricao", sql.NVarChar(250), descricao)
      .query(`
        INSERT INTO rg.Funcoes (Nome, DepartamentoID, Descricao)
        OUTPUT INSERTED.FuncaoID
        VALUES (@nome, @departamentoId, @descricao)
      `);
    res.status(201).json({ id: r.recordset[0].FuncaoID });
  } catch (e) {
    res.status(500).json({ error: "Erro ao criar", detail: e.message });
  }
});

// PUT /api/funcoes/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, departamentoId, descricao, ativo } = req.body;
    if (!nome || !departamentoId) return res.status(400).json({ error: "Nome e Departamento são obrigatórios" });

    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .input("nome", sql.NVarChar(100), nome)
      .input("departamentoId", sql.Int, departamentoId)
      .input("descricao", sql.NVarChar(250), descricao)
      .input("ativo", sql.Bit, ativo === undefined || ativo === null ? 1 : ativo)
      .query(`
        UPDATE rg.Funcoes
        SET Nome = @nome, DepartamentoID = @departamentoId, Descricao = @descricao, Ativo = @ativo, DataAtualizacao = SYSDATETIME()
        WHERE FuncaoID = @id
      `);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao atualizar", detail: e.message });
  }
});

// DELETE /api/funcoes/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE rg.Funcoes
        SET Ativo = 0, DataAtualizacao = SYSDATETIME()
        WHERE FuncaoID = @id
      `);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao eliminar", detail: e.message });
  }
});

module.exports = router;
