const express = require("express");
const router = express.Router();
const { sql, getPool } = require("../db/sql");
const { validateNif, validateEmail, isValidId, s } = require("../utils/validation");

function validateFuncionario(payload) {
  const errors = {};
  
  if (!s(payload.nome)) errors.nome = "Nome é obrigatório";
  if (!payload.paisId || !Number.isFinite(Number(payload.paisId))) {
    errors.paisId = "País é obrigatório";
  }

  const nifError = validateNif(s(payload.nif));
  if (nifError) errors.nif = nifError;

  const emailStr = s(payload.email);
  if (emailStr) {
    const emailError = validateEmail(emailStr);
    if (emailError) errors.email = emailError;
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

// GET /api/funcionarios
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT f.FuncionarioID as id, f.Nome as nome, f.Email as email, f.Telefone as telefone, f.Telemovel as telemovel,
             f.Ativo as ativo,
             f.DepartamentoID as departamentoId, d.Nome as departamentoNome,
             f.FuncaoID as funcaoId, func.Nome as funcaoNome
      FROM rg.Funcionarios f
      LEFT JOIN rg.Departamentos d ON f.DepartamentoID = d.DepartamentoID
      LEFT JOIN rg.Funcoes func ON f.FuncaoID = func.FuncaoID
      ORDER BY f.Nome
    `);
    res.json(r.recordset);
  } catch (e) {
    res.status(500).json({ error: "Erro ao listar funcionários", detail: e.message });
  }
});

// GET /api/funcionarios/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) return res.status(400).json({ error: "Id inválido" });

    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT
            FuncionarioID as id, Nome as nome, DataNascimento as dataNascimento, NIF as nif,
            NumeroSegurancaSocial as numeroSegurancaSocial, NumeroCartaoCidadao as numeroCartaoCidadao,
            Email as email, Telefone as telefone, Telemovel as telemovel,
            MoradaLinha1 as moradaLinha1, MoradaLinha2 as moradaLinha2, NomeLocalidade as nomeLocalidade,
            NumCodPostal as numCodPostal, ExtCodPostal as extCodPostal,
            CodDistrito as codDistrito, CodConcelho as codConcelho, PaisID as paisId,
            FuncaoID as funcaoId, DepartamentoID as departamentoId, TipoContratoID as tipoContratoId,
            DataAdmissao as dataAdmissao, DataSaida as dataSaida, SalarioBaseMensal as salarioBaseMensal,
            Ativo as ativo, Observacoes as observacoes
        FROM rg.Funcionarios
        WHERE FuncionarioID = @id
      `);

    if (r.recordset.length === 0) return res.status(404).json({ error: "Funcionário não encontrado" });
    res.json(r.recordset[0]);
  } catch (e) {
    res.status(500).json({ error: "Erro ao obter funcionário", detail: e.message });
  }
});

// POST /api/funcionarios
router.post("/", async (req, res) => {
  const v = validateFuncionario(req.body);
  if (!v.ok) return res.status(400).json({ errors: v.errors });

  try {
    const p = req.body;
    const pool = await getPool();
    const r = await pool.request()
      .input("Nome", sql.NVarChar(255), s(p.nome))
      .input("DataNascimento", sql.Date, p.dataNascimento ? new Date(p.dataNascimento) : null)
      .input("NIF", sql.NVarChar(20), s(p.nif))
      .input("NumeroSegurancaSocial", sql.NVarChar(50), s(p.numeroSegurancaSocial))
      .input("NumeroCartaoCidadao", sql.NVarChar(50), s(p.numeroCartaoCidadao))
      .input("Email", sql.NVarChar(255), s(p.email))
      .input("Telefone", sql.NVarChar(50), s(p.telefone))
      .input("Telemovel", sql.NVarChar(50), s(p.telemovel))
      .input("MoradaLinha1", sql.NVarChar(250), s(p.moradaLinha1))
      .input("MoradaLinha2", sql.NVarChar(250), s(p.moradaLinha2))
      .input("NomeLocalidade", sql.NVarChar(150), s(p.nomeLocalidade))
      .input("NumCodPostal", sql.Char(4), s(p.numCodPostal))
      .input("ExtCodPostal", sql.Char(3), s(p.extCodPostal))
      .input("CodDistrito", sql.Char(2), s(p.codDistrito))
      .input("CodConcelho", sql.Char(2), s(p.codConcelho))
      .input("PaisID", sql.Int, Number(p.paisId))
      .input("FuncaoID", sql.Int, p.funcaoId ? Number(p.funcaoId) : null)
      .input("DepartamentoID", sql.Int, p.departamentoId ? Number(p.departamentoId) : null)
      .input("TipoContratoID", sql.Int, p.tipoContratoId ? Number(p.tipoContratoId) : null)
      .input("DataAdmissao", sql.Date, p.dataAdmissao ? new Date(p.dataAdmissao) : null)
      .input("DataSaida", sql.Date, p.dataSaida ? new Date(p.dataSaida) : null)
      .input("SalarioBaseMensal", sql.Decimal(10,2), p.salarioBaseMensal ? Number(p.salarioBaseMensal) : null)
      .input("Observacoes", sql.NVarChar(sql.MAX), s(p.observacoes))
      .query(`
        INSERT INTO rg.Funcionarios
          (Nome, DataNascimento, NIF, NumeroSegurancaSocial, NumeroCartaoCidadao,
           Email, Telefone, Telemovel, MoradaLinha1, MoradaLinha2, NomeLocalidade,
           NumCodPostal, ExtCodPostal, CodDistrito, CodConcelho, PaisID,
           FuncaoID, DepartamentoID, TipoContratoID, DataAdmissao, DataSaida, SalarioBaseMensal, Observacoes)
        OUTPUT INSERTED.FuncionarioID
        VALUES
          (@Nome, @DataNascimento, @NIF, @NumeroSegurancaSocial, @NumeroCartaoCidadao,
           @Email, @Telefone, @Telemovel, @MoradaLinha1, @MoradaLinha2, @NomeLocalidade,
           @NumCodPostal, @ExtCodPostal, @CodDistrito, @CodConcelho, @PaisID,
           @FuncaoID, @DepartamentoID, @TipoContratoID, @DataAdmissao, @DataSaida, @SalarioBaseMensal, @Observacoes)
      `);

    res.status(201).json({ id: r.recordset[0].FuncionarioID });
  } catch (e) {
    if (e.message.includes("UQ_Funcionarios_NIF")) {
      return res.status(400).json({ error: "Já existe um funcionário com este NIF" });
    }
    res.status(500).json({ error: "Erro ao criar funcionário", detail: e.message });
  }
});

