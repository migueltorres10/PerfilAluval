const express = require('express');
const { sql, getPool } = require('../db/sql');

const router = express.Router();

// GET ALL Obras with Joins
router.get('/', async (req, res) => {
  try {
    const listAll = req.query.all ? true : false;
    const pool = await getPool();
    let query = `
      SELECT 
        O.ObraID as id,
        O.Codigo as codigo,
        O.Referencia as referencia,
        O.Nome as nome,
        O.DataPedido as dataPedido,
        O.ValorOrcamentado as valorOrcamentado,
        O.ValorAdjudicado as valorAdjudicado,
        O.PercentagemConclusao as percentagemConclusao,
        O.OrcamentoEntregue as orcamentoEntregue,
        O.Ativo as ativo,
        C.Nome as clienteNome,
        E.Nome as estadoNome,
        T.Nome as tipoNome
      FROM [rg].[Obras] O
      INNER JOIN [rg].[Clientes] C ON O.ClienteID = C.ClienteID
      INNER JOIN [rg].[ObrasEstados] E ON O.ObraEstadoID = E.ObraEstadoID
      LEFT JOIN [rg].[ObrasTipos] T ON O.ObraTipoID = T.ObraTipoID
    `;
    if (!listAll) query += ` WHERE O.Ativo = 1 `;
    query += ` ORDER BY O.ObraID DESC`;

    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Erro ao listar obras:', err);
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
          O.ObraID as id,
          O.Codigo as codigo,
          O.Referencia as referencia,
          O.Nome as nome,
          O.Descricao as descricao,
          O.ClienteID as clienteId,
          O.ObraTipoID as obraTipoId,
          O.ObraEstadoID as obraEstadoId,
          O.Morada as morada,
          O.CodigoPostal as codigoPostal,
          O.Localidade as localidade,
          O.Distrito as distrito,
          O.Pais as pais,
          O.DataPedido as dataPedido,
          O.DataOrcamento as dataOrcamento,
          O.DataAdjudicacao as dataAdjudicacao,
          O.DataInicioPrevista as dataInicioPrevista,
          O.DataFimPrevista as dataFimPrevista,
          O.DataInicioReal as dataInicioReal,
          O.DataFimReal as dataFimReal,
          O.ValorOrcamentado as valorOrcamentado,
          O.ValorAdjudicado as valorAdjudicado,
          O.PercentagemConclusao as percentagemConclusao,
          O.ValorMaxDesc as valorMaxDesc,
          O.OrcamentoEntregue as orcamentoEntregue,
          O.Observacoes as observacoes,
          O.Ativo as ativo,
          O.DataCriacao as dataCriacao,
          O.DataAtualizacao as dataAtualizacao
        FROM [rg].[Obras] O
        WHERE O.ObraID = @id
      `);

    if (result.recordset.length === 0) return res.status(404).json({ error: 'Obra não encontrada' });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Erro ao obter obra:', err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const b = req.body;
    
    if (!b.codigo || !b.nome || !b.clienteId || !b.obraEstadoId) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta (código, nome, cliente e estado).' });
    }

    const pool = await getPool();
    const result = await pool.request()
        .input('codigo', sql.NVarChar, b.codigo)
        .input('referencia', sql.NVarChar, b.referencia || null)
        .input('nome', sql.NVarChar, b.nome)
        .input('descricao', sql.NVarChar, b.descricao || null)
        .input('clienteId', sql.Int, b.clienteId)
        .input('tipoId', sql.Int, b.obraTipoId || null)
        .input('estadoId', sql.Int, b.obraEstadoId)
        .input('morada', sql.NVarChar, b.morada || null)
        .input('cp', sql.NVarChar, b.codigoPostal || null)
        .input('localidade', sql.NVarChar, b.localidade || null)
        .input('distrito', sql.NVarChar, b.distrito || null)
        .input('pais', sql.NVarChar, b.pais || null)
        .input('dPedido', sql.Date, b.dataPedido || null)
        .input('dOrcamento', sql.Date, b.dataOrcamento || null)
        .input('dAdjudicacao', sql.Date, b.dataAdjudicacao || null)
        .input('dInicioP', sql.Date, b.dataInicioPrevista || null)
        .input('dFimP', sql.Date, b.dataFimPrevista || null)
        .input('dInicioR', sql.Date, b.dataInicioReal || null)
        .input('dFimR', sql.Date, b.dataFimReal || null)
        .input('vOrcamentado', sql.Decimal(18,2), b.valorOrcamentado || null)
        .input('vAdjudicado', sql.Decimal(18,2), b.valorAdjudicado || null)
        .input('percentagem', sql.Decimal(5,2), b.percentagemConclusao || 0)
        .input('vMaxDesc', sql.Decimal(18,2), b.valorMaxDesc || null)
        .input('oEntregue', sql.Bit, b.orcamentoEntregue ? 1 : 0)
        .input('observacoes', sql.NVarChar, b.observacoes || null)
        .query(`
          INSERT INTO [rg].[Obras] (
            Codigo, Referencia, Nome, Descricao, ClienteID, ObraTipoID, ObraEstadoID,
            Morada, CodigoPostal, Localidade, Distrito, Pais,
            DataPedido, DataOrcamento, DataAdjudicacao, DataInicioPrevista, DataFimPrevista, DataInicioReal, DataFimReal,
            ValorOrcamentado, ValorAdjudicado, PercentagemConclusao, ValorMaxDesc, OrcamentoEntregue, Observacoes
          )
          OUTPUT INSERTED.ObraID as id
          VALUES (
            @codigo, @referencia, @nome, @descricao, @clienteId, @tipoId, @estadoId,
            @morada, @cp, @localidade, @distrito, @pais,
            @dPedido, @dOrcamento, @dAdjudicacao, @dInicioP, @dFimP, @dInicioR, @dFimR,
            @vOrcamentado, @vAdjudicado, @percentagem, @vMaxDesc, @oEntregue, @observacoes
          )
        `);
    
    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    if (err.number === 2627) return res.status(400).json({ error: 'Já existe uma obra com este Código' });
    if (err.number === 547) return res.status(400).json({ error: 'Cliente, Tipo ou Estado associado tem valor inválido.' });
    if (err.number === 547 && err.message.includes('CK_Obras_PercentagemConclusao')) return res.status(400).json({ error: 'A percentagem deve estar entre 0 e 100.' });
    console.error('Erro ao criar obra:', err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const b = req.body;

    if (!b.codigo || !b.nome || !b.clienteId || !b.obraEstadoId) {
      return res.status(400).json({ error: 'Campos obrigatórios em falta (código, nome, cliente e estado).' });
    }

    const pool = await getPool();
    const check = await pool.request().input('id', sql.Int, id).query('SELECT 1 FROM [rg].[Obras] WHERE ObraID = @id');
    if (check.recordset.length === 0) return res.status(404).json({ error: 'Obra não encontrada' });

    await pool.request()
        .input('id', sql.Int, id)
        .input('codigo', sql.NVarChar, b.codigo)
        .input('referencia', sql.NVarChar, b.referencia || null)
        .input('nome', sql.NVarChar, b.nome)
        .input('descricao', sql.NVarChar, b.descricao || null)
        .input('clienteId', sql.Int, b.clienteId)
        .input('tipoId', sql.Int, b.obraTipoId || null)
        .input('estadoId', sql.Int, b.obraEstadoId)
        .input('morada', sql.NVarChar, b.morada || null)
        .input('cp', sql.NVarChar, b.codigoPostal || null)
        .input('localidade', sql.NVarChar, b.localidade || null)
        .input('distrito', sql.NVarChar, b.distrito || null)
        .input('pais', sql.NVarChar, b.pais || null)
        .input('dPedido', sql.Date, b.dataPedido || null)
        .input('dOrcamento', sql.Date, b.dataOrcamento || null)
        .input('dAdjudicacao', sql.Date, b.dataAdjudicacao || null)
        .input('dInicioP', sql.Date, b.dataInicioPrevista || null)
        .input('dFimP', sql.Date, b.dataFimPrevista || null)
        .input('dInicioR', sql.Date, b.dataInicioReal || null)
        .input('dFimR', sql.Date, b.dataFimReal || null)
        .input('vOrcamentado', sql.Decimal(18,2), b.valorOrcamentado || null)
        .input('vAdjudicado', sql.Decimal(18,2), b.valorAdjudicado || null)
        .input('percentagem', sql.Decimal(5,2), b.percentagemConclusao || 0)
        .input('vMaxDesc', sql.Decimal(18,2), b.valorMaxDesc || null)
        .input('oEntregue', sql.Bit, b.orcamentoEntregue ? 1 : 0)
        .input('observacoes', sql.NVarChar, b.observacoes || null)
        .query(`
          UPDATE [rg].[Obras] SET 
            Codigo=@codigo, Referencia=@referencia, Nome=@nome, Descricao=@descricao, ClienteID=@clienteId, ObraTipoID=@tipoId, ObraEstadoID=@estadoId,
            Morada=@morada, CodigoPostal=@cp, Localidade=@localidade, Distrito=@distrito, Pais=@pais,
            DataPedido=@dPedido, DataOrcamento=@dOrcamento, DataAdjudicacao=@dAdjudicacao, DataInicioPrevista=@dInicioP, DataFimPrevista=@dFimP, DataInicioReal=@dInicioR, DataFimReal=@dFimR,
            ValorOrcamentado=@vOrcamentado, ValorAdjudicado=@vAdjudicado, PercentagemConclusao=@percentagem, ValorMaxDesc=@vMaxDesc, OrcamentoEntregue=@oEntregue, Observacoes=@observacoes, DataAtualizacao=SYSDATETIME()
          WHERE ObraID = @id
        `);
    
    res.json({ success: true, id: parseInt(id) });
  } catch (err) {
    if (err.number === 2627) return res.status(400).json({ error: 'Já existe uma obra com este Código' });
    if (err.number === 547) return res.status(400).json({ error: 'Cliente, Tipo ou Estado associado tem valor inválido.' });
    if (err.number === 547 && err.message.includes('CK_Obras_PercentagemConclusao')) return res.status(400).json({ error: 'A percentagem deve estar entre 0 e 100.' });
    console.error('Erro ao atualizar obra:', err);
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
      .query(`UPDATE [rg].[Obras] SET Ativo = 0, DataAtualizacao = SYSDATETIME() WHERE ObraID = @id`);
      
    if (result.rowsAffected[0] === 0) return res.status(404).json({ error: 'Obra não encontrada' });
    
    res.json({ message: 'Apagada com sucesso (soft delete)' });
  } catch (err) {
    console.error('Erro ao apagar obra:', err);
    res.status(500).json({ error: 'Erro interno ao apagar' });
  }
});

module.exports = router;
