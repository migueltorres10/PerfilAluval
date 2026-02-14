const express = require("express");
const router = express.Router();

const { sql, getPool } = require("../db/sql");

const { s, validateNif, validateEmail, isValidId } = require("../utils/validation");

function validateFornecedor(payload) {
  const errors = {};

  const nome = s(payload.nome);
  const paisId = Number(payload.paisId);

  if (!nome) errors.nome = "Nome é obrigatório.";
  if (!isValidId(paisId)) errors.paisId = "PaisID inválido.";

  const nif = s(payload.nif);
  const nifError = validateNif(nif);
  if (nifError) errors.nif = nifError;

  const email = s(payload.email);
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  return { ok: Object.keys(errors).length === 0, errors };
}

// POST criar Fornecedor
router.post("/", async (req, res) => {
  const v = validateFornecedor(req.body);
  if (!v.ok) return res.status(400).json({ errors: v.errors });

  try {
    const pool = await getPool();

    const payload = {
      nome: s(req.body.nome),
      nomeComercial: s(req.body.nomeComercial),
      nif: s(req.body.nif),
      paisId: Number(req.body.paisId),
      email: s(req.body.email),
      telefone: s(req.body.telefone),
      telemovel: s(req.body.telemovel),
      codDistrito: s(req.body.codDistrito),
      codConcelho: s(req.body.codConcelho),
      nomeLocalidade: s(req.body.nomeLocalidade),
      numCodPostal: s(req.body.numCodPostal),
      extCodPostal: s(req.body.extCodPostal),
      moradaLinha1: s(req.body.moradaLinha1),
      moradaLinha2: s(req.body.moradaLinha2),
      observacoes: req.body.observacoes ?? null,
    };

    const r = await pool.request()
      .input("Nome", sql.NVarChar(200), payload.nome)
      .input("NomeComercial", sql.NVarChar(200), payload.nomeComercial)
      .input("NIF", sql.NVarChar(20), payload.nif)
      .input("PaisID", sql.Int, payload.paisId)
      .input("Email", sql.NVarChar(150), payload.email)
      .input("Telefone", sql.NVarChar(30), payload.telefone)
      .input("Telemovel", sql.NVarChar(30), payload.telemovel)
      .input("CodDistrito", sql.Char(2), payload.codDistrito)
      .input("CodConcelho", sql.Char(2), payload.codConcelho)
      .input("NomeLocalidade", sql.NVarChar(150), payload.nomeLocalidade)
      .input("NumCodPostal", sql.Char(4), payload.numCodPostal)
      .input("ExtCodPostal", sql.Char(3), payload.extCodPostal)
      .input("MoradaLinha1", sql.NVarChar(250), payload.moradaLinha1)
      .input("MoradaLinha2", sql.NVarChar(250), payload.moradaLinha2)
      .input("Observacoes", sql.NVarChar(sql.MAX), payload.observacoes)
      .input("Ativo", sql.Bit, 1)
      .query(`
      INSERT INTO rg.Fornecedores
        (Nome, NomeComercial, NIF, PaisID, Email, Telefone, Telemovel,
        CodDistrito, CodConcelho, NomeLocalidade, NumCodPostal, ExtCodPostal,
        MoradaLinha1, MoradaLinha2, Observacoes, Ativo, DataCriacao)
      OUTPUT INSERTED.FornecedorID
      VALUES
        (@Nome, @NomeComercial, @NIF, @PaisID, @Email, @Telefone, @Telemovel,
        @CodDistrito, @CodConcelho, @NomeLocalidade, @NumCodPostal, @ExtCodPostal,
        @MoradaLinha1, @MoradaLinha2, @Observacoes, @Ativo, SYSDATETIME())
    `);

    res.status(201).json({ id: r.recordset[0].FornecedorID });
  } catch (e) {
    res.status(500).json({ error: "Erro ao criar Fornecedor", detail: e.message });
  }
});

