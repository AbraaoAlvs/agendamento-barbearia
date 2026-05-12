const sql =  require("mssql");
const config = {
    server: "localhost", //ou localhost 
    database: "barbearia",
    user: "barbearia_user", //nome do dominio
    password: "Barber@2025", // senha do dominio
    options: {
        trustedConnection: true, //autenticação do windows
        instaceName: "rjsolutions",
        trustedServerCertificate: true, //evita erros de certificado
        enableArithAbort: true,
        encrypt: false
    }
};

async function conectar() {
    try {
        await sql.connect(config);
        console.log("Conectado ao Banco de Dados");
    } catch (err) {
        console.error("Erro ao conectar ao Banco de Dados:", err.message);
    }

}

module.exports = {sql, conectar};