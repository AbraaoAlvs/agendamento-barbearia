const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});

//Simulação do banco de dados(por enquanto)
let agendamentos = [];

//rota para obter todos os dados de um agendamento
app.get("/agendamentos", (_req, res) => {
    res.json(agendamentos);
});

//rota para um novo agendamento
app.post("/agendamentos", (req, res) => {
    const novoAgendamento = req.body;
    if(!novoAgendamento.nome || !novoAgendamento.data || !novoAgendamento.horario) {
        return res.status(400).json({error:"Preencha todos os dados"});

    } 
    novoAgendamento.id = agendamentos.length + 1;
    agendamentos.push(novoAgendamento);

    res.status(201).json(novoAgendamento); 
});

//rota para excluir um agendamento
app.delete("/agendamentos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    
    const index = agendamentos.findIndex(ag => ag.id === id);
    if (index === -1){
        return res.status(404).json({error: "Agendamento não encontrado."});
        }
    agendamentos.splice(index, 1);
    res.status(204).send();//responde sem contéudo
});

