const express = require('express');
const { sql, getPool } = require('../db/sql');

const router = express.Router();

// GET all
router.get('/', async (req, res) => {
  try {
    const defaultSearch = req.query.all ? "" : "WHERE Ativo = 1";
    const pool = await getPool();
    const result = await pool.request()
      .query(`SELECT ArtigoFamiliaID as id, Nome as nome, Descricao as descricao, Ativo as ativo FROM [rg].[ArtigoFamilias] ${defaultSearch} ORDER BY Nome ASC`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao listar familias:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT ArtigoFamiliaID as id, Nome as nome, Descricao as descricao, Ativo as ativo FROM [rg].[ArtigoFamilias] WHERE ArtigoFamiliaID = @id');
      
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Familia não encontrada' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao procurar familia:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST new
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, ativo } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

    const pool = await getPool();
    const result = await pool.request()
      .input('nome', sql.NVarChar, nome)
      .input('descricao', sql.NVarChar, descricao || null)
      .input('ativo', sql.Bit, ativo !== undefined ? ativo : 1)
      .query(`
        INSERT INTO [rg].[ArtigoFamilias] (Nome, Descricao, Ativo) 
        OUTPUT INSERTED.ArtigoFamiliaID as id, INSERTED.Nome as nome, INSERTED.Descricao as descricao, INSERTED.Ativo as ativo
        VALUES (@nome, @descricao, @ativo)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao criar Familia:', err);
    if (err.number === 2627) return res.status(400).json({ error: 'Já existe uma familia com este Nome' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, descricao, ativo } = req.body;
    
    if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

    const pool = await getPool();
    const check = await pool.request().input('id', sql.Int, id).query('SELECT 1 FROM [rg].[ArtigoFamilias] WHERE ArtigoFamiliaID = @id');
    if (check.recordset.length === 0) return res.status(404).json({ error: 'Familia não encontrada' });

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nome', sql.NVarChar, nome)
      .input('descricao', sql.NVarChar, descricao || null)
      .input('ativo', sql.Bit, ativo !== undefined ? ativo : 1)
      .query(`
        UPDATE [rg].[ArtigoFamilias] 
        SET Nome = @nome, Descricao = @descricao, Ativo = @ativo, DataAtualizacao = SYSDATETIME()
        OUTPUT INSERTED.ArtigoFamiliaID as id, INSERTED.Nome as nome, INSERTED.Descricao as descricao, INSERTED.Ativo as ativo
        WHERE ArtigoFamiliaID = @id
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao atualizar familia:', err);
    if (err.number === 2627) return res.status(400).json({ error: 'Já existe uma familia com este Nome' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE soft delete
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE [rg].[ArtigoFamilias] 
        SET Ativo = 0, DataAtualizacao = SYSDATETIME()
        WHERE ArtigoFamiliaID = @id
      `);
      
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Familia não encontrada' });
    
    res.json({ message: 'Apagado com sucesso (soft delete)' });
  } catch (err) {
    console.error('Erro ao apagar familia:', err);
    res.status(500).json({ error: 'Erro interno ao apagar' });
  }
});

module.exports = router;
