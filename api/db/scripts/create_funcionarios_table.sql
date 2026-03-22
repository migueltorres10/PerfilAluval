USE [PerfilAluval_Gestao]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

/* =========================================================
   TABELAS AUXILIARES
   ========================================================= */

IF NOT EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[rg].[Departamentos]')
      AND type = N'U'
)
BEGIN
    CREATE TABLE [rg].[Departamentos](
        [DepartamentoID] INT IDENTITY(1,1) NOT NULL,
        [Nome] NVARCHAR(100) NOT NULL,
        [Descricao] NVARCHAR(250) NULL,
        [Ativo] BIT NOT NULL CONSTRAINT [DF_Departamentos_Ativo] DEFAULT ((1)),
        [DataCriacao] DATETIME2(7) NOT NULL CONSTRAINT [DF_Departamentos_DataCriacao] DEFAULT (SYSDATETIME()),
        [DataAtualizacao] DATETIME2(7) NULL,
        CONSTRAINT [PK_Departamentos] PRIMARY KEY CLUSTERED ([DepartamentoID] ASC),
        CONSTRAINT [UQ_Departamentos_Nome] UNIQUE NONCLUSTERED ([Nome] ASC)
    )
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[rg].[Funcoes]')
      AND type = N'U'
)
BEGIN
    CREATE TABLE [rg].[Funcoes](
        [FuncaoID] INT IDENTITY(1,1) NOT NULL,
        [Nome] NVARCHAR(100) NOT NULL,
        [DepartamentoID] INT NOT NULL,
        [Descricao] NVARCHAR(250) NULL,
        [Ativo] BIT NOT NULL CONSTRAINT [DF_Funcoes_Ativo] DEFAULT ((1)),
        [DataCriacao] DATETIME2(7) NOT NULL CONSTRAINT [DF_Funcoes_DataCriacao] DEFAULT (SYSDATETIME()),
        [DataAtualizacao] DATETIME2(7) NULL,
        CONSTRAINT [PK_Funcoes] PRIMARY KEY CLUSTERED ([FuncaoID] ASC),
        CONSTRAINT [UQ_Funcoes_Nome_Departamento] UNIQUE NONCLUSTERED ([Nome] ASC, [DepartamentoID] ASC)
    )
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[rg].[TiposContrato]')
      AND type = N'U'
)
BEGIN
    CREATE TABLE [rg].[TiposContrato](
        [TipoContratoID] INT IDENTITY(1,1) NOT NULL,
        [Nome] NVARCHAR(50) NOT NULL,
        [Descricao] NVARCHAR(250) NULL,
        [Ativo] BIT NOT NULL CONSTRAINT [DF_TiposContrato_Ativo] DEFAULT ((1)),
        [DataCriacao] DATETIME2(7) NOT NULL CONSTRAINT [DF_TiposContrato_DataCriacao] DEFAULT (SYSDATETIME()),
        [DataAtualizacao] DATETIME2(7) NULL,
        CONSTRAINT [PK_TiposContrato] PRIMARY KEY CLUSTERED ([TipoContratoID] ASC),
        CONSTRAINT [UQ_TiposContrato_Nome] UNIQUE NONCLUSTERED ([Nome] ASC)
    )
END
GO

/* =========================================================
   TABELA FUNCIONARIOS
   ========================================================= */

IF NOT EXISTS (
    SELECT 1
    FROM sys.objects
    WHERE object_id = OBJECT_ID(N'[rg].[Funcionarios]')
      AND type = N'U'
)
BEGIN
    CREATE TABLE [rg].[Funcionarios](
        [FuncionarioID] INT IDENTITY(1,1) NOT NULL,

        -- Dados pessoais
        [Nome] NVARCHAR(255) NOT NULL,
        [DataNascimento] DATE NULL,
        [NIF] NVARCHAR(20) NOT NULL,
        [NumeroSegurancaSocial] NVARCHAR(50) NULL,
        [NumeroCartaoCidadao] NVARCHAR(50) NULL,

        -- Contactos
        [Email] NVARCHAR(255) NULL,
        [Telefone] NVARCHAR(50) NULL,
        [Telemovel] NVARCHAR(50) NULL,

        -- Morada
        [MoradaLinha1] NVARCHAR(250) NULL,
        [MoradaLinha2] NVARCHAR(250) NULL,
        [NomeLocalidade] NVARCHAR(150) NULL,
        [NumCodPostal] CHAR(4) NULL,
        [ExtCodPostal] CHAR(3) NULL,
        [CodDistrito] CHAR(2) NULL,
        [CodConcelho] CHAR(2) NULL,
        [PaisID] INT NOT NULL,

        -- Dados profissionais
        [FuncaoID] INT NULL,
        [DepartamentoID] INT NULL,
        [TipoContratoID] INT NULL,
        [DataAdmissao] DATE NULL,
        [DataSaida] DATE NULL,
        [SalarioBaseMensal] DECIMAL(10,2) NULL,

        -- Controlo e estado
        [Ativo] BIT NOT NULL CONSTRAINT [DF_Funcionarios_Ativo] DEFAULT ((1)),
        [DataCriacao] DATETIME2(7) NOT NULL CONSTRAINT [DF_Funcionarios_DataCriacao] DEFAULT (SYSDATETIME()),
        [DataAtualizacao] DATETIME2(7) NULL,

        -- Observações
        [Observacoes] NVARCHAR(MAX) NULL,

        CONSTRAINT [PK_Funcionarios] PRIMARY KEY CLUSTERED ([FuncionarioID] ASC),
        CONSTRAINT [UQ_Funcionarios_NIF] UNIQUE NONCLUSTERED ([NIF] ASC)
    )