// PUT /api/funcionarios/:id
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) return res.status(400).json({ error: "Id inválido" });

  const v = validateFuncionario(req.body);
  if (!v.ok) return res.status(400).json({ errors: v.errors });

  try {
    const p = req.body;
    const pool = await getPool();
    await pool.request()
      .input("FuncionarioID", sql.Int, id)
      .input("Nome", sql.NVarChar(255), s(p.nome))
      .input("DataNascimento", sql.Date, p.dataNascimento ? new Date(p.dataNascimento) : null)
      .input("NIF", sql.NVarChar(20), s(p.nif))
      .input("NumeroSegurancaSocial", sql.NVarChar(50), s(p.numeroSegurancaSocial))
      .input("NumeroCartaoCidadao", sql.NVarChar(50), s(p.numeroCartaoCidadao))
      .input("Email", sql.NVarChar(255), s(p.email))
      .input("Telefone", sql.NVarChar(50), s(p.telefone))
      .input("Telemovel", sql.NVarChar(50), s(p.telemovel))
      .input("MoradaLinha1", sql.NVarChar(250), s(p.moradaLinha1))
      .input("MoradaLinha2", sql.NVarChar(250), s(p.moradaLinha2))
      .input("NomeLocalidade", sql.NVarChar(150), s(p.nomeLocalidade))
      .input("NumCodPostal", sql.Char(4), s(p.numCodPostal))
      .input("ExtCodPostal", sql.Char(3), s(p.extCodPostal))
      .input("CodDistrito", sql.Char(2), s(p.codDistrito))
      .input("CodConcelho", sql.Char(2), s(p.codConcelho))
      .input("PaisID", sql.Int, Number(p.paisId))
      .input("FuncaoID", sql.Int, p.funcaoId ? Number(p.funcaoId) : null)
      .input("DepartamentoID", sql.Int, p.departamentoId ? Number(p.departamentoId) : null)
      .input("TipoContratoID", sql.Int, p.tipoContratoId ? Number(p.tipoContratoId) : null)
      .input("DataAdmissao", sql.Date, p.dataAdmissao ? new Date(p.dataAdmissao) : null)
      .input("DataSaida", sql.Date, p.dataSaida ? new Date(p.dataSaida) : null)
      .input("SalarioBaseMensal", sql.Decimal(10,2), p.salarioBaseMensal ? Number(p.salarioBaseMensal) : null)
      .input("Ativo", sql.Bit, p.ativo !== undefined ? p.ativo : 1)
      .input("Observacoes", sql.NVarChar(sql.MAX), s(p.observacoes))
      .query(`
        UPDATE rg.Funcionarios
        SET Nome = @Nome, DataNascimento = @DataNascimento, NIF = @NIF,
            NumeroSegurancaSocial = @NumeroSegurancaSocial, NumeroCartaoCidadao = @NumeroCartaoCidadao,
            Email = @Email, Telefone = @Telefone, Telemovel = @Telemovel,
            MoradaLinha1 = @MoradaLinha1, MoradaLinha2 = @MoradaLinha2, NomeLocalidade = @NomeLocalidade,
            NumCodPostal = @NumCodPostal, ExtCodPostal = @ExtCodPostal,
            CodDistrito = @CodDistrito, CodConcelho = @CodConcelho, PaisID = @PaisID,
            FuncaoID = @FuncaoID, DepartamentoID = @DepartamentoID, TipoContratoID = @TipoContratoID,
            DataAdmissao = @DataAdmissao, DataSaida = @DataSaida, SalarioBaseMensal = @SalarioBaseMensal,
            Ativo = @Ativo, Observacoes = @Observacoes, DataAtualizacao = SYSDATETIME()
        WHERE FuncionarioID = @FuncionarioID
      `);

    res.json({ success: true });
  } catch (e) {
    if (e.message.includes("UQ_Funcionarios_NIF")) {
      return res.status(400).json({ error: "Já existe um funcionário com este NIF" });
    }
    res.status(500).json({ error: "Erro ao atualizar funcionário", detail: e.message });
  }
});

// DELETE /api/funcionarios/:id (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) return res.status(400).json({ error: "Id inválido" });

    const pool = await getPool();
    await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE rg.Funcionarios
        SET Ativo = 0, DataAtualizacao = SYSDATETIME()
        WHERE FuncionarioID = @id
      `);

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao inativar funcionário", detail: e.message });
  }
});

module.exports = router;
