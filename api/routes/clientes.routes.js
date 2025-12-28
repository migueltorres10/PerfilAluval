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
  if (nif && !/^\d{9}$/.test(nif)) errors.nif = "NIF deve ter 9 dígitos.";

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

module.exports = router;
