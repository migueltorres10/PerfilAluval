require("dotenv").config();
const sql = require("mssql");

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    server: process.env.DB_SERVER,
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: true,
    },
};

console.log("Tentando ligar à BD com config:", {
    ...config,
    password: "***"
});

sql.connect(config).then(pool => {
    console.log("✅ Ligado com sucesso!");
    return pool.request().query("SELECT 1 as ok");
}).then(result => {
    console.log("Teste de query OK:", result.recordset[0]);
    process.exit(0);
}).catch(err => {
    console.error("❌ Erro de ligação:", err);
    process.exit(1);
});
