const express = require("express");
const router = express.Router();

const { sql, getPool } = require("../db/sql");

function s(v) {
  if (v === undefined || v === null) return null;
  const t = String(v).trim();
  return t.length ? t : null;
}

function validateCliente(payload) {
  const errors = {};

  const nome = s(payload.nome);
  const tipo = s(payload.tipoCliente);
  const paisId = Number(payload.paisId);

  if (!nome) errors.nome = "Nome é obrigatório.";
  if (!tipo || !["E", "P"].includes(tipo)) errors.tipoCliente = "TipoCliente deve ser 'E' ou 'P'.";
  if (!Number.isFinite(paisId) || paisId <= 0) errors.paisId = "PaisID inválido.";

const nif = s(payload.nif);

if (!nif) {
  errors.nif = "NIF é obrigatório.";
} else if (nif.length > 20) {
  errors.nif = "NIF não pode ter mais de 20 caracteres.";
}
  const email = s(payload.email);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Email inválido.";

  return { ok: Object.keys(errors).length === 0, errors };
}

// POST criar cliente
router.post("/", async (req, res) => {
  const v = validateCliente(req.body);
  if (!v.ok) return res.status(400).json({ errors: v.errors });

  try {
    const pool = await getPool();

    const payload = {
      tipoCliente: s(req.body.tipoCliente),
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
      .input("TipoCliente", sql.Char(1), payload.tipoCliente)
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
        INSERT INTO rg.Clientes
          (TipoCliente, Nome, NomeComercial, NIF, PaisID, Email, Telefone, Telemovel,
           CodDistrito, CodConcelho, NomeLocalidade, NumCodPostal, ExtCodPostal,
           MoradaLinha1, MoradaLinha2, Observacoes)
        OUTPUT INSERTED.ClienteID
        VALUES
          (@TipoCliente, @Nome, @NomeComercial, @NIF, @PaisID, @Email, @Telefone, @Telemovel,
           @CodDistrito, @CodConcelho, @NomeLocalidade, @NumCodPostal, @ExtCodPostal,
           @MoradaLinha1, @MoradaLinha2, @Observacoes)
      `);

    res.status(201).json({ id: r.recordset[0].ClienteID });
  } catch (e) {
    res.status(500).json({ error: "Erro ao criar cliente", detail: e.message });
  }
});

// PUT editar cliente
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Id inválido" });

  const v = validateCliente(req.body);
  if (!v.ok) return res.status(400).json({ errors: v.errors });

  try {
    const pool = await getPool();

    const payload = {
      tipoCliente: s(req.body.tipoCliente),
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
      .input("ClienteID", sql.Int, id)
      .input("TipoCliente", sql.Char(1), payload.tipoCliente)
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
        UPDATE rg.Clientes SET
          TipoCliente=@TipoCliente,
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
        WHERE ClienteID=@ClienteID;

        SELECT @@ROWCOUNT AS affected;
      `);

    if (!r.recordset?.[0]?.affected) return res.status(404).json({ error: "Cliente não encontrado" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao editar cliente", detail: e.message });
  }
});

// DELETE (soft delete) cliente
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Id inválido" });

  try {
    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE rg.Clientes
        SET Ativo = 0, DataAtualizacao = GETDATE()
        WHERE ClienteID = @id;

        SELECT @@ROWCOUNT AS affected;
      `);

    if (!r.recordset?.[0]?.affected) return res.status(404).json({ error: "Cliente não encontrado" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao eliminar cliente", detail: e.message });
  }
});

// GET /api/clientes/stats? q=...
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
        FROM rg.Clientes
        WHERE ${where};
      `);

    res.json(r.recordset[0] || { Ativos: 0, Inativos: 0, Total: 0 });
  } catch (e) {
    res.status(500).json({ error: "Erro ao obter stats de clientes", detail: e.message });
  }
});

// GET lista de clientes
// status=active|inactive|all
// q=pesquisa
// orderBy=ClienteID|Nome|NIF|NomeLocalidade|DataCriacao|DataAtualizacao
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
    const orderByRaw = String(req.query.orderBy ?? "ClienteID");
    const orderDirRaw = String(req.query.orderDir ?? "desc").toLowerCase();

    const orderByMap = {
      ClienteID: "ClienteID",
      Nome: "Nome",
      NIF: "NIF",
      NomeLocalidade: "NomeLocalidade",
      DataCriacao: "DataCriacao",
      DataAtualizacao: "DataAtualizacao",
      Ativo: "Ativo",
    };

    const orderBy = orderByMap[orderByRaw] || orderByMap.ClienteID;
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
          ClienteID,
          Nome,
          NIF,
          NomeLocalidade,
          Email,
          Telefone,
          Telemovel,
          Ativo,
          DataCriacao,
          DataAtualizacao
        FROM rg.Clientes
        WHERE ${where}
        ORDER BY ${orderBy} ${orderDir}
      `);

      return res.json(r.recordset);
    }

    // ✅ paginado: devolve { items, total, page, pageSize }
    request.input("offset", sql.Int, offset).input("pageSize", sql.Int, pageSize);

    const r = await request.query(`
      SELECT COUNT(1) AS Total
      FROM rg.Clientes
      WHERE ${where};

      SELECT
        ClienteID,
        Nome,
        NIF,
        NomeLocalidade,
        Email,
        Telefone,
        Telemovel,
        Ativo,
        DataCriacao,
        DataAtualizacao
      FROM rg.Clientes
      WHERE ${where}
      ORDER BY ${orderBy} ${orderDir}
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY;
    `);

    const total = r.recordsets?.[0]?.[0]?.Total ?? 0;
    const items = r.recordsets?.[1] ?? [];

    return res.json({ items, total, page, pageSize });
  } catch (e) {
    res.status(500).json({ error: "Erro ao listar clientes", detail: e.message });
  }
});


// GET cliente por ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Id inválido" });
    }

    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT
          ClienteID,
          TipoCliente,
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
        FROM rg.Clientes
        WHERE ClienteID = @id
      `);

    if (!r.recordset.length) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json(r.recordset[0]);
  } catch (e) {
    res.status(500).json({
      error: "Erro ao obter cliente",
      detail: e.message,
    });
  }
});

// PATCH reativar cliente
router.patch("/:id/reativar", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) return res.status(400).json({ error: "Id inválido" });

  try {
    const pool = await getPool();
    const r = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE rg.Clientes
        SET Ativo = 1, DataAtualizacao = GETDATE()
        WHERE ClienteID = @id;

        SELECT @@ROWCOUNT AS affected;
      `);

    if (!r.recordset?.[0]?.affected) return res.status(404).json({ error: "Cliente não encontrado" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Erro ao reativar cliente", detail: e.message });
  }
});



module.exports = router;