END
GO

/* =========================================================
   FOREIGN KEYS
   ========================================================= */

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = N'FK_Funcoes_Departamentos'
)
BEGIN
    ALTER TABLE [rg].[Funcoes] WITH CHECK
    ADD CONSTRAINT [FK_Funcoes_Departamentos]
    FOREIGN KEY([DepartamentoID])
    REFERENCES [rg].[Departamentos] ([DepartamentoID])
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = N'FK_Funcionarios_Paises'
)
BEGIN
    ALTER TABLE [rg].[Funcionarios] WITH CHECK
    ADD CONSTRAINT [FK_Funcionarios_Paises]
    FOREIGN KEY([PaisID])
    REFERENCES [rg].[Paises] ([PaisID])
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = N'FK_Funcionarios_Distritos'
)
BEGIN
    ALTER TABLE [rg].[Funcionarios] WITH CHECK
    ADD CONSTRAINT [FK_Funcionarios_Distritos]
    FOREIGN KEY([CodDistrito])
    REFERENCES [rg].[Distritos] ([cod_distrito])
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = N'FK_Funcionarios_Concelhos'
)
BEGIN
    ALTER TABLE [rg].[Funcionarios] WITH CHECK
    ADD CONSTRAINT [FK_Funcionarios_Concelhos]
    FOREIGN KEY([CodDistrito], [CodConcelho])
    REFERENCES [rg].[Concelhos] ([cod_distrito], [cod_concelho])
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = N'FK_Funcionarios_Funcoes'
)
BEGIN
    ALTER TABLE [rg].[Funcionarios] WITH CHECK
    ADD CONSTRAINT [FK_Funcionarios_Funcoes]
    FOREIGN KEY([FuncaoID])
    REFERENCES [rg].[Funcoes] ([FuncaoID])
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = N'FK_Funcionarios_Departamentos'
)
BEGIN
    ALTER TABLE [rg].[Funcionarios] WITH CHECK
    ADD CONSTRAINT [FK_Funcionarios_Departamentos]
    FOREIGN KEY([DepartamentoID])
    REFERENCES [rg].[Departamentos] ([DepartamentoID])
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = N'FK_Funcionarios_TiposContrato'
)
BEGIN
    ALTER TABLE [rg].[Funcionarios] WITH CHECK
    ADD CONSTRAINT [FK_Funcionarios_TiposContrato]
    FOREIGN KEY([TipoContratoID])
    REFERENCES [rg].[TiposContrato] ([TipoContratoID])
END
GO

/* =========================================================
   CHECKS
   ========================================================= */

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = N'CK_Funcionarios_CodigoPostal'
)
BEGIN
    ALTER TABLE [rg].[Funcionarios] WITH CHECK
    ADD CONSTRAINT [CK_Funcionarios_CodigoPostal]
    CHECK (
        ([NumCodPostal] IS NULL AND [ExtCodPostal] IS NULL)
        OR
        ([NumCodPostal] IS NOT NULL AND [ExtCodPostal] IS NOT NULL)
    )
END
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = N'CK_Funcionarios_Datas'
)
BEGIN
    ALTER TABLE [rg].[Funcionarios] WITH CHECK
    ADD CONSTRAINT [CK_Funcionarios_Datas]
    CHECK (
        [DataSaida] IS NULL
        OR [DataAdmissao] IS NULL
        OR [DataSaida] >= [DataAdmissao]
    )
END
GO
