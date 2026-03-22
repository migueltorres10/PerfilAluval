const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../db/sql");

// GET /api/departamentos
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT DepartamentoID as id, Nome as nome, Descricao as descricao, Ativo as ativo
      FROM rg.Departamentos
      ORDER BY Nome
    `);
    res.json(r.recordset);
  } catch (e) {
    res.status(500).json({ error: "Erro ao listar departamentos", detail: e.message });
  }
});

// GET /api/departamentos/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT DepartamentoID as id, Nome as nome, Descricao as descricao, Ativo as ativo
        FROM rg.Departamentos
        WHERE DepartamentoID = @id
      `);
    if (r.recordset.length === 0) return res.status(404).json({ error: "Departamento não encontrado" });
    res.json(r.recordset[0]);
  } catch (e) {
    res.status(500).json({ error: "Erro ao obter departamento", detail: e.message });
  }
});

// POST /api/departamentos
router.post("/", async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    const pool = await getPool();
    const r = await pool.request()
      .input("nome", sql.NVarChar(100), nome)
      .input("descricao", sql.NVarChar(250), descricao)
      .query(`
        INSERT INTO rg.Departamentos (Nome, Descricao)
        OUTPUT INSERTED.DepartamentoID
        VALUES (@nome, @descricao)
      `);
    res.status(201).json({ id: r.recordset[0].DepartamentoID });
  } catch (e) {
    if (e.message.includes("UQ_Departamentos_Nome")) {
      return res.status(400).json({ error: "Já existe um departamento com esse nome" });
    }
    res.status(500).json({ error: "Erro ao criar", detail: e.message });
  }
});

// PUT /api/departamentos/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, descricao, ativo } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });

    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .input("nome", sql.NVarChar(100), nome)
      .input("descricao", sql.NVarChar(250), descricao)
      .input("ativo", sql.Bit, ativo === undefined || ativo === null ? 1 : ativo)
      .query(`
        UPDATE rg.Departamentos
        SET Nome = @nome, Descricao = @descricao, Ativo = @ativo, DataAtualizacao = SYSDATETIME()
        WHERE DepartamentoID = @id
      `);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao atualizar", detail: e.message });
  }
});

// DELETE /api/departamentos/:id (soft delete/hard delete)
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pool = await getPool();
    // Soft delete to avoid breaking FK constraints
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE rg.Departamentos
        SET Ativo = 0, DataAtualizacao = SYSDATETIME()
        WHERE DepartamentoID = @id
      `);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao eliminar", detail: e.message });
  }
});

module.exports = router;
