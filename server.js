const express = require("express");
const path = require("path");
const app = express();
const { sql, conectar } = require("./db");

conectar();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET — busca todos os agendamentos do banco
app.get("/agendamentos", async (_req, res) => {
    try {
        const result = await sql.query`
            SELECT id, nome, servico,
                   CONVERT(VARCHAR, data, 23) AS data, 
                   CONVERT(VARCHAR, horario, 108) AS horario 
            FROM agendamentos 
            ORDER BY data, horario
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST — insere um novo agendamento no banco
app.post("/agendamentos", async (req, res) => {
    const { nome, servico,data, horario } = req.body;

    if (!nome || !servico || !data || !horario) {
        return res.status(400).json({ error: "Preencha todos os dados" });
    }

    try {
        await sql.query`
            INSERT INTO agendamentos (nome, servico, data, horario) 
            VALUES (${nome}, ${servico}, ${data}, ${horario})
        `;
        res.status(201).json({ mensagem: "Agendamento criado com sucesso!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE — remove um agendamento do banco pelo id
app.delete("/agendamentos/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await sql.query`
            DELETE FROM agendamentos WHERE id = ${id}
        `;
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});