// PUT editar Fornecedor
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) return res.status(400).json({ error: "Id inválido" });

  const v = validateFornecedor(req.body);
  if (!v.ok) return res.status(400).json({ errors: v.errors });

  try {
    const pool = await getPool();

    const payload = {
      nome: s(req.body.nome),
      nomeComercial: s(req.body.nomeComercial),
      nif: s(req.body.nif),
      paisId: Number(req.body.paisId),
      email: s(req.body.email),
      telefone: s(req.body.telefone),
      telemovel: s(req.body.telemovel),
      codDistrito: s(req.body.codDistrito),
      codConcelho: s(req.body.codConcelho),
      nomeLocalidade: s(req.body.nomeLocalidade),
      numCodPostal: s(req.body.numCodPostal),
      extCodPostal: s(req.body.extCodPostal),
      moradaLinha1: s(req.body.moradaLinha1),
      moradaLinha2: s(req.body.moradaLinha2),
      observacoes: req.body.observacoes ?? null,
    };

    const r = await pool.request()
      .input("id", sql.Int, id)
      .input("Nome", sql.NVarChar(200), payload.nome)
      .input("NomeComercial", sql.NVarChar(200), payload.nomeComercial)
      .input("NIF", sql.NVarChar(20), payload.nif)
      .input("PaisID", sql.Int, payload.paisId)
      .input("Email", sql.NVarChar(150), payload.email)
      .input("Telefone", sql.NVarChar(30), payload.telefone)
      .input("Telemovel", sql.NVarChar(30), payload.telemovel)
      .input("CodDistrito", sql.Char(2), payload.codDistrito)
      .input("CodConcelho", sql.Char(2), payload.codConcelho)
      .input("NomeLocalidade", sql.NVarChar(150), payload.nomeLocalidade)
      .input("NumCodPostal", sql.Char(4), payload.numCodPostal)
      .input("ExtCodPostal", sql.Char(3), payload.extCodPostal)
      .input("MoradaLinha1", sql.NVarChar(250), payload.moradaLinha1)
      .input("MoradaLinha2", sql.NVarChar(250), payload.moradaLinha2)
      .input("Observacoes", sql.NVarChar(sql.MAX), payload.observacoes)
      .query(`
        UPDATE rg.Fornecedores SET
          Nome=@Nome,
          NomeComercial=@NomeComercial,
          NIF=@NIF,
          PaisID=@PaisID,
          Email=@Email,
          Telefone=@Telefone,
          Telemovel=@Telemovel,
          CodDistrito=@CodDistrito,
          CodConcelho=@CodConcelho,
          NomeLocalidade=@NomeLocalidade,
          NumCodPostal=@NumCodPostal,
          ExtCodPostal=@ExtCodPostal,
          MoradaLinha1=@MoradaLinha1,
          MoradaLinha2=@MoradaLinha2,
          Observacoes=@Observacoes,
          DataAtualizacao = GETDATE()
        WHERE FornecedorID=@ID;

        SELECT @@ROWCOUNT AS affected;
      `);

    if (!r.recordset?.[0]?.affected) return res.status(404).json({ error: "Fornecedor não encontrado" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao editar Fornecedor", detail: e.message });
  }
});

