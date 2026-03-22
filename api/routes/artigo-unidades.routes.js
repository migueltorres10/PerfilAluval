const express = require('express');
const { sql, getPool } = require('../db/sql');

const router = express.Router();

// GET all
router.get('/', async (req, res) => {
  try {
    const defaultSearch = req.query.all ? "" : "WHERE Ativo = 1";
    const pool = await getPool();
    const result = await pool.request()
      .query(`SELECT UnidadeID as id, Codigo as codigo, Nome as nome, Descricao as descricao, Ativo as ativo FROM [rg].[ArtigoUnidades] ${defaultSearch} ORDER BY Nome ASC`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao listar unidades:', err);
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
      .query('SELECT UnidadeID as id, Codigo as codigo, Nome as nome, Descricao as descricao, Ativo as ativo FROM [rg].[ArtigoUnidades] WHERE UnidadeID = @id');
      
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Unidade não encontrada' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao procurar unidade:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST new
router.post('/', async (req, res) => {
  try {
    const { codigo, nome, descricao, ativo } = req.body;
    if (!codigo || !nome) return res.status(400).json({ error: 'Código e Nome são obrigatórios' });

    const pool = await getPool();
    const result = await pool.request()
      .input('codigo', sql.NVarChar, codigo)
      .input('nome', sql.NVarChar, nome)
      .input('descricao', sql.NVarChar, descricao || null)
      .input('ativo', sql.Bit, ativo !== undefined ? ativo : 1)
      .query(`
        INSERT INTO [rg].[ArtigoUnidades] (Codigo, Nome, Descricao, Ativo) 
        OUTPUT INSERTED.UnidadeID as id, INSERTED.Codigo as codigo, INSERTED.Nome as nome, INSERTED.Descricao as descricao, INSERTED.Ativo as ativo
        VALUES (@codigo, @nome, @descricao, @ativo)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao criar unidade:', err);
    if (err.number === 2627) return res.status(400).json({ error: 'Já existe uma unidade com este Código ou Nome' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { codigo, nome, descricao, ativo } = req.body;
    
    if (!codigo || !nome) return res.status(400).json({ error: 'Código e Nome são obrigatórios' });

    const pool = await getPool();
    const check = await pool.request().input('id', sql.Int, id).query('SELECT 1 FROM [rg].[ArtigoUnidades] WHERE UnidadeID = @id');
    if (check.recordset.length === 0) return res.status(404).json({ error: 'Unidade não encontrada' });

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('codigo', sql.NVarChar, codigo)
      .input('nome', sql.NVarChar, nome)
      .input('descricao', sql.NVarChar, descricao || null)
      .input('ativo', sql.Bit, ativo !== undefined ? ativo : 1)
      .query(`
        UPDATE [rg].[ArtigoUnidades] 
        SET Codigo = @codigo, Nome = @nome, Descricao = @descricao, Ativo = @ativo, DataAtualizacao = SYSDATETIME()
        OUTPUT INSERTED.UnidadeID as id, INSERTED.Codigo as codigo, INSERTED.Nome as nome, INSERTED.Descricao as descricao, INSERTED.Ativo as ativo
        WHERE UnidadeID = @id
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao atualizar unidade:', err);
    if (err.number === 2627) return res.status(400).json({ error: 'Já existe uma unidade com este Código ou Nome' });
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
        UPDATE [rg].[ArtigoUnidades] 
        SET Ativo = 0, DataAtualizacao = SYSDATETIME()
        WHERE UnidadeID = @id
      `);
      
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Unidade não encontrada' });
    
    res.json({ message: 'Apagado com sucesso (soft delete)' });
  } catch (err) {
    console.error('Erro ao apagar unidade:', err);
    res.status(500).json({ error: 'Erro interno ao apagar' });
  }
});

module.exports = router;
