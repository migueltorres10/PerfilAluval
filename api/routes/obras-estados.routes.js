const express = require('express');
const { sql, getPool } = require('../db/sql');

const router = express.Router();

// GET all (Ativo = 1 default)
router.get('/', async (req, res) => {
  try {
    const defaultSearch = req.query.all ? "" : "WHERE Ativo = 1";
    const pool = await getPool();
    const result = await pool.request()
      .query(`SELECT ObraEstadoID as id, Nome as nome, Descricao as descricao, Ordem as ordem, Ativo as ativo FROM [rg].[ObrasEstados] ${defaultSearch} ORDER BY Ordem ASC, Nome ASC`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao listar estados de obra:', err);
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
      .query('SELECT ObraEstadoID as id, Nome as nome, Descricao as descricao, Ordem as ordem, Ativo as ativo FROM [rg].[ObrasEstados] WHERE ObraEstadoID = @id');
      
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Estado de obra não encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao procurar estado de obra:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST new
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, ordem, ativo } = req.body;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('nome', sql.NVarChar, nome)
      .input('descricao', sql.NVarChar, descricao || null)
      .input('ordem', sql.Int, ordem || 0)
      .input('ativo', sql.Bit, ativo !== undefined ? ativo : 1)
      .query(`
        INSERT INTO [rg].[ObrasEstados] (Nome, Descricao, Ordem, Ativo) 
        OUTPUT INSERTED.ObraEstadoID as id, INSERTED.Nome as nome, INSERTED.Descricao as descricao, INSERTED.Ordem as ordem, INSERTED.Ativo as ativo
        VALUES (@nome, @descricao, @ordem, @ativo)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao criar estado de obra:', err);
    if (err.number === 2627) return res.status(400).json({ error: 'Já existe um estado com este nome' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, descricao, ordem, ativo } = req.body;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const pool = await getPool();
    const check = await pool.request().input('id', sql.Int, id).query('SELECT 1 FROM [rg].[ObrasEstados] WHERE ObraEstadoID = @id');
    if (check.recordset.length === 0) return res.status(404).json({ error: 'Estado não encontrado' });

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nome', sql.NVarChar, nome)
      .input('descricao', sql.NVarChar, descricao || null)
      .input('ordem', sql.Int, ordem || 0)
      .input('ativo', sql.Bit, ativo !== undefined ? ativo : 1)
      .query(`
        UPDATE [rg].[ObrasEstados] 
        SET Nome = @nome, Descricao = @descricao, Ordem = @ordem, Ativo = @ativo, DataAtualizacao = SYSDATETIME()
        OUTPUT INSERTED.ObraEstadoID as id, INSERTED.Nome as nome, INSERTED.Descricao as descricao, INSERTED.Ordem as ordem, INSERTED.Ativo as ativo
        WHERE ObraEstadoID = @id
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao atualizar estado de obra:', err);
    if (err.number === 2627) return res.status(400).json({ error: 'Já existe um estado com este nome' });
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
        UPDATE [rg].[ObrasEstados] 
        SET Ativo = 0, DataAtualizacao = SYSDATETIME()
        WHERE ObraEstadoID = @id
      `);
      
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Estado não encontrado' });
    }
    
    res.json({ message: 'Apagado com sucesso (soft delete)' });
  } catch (err) {
    console.error('Erro ao apagar estado de obra:', err);
    res.status(500).json({ error: 'Erro interno ao apagar' });
  }
});

module.exports = router;