// DELETE (soft delete) Fornecedor
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) return res.status(400).json({ error: "Id inválido" });

  try {
    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE rg.Fornecedores
        SET Ativo = 0, DataAtualizacao = GETDATE()
        WHERE FornecedorID = @id;

        SELECT @@ROWCOUNT AS affected;
      `);

    if (!r.recordset?.[0]?.affected) return res.status(404).json({ error: "Fornecedor não encontrado" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao eliminar Fornecedor", detail: e.message });
  }
});

// GET /api/Fornecedores/stats? q=...
router.get("/stats", async (req, res) => {
  try {
    const pool = await getPool();

    const q = String(req.query.q ?? "").trim();
    if (q.length > 200) {
      return res.status(400).json({ error: "Parâmetro 'q' demasiado longo (máx 200 caracteres)." });
    }

    let where = "1=1";
    const hasQ = q.length > 0;
    if (hasQ) {
      where += ` AND (
        Nome LIKE @q OR
        NIF LIKE @q OR
        NomeLocalidade LIKE @q
      )`;
    }

    const r = await pool
      .request()
      .input("q", sql.NVarChar(200), hasQ ? `%${q}%` : null)
      .query(`
        SELECT
          SUM(CASE WHEN Ativo = 1 THEN 1 ELSE 0 END) AS Ativos,
          SUM(CASE WHEN Ativo = 0 THEN 1 ELSE 0 END) AS Inativos,
          COUNT(1) AS Total
        FROM rg.Fornecedores
        WHERE ${where};
      `);

    res.json(r.recordset[0] || { Ativos: 0, Inativos: 0, Total: 0 });
  } catch (e) {
    res.status(500).json({ error: "Erro ao obter stats de Fornecedores", detail: e.message });
  }
});

// GET lista de Fornecedores
// status=active|inactive|all
// q=pesquisa
// orderBy=FornecedorID|Nome|NIF|NomeLocalidade|DataCriacao|DataAtualizacao
// orderDir=asc|desc
// page=1..n  (opcional)
// pageSize=1..200 (opcional)
router.get("/", async (req, res) => {
  try {
    const pool = await getPool();

    // ---- status (validação) ----
    const statusRaw = String(req.query.status ?? "active").toLowerCase();
    const allowedStatus = new Set(["active", "inactive", "all"]);
    if (!allowedStatus.has(statusRaw)) {
      return res.status(400).json({ error: "Parâmetro 'status' inválido. Use: active | inactive | all." });
    }

    // ---- q (sanitização simples) ----
    const q = String(req.query.q ?? "").trim();
    if (q.length > 200) {
      return res.status(400).json({ error: "Parâmetro 'q' demasiado longo (máx 200 caracteres)." });
    }

    // ---- ordenação (whitelist) ----
    const orderByRaw = String(req.query.orderBy ?? "FornecedorID");
    const orderDirRaw = String(req.query.orderDir ?? "desc").toLowerCase();

    const orderByMap = {
      FornecedorID: "FornecedorID",
      Nome: "Nome",
      NIF: "NIF",
      NomeLocalidade: "NomeLocalidade",
      DataCriacao: "DataCriacao",
      DataAtualizacao: "DataAtualizacao",
      Ativo: "Ativo",
    };

    const orderBy = orderByMap[orderByRaw] || orderByMap.FornecedorID;
    const orderDir = orderDirRaw === "asc" ? "ASC" : "DESC";

    // ---- paginação (opcional) ----
    const hasPaging = req.query.page !== undefined || req.query.pageSize !== undefined;

    let page = Number(req.query.page ?? 1);
    let pageSize = Number(req.query.pageSize ?? 50);

    if (!Number.isFinite(page) || page < 1) page = 1;
    if (!Number.isFinite(pageSize) || pageSize < 1) pageSize = 50;
    if (pageSize > 200) pageSize = 200;

    const offset = (page - 1) * pageSize;

    // ---- WHERE ----
    let where = "1=1";
    if (statusRaw === "active") where += " AND Ativo = 1";
    else if (statusRaw === "inactive") where += " AND Ativo = 0";
    // all -> sem filtro

    const hasQ = q.length > 0;
    if (hasQ) {
      where += ` AND (
        Nome LIKE @q OR
        NIF LIKE @q OR
        NomeLocalidade LIKE @q
      )`;
    }

    const request = pool.request().input("q", sql.NVarChar(200), hasQ ? `%${q}%` : null);

    if (!hasPaging) {
      // ✅ compatível com o frontend atual: devolve array
      const r = await request.query(`
        SELECT
          FornecedorID,
          Nome,
          NIF,
          NomeLocalidade,
          Email,
          Telefone,
          Telemovel,
          Ativo,
          DataCriacao,
          DataAtualizacao
        FROM rg.Fornecedores
        WHERE ${where}
        ORDER BY ${orderBy} ${orderDir}
      `);

      return res.json(r.recordset);
    }

    // ✅ paginado: devolve { items, total, page, pageSize }
    request.input("offset", sql.Int, offset).input("pageSize", sql.Int, pageSize);

    const r = await request.query(`
      SELECT COUNT(1) AS Total
      FROM rg.Fornecedores
      WHERE ${where};

      SELECT
        FornecedorID,
        Nome,
        NIF,
        NomeLocalidade,
        Email,
        Telefone,
        Telemovel,
        Ativo,
        DataCriacao,
        DataAtualizacao
      FROM rg.Fornecedores
      WHERE ${where}
      ORDER BY ${orderBy} ${orderDir}
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY;
    `);

    const total = r.recordsets?.[0]?.[0]?.Total ?? 0;
    const items = r.recordsets?.[1] ?? [];

    return res.json({ items, total, page, pageSize });
  } catch (e) {
    res.status(500).json({ error: "Erro ao listar Fornecedores", detail: e.message });
  }
});


// GET Fornecedor por ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return res.status(400).json({ error: "Id inválido" });
    }

    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT
          FornecedorID,
          Nome,
          NomeComercial,
          NIF,
          PaisID,
          Email,
          Telefone,
          Telemovel,
          CodDistrito,
          CodConcelho,
          NomeLocalidade,
          NumCodPostal,
          ExtCodPostal,
          MoradaLinha1,
          MoradaLinha2,
          Observacoes,
          Ativo,
          DataCriacao,
          DataAtualizacao
        FROM rg.Fornecedores
        WHERE FornecedorID = @id
      `);

    if (!r.recordset.length) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    res.json(r.recordset[0]);
  } catch (e) {
    res.status(500).json({
      error: "Erro ao obter Fornecedor",
      detail: e.message,
    });
  }
});

// PATCH reativar Fornecedor
router.patch("/:id/reativar", async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) return res.status(400).json({ error: "Id inválido" });

  try {
    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE rg.Fornecedores
        SET Ativo = 1, DataAtualizacao = GETDATE()
        WHERE FornecedorID = @id;

        SELECT @@ROWCOUNT AS affected;
      `);

    if (!r.recordset?.[0]?.affected) return res.status(404).json({ error: "Fornecedor não encontrado" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao reativar Fornecedor", detail: e.message });
  }
});



module.exports = router;
