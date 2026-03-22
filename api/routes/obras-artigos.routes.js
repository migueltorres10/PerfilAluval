const express = require('express');
const { sql, getPool } = require('../db/sql');

const router = express.Router();

// GET all lines for a specific Obra
router.get('/por-obra/:obraId', async (req, res) => {
  try {
    const obraId = req.params.obraId;
    const pool = await getPool();
    const result = await pool.request()
      .input('obraId', sql.Int, obraId)
      .query(`
        SELECT 
          OA.ObraArtigoID as id,
          OA.ObraID as obraId,
          OA.ArtigoID as artigoId,
          OA.TipoLinha as tipoLinha,
          OA.Descricao as descricao,
          OA.Quantidade as quantidade,
          OA.PrecoUnitarioCompra as precoUnitarioCompra,
          OA.PrecoUnitarioVenda as precoUnitarioVenda,
          OA.DescontoPercentual as descontoPercentual,
          OA.IvaPercentual as ivaPercentual,
          OA.Comprimento as comprimento,
          OA.Largura as largura,
          OA.Altura as altura,
          OA.Observacoes as observacoes,
          OA.Ordem as ordem,
          A.Codigo as artigoCodigo,
          A.Nome as artigoNome,
          U.Codigo as unidadeCodigo
        FROM [rg].[ObrasArtigos] OA
        INNER JOIN [rg].[Artigos] A ON OA.ArtigoID = A.ArtigoID
        INNER JOIN [rg].[ArtigoUnidades] U ON A.UnidadeID = U.UnidadeID
        WHERE OA.ObraID = @obraId
        ORDER BY OA.Ordem ASC, OA.ObraArtigoID ASC
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao listar artigos da obra:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST new line for an Obra
router.post('/', async (req, res) => {
  try {
    const b = req.body;
    
    if (!b.obraId || !b.artigoId || !b.tipoLinha || b.quantidade === undefined) {
      return res.status(400).json({ error: 'Obra, Artigo, Tipo de Linha e Quantidade são obrigatórios' });
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('obraId', sql.Int, b.obraId)
      .input('artigoId', sql.Int, b.artigoId)
      .input('tipoLinha', sql.Char(1), b.tipoLinha)
      .input('descricao', sql.NVarChar, b.descricao || null)
      .input('q', sql.Decimal(18,3), b.quantidade)
      .input('pC', sql.Decimal(18,4), b.precoUnitarioCompra || null)
      .input('pV', sql.Decimal(18,4), b.precoUnitarioVenda || null)
      .input('desc', sql.Decimal(9,2), b.descontoPercentual || 0)
      .input('iva', sql.Decimal(9,2), b.ivaPercentual || 0)
      .input('c', sql.Decimal(18,3), b.comprimento || null)
      .input('l', sql.Decimal(18,3), b.largura || null)
      .input('a', sql.Decimal(18,3), b.altura || null)
      .input('obs', sql.NVarChar, b.observacoes || null)
      .input('ordem', sql.Int, b.ordem || 0)
      .query(`
        INSERT INTO [rg].[ObrasArtigos] (
          ObraID, ArtigoID, TipoLinha, Descricao, Quantidade, PrecoUnitarioCompra, PrecoUnitarioVenda,
          DescontoPercentual, IvaPercentual, Comprimento, Largura, Altura, Observacoes, Ordem
        ) 
        OUTPUT INSERTED.ObraArtigoID as id
        VALUES (
          @obraId, @artigoId, @tipoLinha, @descricao, @q, @pC, @pV,
          @desc, @iva, @c, @l, @a, @obs, @ordem
        )
      `);

    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    console.error('Erro ao adicionar artigo à obra:', err);
    if (err.number === 547) return res.status(400).json({ error: 'A obra ou o artigo indicado são inválidos.' });
    if (err.number === 547 && err.message.includes('CK_ObrasArtigos_Quantidade')) return res.status(400).json({ error: 'A quantidade deve ser superior a zero.' });
    if (err.number === 547 && err.message.includes('CK_ObrasArtigos_TipoLinha')) return res.status(400).json({ error: 'O tipo de linha deve ser M, S ou P.' });
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT update line
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const b = req.body;

    const pool = await getPool();
    const check = await pool.request().input('id', sql.Int, id).query('SELECT 1 FROM [rg].[ObrasArtigos] WHERE ObraArtigoID = @id');
    if (check.recordset.length === 0) return res.status(404).json({ error: 'Linha não encontrada' });

    await pool.request()
      .input('id', sql.Int, id)
      .input('tipoLinha', sql.Char(1), b.tipoLinha)
      .input('descricao', sql.NVarChar, b.descricao || null)
      .input('q', sql.Decimal(18,3), b.quantidade)
      .input('pC', sql.Decimal(18,4), b.precoUnitarioCompra || null)
      .input('pV', sql.Decimal(18,4), b.precoUnitarioVenda || null)
      .input('desc', sql.Decimal(9,2), b.descontoPercentual || 0)
      .input('iva', sql.Decimal(9,2), b.ivaPercentual || 0)
      .input('c', sql.Decimal(18,3), b.comprimento || null)
      .input('l', sql.Decimal(18,3), b.largura || null)
      .input('a', sql.Decimal(18,3), b.altura || null)
      .input('obs', sql.NVarChar, b.observacoes || null)
      .input('ordem', sql.Int, b.ordem || 0)
      .query(`
        UPDATE [rg].[ObrasArtigos] SET 
          TipoLinha = @tipoLinha, Descricao = @descricao, Quantidade = @q, 
          PrecoUnitarioCompra = @pC, PrecoUnitarioVenda = @pV, DescontoPercentual = @desc, IvaPercentual = @iva, 
          Comprimento = @c, Largura = @l, Altura = @a, Observacoes = @obs, Ordem = @ordem, DataAtualizacao = SYSDATETIME()
        WHERE ObraArtigoID = @id
      `);

    res.json({ success: true, id: parseInt(id) });
  } catch (err) {
    if (err.number === 547 && err.message.includes('CK_ObrasArtigos_Quantidade')) return res.status(400).json({ error: 'A quantidade deve ser superior a zero.' });
    if (err.number === 547 && err.message.includes('CK_ObrasArtigos_TipoLinha')) return res.status(400).json({ error: 'O tipo de linha deve ser M, S ou P.' });
    console.error('Erro ao atualizar linha da obra:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM [rg].[ObrasArtigos] WHERE ObraArtigoID = @id`);
      
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Registo não encontrado' });
    
    // Hard delete since this is just a relational link table, typically they are fully deleted
    res.json({ message: 'Apagado com sucesso' });
  } catch (err) {
    console.error('Erro ao apagar linha da obra:', err);
    res.status(500).json({ error: 'Erro interno ao apagar' });
  }
});

module.exports = router;
