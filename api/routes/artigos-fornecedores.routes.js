const express = require('express');
const { sql, getPool } = require('../db/sql');

const router = express.Router();

// GET all fornecedores for a specific Artigo
router.get('/por-artigo/:artigoId', async (req, res) => {
  try {
    const artigoId = req.params.artigoId;
    const pool = await getPool();
    const result = await pool.request()
      .input('artigoId', sql.Int, artigoId)
      .query(`
        SELECT 
          AF.ArtigoFornecedorID as id,
          AF.ArtigoID as artigoId,
          AF.FornecedorID as fornecedorId,
          AF.ReferenciaFornecedor as referenciaFornecedor,
          AF.PrecoCompra as precoCompra,
          AF.PrazoEntregaDias as prazoEntregaDias,
          AF.FornecedorPreferencial as fornecedorPreferencial,
          AF.Ativo as ativo,
          F.Nome as fornecedorNome,
          F.NIF as fornecedorNif
        FROM [rg].[ArtigosFornecedores] AF
        INNER JOIN [rg].[Fornecedores] F ON AF.FornecedorID = F.FornecedorID
        WHERE AF.ArtigoID = @artigoId AND AF.Ativo = 1
        ORDER BY AF.FornecedorPreferencial DESC, F.Nome ASC
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao listar fornecedores do artigo:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET all artigos for a specific Fornecedor (optional helper)
router.get('/por-fornecedor/:fornecedorId', async (req, res) => {
  try {
    const fornecedorId = req.params.fornecedorId;
    const pool = await getPool();
    const result = await pool.request()
      .input('fornecedorId', sql.Int, fornecedorId)
      .query(`
        SELECT 
          AF.ArtigoFornecedorID as id,
          AF.ArtigoID as artigoId,
          A.Codigo as artigoCodigo,
          A.Nome as artigoNome,
          AF.ReferenciaFornecedor as referenciaFornecedor,
          AF.PrecoCompra as precoCompra,
          AF.PrazoEntregaDias as prazoEntregaDias,
          AF.FornecedorPreferencial as fornecedorPreferencial
        FROM [rg].[ArtigosFornecedores] AF
        INNER JOIN [rg].[Artigos] A ON AF.ArtigoID = A.ArtigoID
        WHERE AF.FornecedorID = @fornecedorId AND AF.Ativo = 1
        ORDER BY A.Nome ASC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao listar artigos do fornecedor:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST new association
router.post('/', async (req, res) => {
  try {
    const { artigoId, fornecedorId, referenciaFornecedor, precoCompra, prazoEntregaDias, fornecedorPreferencial, ativo } = req.body;
    
    if (!artigoId || !fornecedorId) return res.status(400).json({ error: 'Artigo e Fornecedor são obrigatórios' });

    const pool = await getPool();
    const result = await pool.request()
      .input('artigoId', sql.Int, artigoId)
      .input('fornecedorId', sql.Int, fornecedorId)
      .input('ref', sql.NVarChar, referenciaFornecedor || null)
      .input('preco', sql.Decimal(18,4), precoCompra || null)
      .input('prazo', sql.Int, prazoEntregaDias || null)
      .input('pref', sql.Bit, fornecedorPreferencial !== undefined ? fornecedorPreferencial : 0)
      .input('ativo', sql.Bit, ativo !== undefined ? ativo : 1)
      .query(`
        INSERT INTO [rg].[ArtigosFornecedores] (ArtigoID, FornecedorID, ReferenciaFornecedor, PrecoCompra, PrazoEntregaDias, FornecedorPreferencial, Ativo) 
        OUTPUT INSERTED.ArtigoFornecedorID as id
        VALUES (@artigoId, @fornecedorId, @ref, @preco, @prazo, @pref, @ativo)
      `);

    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    console.error('Erro ao associar fornecedor ao artigo:', err);
    if (err.number === 2627) return res.status(400).json({ error: 'Este fornecedor já está associado a este artigo.' });
    if (err.number === 547) return res.status(400).json({ error: 'O artigo ou o fornecedor indicado não existem.' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { referenciaFornecedor, precoCompra, prazoEntregaDias, fornecedorPreferencial, ativo } = req.body;

    const pool = await getPool();
    const check = await pool.request().input('id', sql.Int, id).query('SELECT 1 FROM [rg].[ArtigosFornecedores] WHERE ArtigoFornecedorID = @id');
    if (check.recordset.length === 0) return res.status(404).json({ error: 'Registo não encontrado' });

    await pool.request()
      .input('id', sql.Int, id)
      .input('ref', sql.NVarChar, referenciaFornecedor || null)
      .input('preco', sql.Decimal(18,4), precoCompra || null)
      .input('prazo', sql.Int, prazoEntregaDias || null)
      .input('pref', sql.Bit, fornecedorPreferencial !== undefined ? fornecedorPreferencial : 0)
      .input('ativo', sql.Bit, ativo !== undefined ? ativo : 1)
      .query(`
        UPDATE [rg].[ArtigosFornecedores] 
        SET ReferenciaFornecedor = @ref, PrecoCompra = @preco, PrazoEntregaDias = @prazo, FornecedorPreferencial = @pref, Ativo = @ativo, DataAtualizacao = SYSDATETIME()
        WHERE ArtigoFornecedorID = @id
      `);

    res.json({ success: true, id: parseInt(id) });
  } catch (err) {
    console.error('Erro ao atualizar fornecedor do artigo:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE soft delete
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE [rg].[ArtigosFornecedores] 
        SET Ativo = 0, DataAtualizacao = SYSDATETIME()
        WHERE ArtigoFornecedorID = @id
      `);
      
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Registo não encontrado' });
    
    res.json({ message: 'Apagado com sucesso (soft delete)' });
  } catch (err) {
    console.error('Erro ao apagar fornecedor do artigo:', err);
    res.status(500).json({ error: 'Erro interno ao apagar' });
  }
});

module.exports = router;
