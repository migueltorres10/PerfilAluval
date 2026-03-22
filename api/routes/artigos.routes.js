const express = require('express');
const { sql, getPool } = require('../db/sql');

const router = express.Router();

// GET ALL Artigos with Joins
router.get('/', async (req, res) => {
  try {
    const listAll = req.query.all ? true : false;
    const pool = await getPool();
    let query = `
      SELECT 
        A.ArtigoID as id,
        A.Codigo as codigo,
        A.ReferenciaInterna as referencia,
        A.Nome as nome,
        A.Descricao as descricao,
        A.TipoArtigo as tipoArtigo,
        A.TipoRegisto as tipoRegisto,
        A.StockAtual as stockAtual,
        A.PrecoCompra as precoCompra,
        A.PrecoVenda as precoVenda,
        A.Ativo as ativo,
        U.Nome as unidadeNome,
        F.Nome as familiaNome
      FROM [rg].[Artigos] A
      INNER JOIN [rg].[ArtigoUnidades] U ON A.UnidadeID = U.UnidadeID
      LEFT JOIN [rg].[ArtigoFamilias] F ON A.ArtigoFamiliaID = F.ArtigoFamiliaID
    `;
    if (!listAll) query += ` WHERE A.Ativo = 1 `;
    query += ` ORDER BY A.Nome ASC`;

    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao listar artigos:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        SELECT 
          A.ArtigoID as id,
          A.Codigo as codigo,
          A.ReferenciaInterna as referencia,
          A.Nome as nome,
          A.Descricao as descricao,
          A.TipoArtigo as tipoArtigo,
          A.TipoRegisto as tipoRegisto,
          A.ArtigoFamiliaID as artigoFamiliaId,
          A.UnidadeID as unidadeId,
          A.ControlaStock as controlaStock,
          A.StockAtual as stockAtual,
          A.StockMinimo as stockMinimo,
          A.StockMaximo as stockMaximo,
          A.PrecoCompra as precoCompra,
          A.PrecoVenda as precoVenda,
          A.MargemPercentual as margemPercentual,
          A.TemDimensoes as temDimensoes,
          A.Comprimento as comprimento,
          A.Largura as largura,
          A.Altura as altura,
          A.Espessura as espessura,
          A.PesoUnitario as pesoUnitario,
          A.Cor as cor,
          A.Acabamento as acabamento,
          A.Material as material,
          A.PermiteProducao as permiteProducao,
          A.Ativo as ativo,
          A.DataCriacao as dataCriacao,
          A.DataAtualizacao as dataAtualizacao
        FROM [rg].[Artigos] A
        WHERE A.ArtigoID = @id
      `);

    if (result.recordset.length === 0) return res.status(404).json({ error: 'Artigo não encontrado' });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao obter artigo:', err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const b = req.body;
    
    if (!b.codigo || !b.nome || !b.tipoArtigo || !b.tipoRegisto || !b.unidadeId) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta (código, nome, tipos e unidade).' });
    }

    const pool = await getPool();
    const result = await pool.request()
        .input('codigo', sql.NVarChar, b.codigo)
        .input('refInterna', sql.NVarChar, b.referencia || null)
        .input('nome', sql.NVarChar, b.nome)
        .input('descricao', sql.NVarChar, b.descricao || null)
        .input('tipoArtigo', sql.Char(1), b.tipoArtigo)
        .input('tipoRegisto', sql.Char(1), b.tipoRegisto)
        .input('familiaId', sql.Int, b.artigoFamiliaId || null)
        .input('unidadeId', sql.Int, b.unidadeId)
        .input('controlaStock', sql.Bit, b.controlaStock !== undefined ? b.controlaStock : 1)
        .input('stockAtual', sql.Decimal(18,3), b.stockAtual || 0)
        .input('stockMinimo', sql.Decimal(18,3), b.stockMinimo || 0)
        .input('stockMaximo', sql.Decimal(18,3), b.stockMaximo || null)
        .input('precoCompra', sql.Decimal(18,4), b.precoCompra || null)
        .input('precoVenda', sql.Decimal(18,4), b.precoVenda || null)
        .input('margem', sql.Decimal(9,2), b.margemPercentual || null)
        .input('temDimensoes', sql.Bit, b.temDimensoes !== undefined ? b.temDimensoes : 0)
        .input('comprimento', sql.Decimal(18,3), b.comprimento || null)
        .input('largura', sql.Decimal(18,3), b.largura || null)
        .input('altura', sql.Decimal(18,3), b.altura || null)
        .input('espessura', sql.Decimal(18,3), b.espessura || null)
        .input('peso', sql.Decimal(18,3), b.pesoUnitario || null)
        .input('cor', sql.NVarChar, b.cor || null)
        .input('acabamento', sql.NVarChar, b.acabamento || null)
        .input('material', sql.NVarChar, b.material || null)
        .input('permiteProducao', sql.Bit, b.permiteProducao !== undefined ? b.permiteProducao : 0)
        .query(`
          INSERT INTO [rg].[Artigos] (
            Codigo, ReferenciaInterna, Nome, Descricao, TipoArtigo, TipoRegisto,
            ArtigoFamiliaID, UnidadeID, ControlaStock, StockAtual, StockMinimo, StockMaximo,
            PrecoCompra, PrecoVenda, MargemPercentual, TemDimensoes, Comprimento, Largura, Altura,
            Espessura, PesoUnitario, Cor, Acabamento, Material, PermiteProducao
          )
          OUTPUT INSERTED.ArtigoID as id
          VALUES (
            @codigo, @refInterna, @nome, @descricao, @tipoArtigo, @tipoRegisto,
            @familiaId, @unidadeId, @controlaStock, @stockAtual, @stockMinimo, @stockMaximo,
            @precoCompra, @precoVenda, @margem, @temDimensoes, @comprimento, @largura, @altura,
            @espessura, @peso, @cor, @acabamento, @material, @permiteProducao
          )
        `);
    
    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    if (err.number === 2627) return res.status(400).json({ error: 'Já existe um artigo com este Código' });
    if (err.number === 547) return res.status(400).json({ error: 'Família ou Unidade associada não existe.' });
    console.error('Erro ao criar artigo:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const b = req.body;

    if (!b.codigo || !b.nome || !b.tipoArtigo || !b.tipoRegisto || !b.unidadeId) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta (código, nome, tipos e unidade).' });
    }

    const pool = await getPool();
    const check = await pool.request().input('id', sql.Int, id).query('SELECT 1 FROM [rg].[Artigos] WHERE ArtigoID = @id');
    if (check.recordset.length === 0) return res.status(404).json({ error: 'Artigo não encontrado' });

    await pool.request()
      .input('id', sql.Int, id)
      .input('codigo', sql.NVarChar, b.codigo)
      .input('refInterna', sql.NVarChar, b.referencia || null)
      .input('nome', sql.NVarChar, b.nome)
      .input('descricao', sql.NVarChar, b.descricao || null)
      .input('tipoArtigo', sql.Char(1), b.tipoArtigo)
      .input('tipoRegisto', sql.Char(1), b.tipoRegisto)
      .input('familiaId', sql.Int, b.artigoFamiliaId || null)
      .input('unidadeId', sql.Int, b.unidadeId)
      .input('controlaStock', sql.Bit, b.controlaStock !== undefined ? b.controlaStock : 1)
      .input('stockAtual', sql.Decimal(18,3), b.stockAtual || 0)
      .input('stockMinimo', sql.Decimal(18,3), b.stockMinimo || 0)
      .input('stockMaximo', sql.Decimal(18,3), b.stockMaximo || null)
      .input('precoCompra', sql.Decimal(18,4), b.precoCompra || null)
      .input('precoVenda', sql.Decimal(18,4), b.precoVenda || null)
      .input('margem', sql.Decimal(9,2), b.margemPercentual || null)
      .input('temDimensoes', sql.Bit, b.temDimensoes !== undefined ? b.temDimensoes : 0)
      .input('comprimento', sql.Decimal(18,3), b.comprimento || null)
      .input('largura', sql.Decimal(18,3), b.largura || null)
      .input('altura', sql.Decimal(18,3), b.altura || null)
      .input('espessura', sql.Decimal(18,3), b.espessura || null)
      .input('peso', sql.Decimal(18,3), b.pesoUnitario || null)
      .input('cor', sql.NVarChar, b.cor || null)
      .input('acabamento', sql.NVarChar, b.acabamento || null)
      .input('material', sql.NVarChar, b.material || null)
      .input('permiteProducao', sql.Bit, b.permiteProducao !== undefined ? b.permiteProducao : 0)
      .query(`
        UPDATE [rg].[Artigos] SET 
          Codigo=@codigo, ReferenciaInterna=@refInterna, Nome=@nome, Descricao=@descricao, TipoArtigo=@tipoArtigo,
          TipoRegisto=@tipoRegisto, ArtigoFamiliaID=@familiaId, UnidadeID=@unidadeId, ControlaStock=@controlaStock,
          StockAtual=@stockAtual, StockMinimo=@stockMinimo, StockMaximo=@stockMaximo, PrecoCompra=@precoCompra,
          PrecoVenda=@precoVenda, MargemPercentual=@margem, TemDimensoes=@temDimensoes, Comprimento=@comprimento,
          Largura=@largura, Altura=@altura, Espessura=@espessura, PesoUnitario=@peso, Cor=@cor, Acabamento=@acabamento,
          Material=@material, PermiteProducao=@permiteProducao, DataAtualizacao=SYSDATETIME()
        WHERE ArtigoID = @id
      `);

    res.json({ success: true, id: parseInt(id) });
  } catch (err) {
    console.error('Erro ao atualizar artigo:', err);
    if (err.number === 2627) return res.status(400).json({ error: 'Já existe um artigo com este Código' });
    if (err.number === 547) return res.status(400).json({ error: 'Família ou Unidade associada não existe.' });
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`UPDATE [rg].[Artigos] SET Ativo = 0, DataAtualizacao = SYSDATETIME() WHERE ArtigoID = @id`);
      
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Artigo não encontrado' });
    
    res.json({ message: 'Apagado com sucesso (soft delete)' });
  } catch (err) {
    console.error('Erro ao apagar artigo:', err);
    res.status(500).json({ error: 'Erro interno ao apagar' });
  }
});

module.exports = router;
