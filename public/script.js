// 1. Quando a página carregar, busca os agendamentos existentes
document.addEventListener("DOMContentLoaded", () => {
    // Define a data mínima como hoje
    const hoje = new Date().toISOString().split("T")[0];
    document.getElementById("data").min = hoje;
    
    carregarAgendamentos();
});

// Bloqueia domingos e segundas no calendário
document.getElementById("data").addEventListener("input", function () {
    const data = new Date(this.value + "T00:00:00");
    const diaSemana = data.getDay(); // 0 = domingo, 1 = segunda

    if (diaSemana === 0 || diaSemana === 1) {
        alert("A barbearia não atende aos domingos e segundas-feiras. Por favor, escolha outro dia.");
        this.value = "";
    }
});

// 2. Quando o formulário for enviado, cria um novo agendamento
document.getElementById("formAgendamento").addEventListener("submit", async (e) => {
    e.preventDefault(); // impede a página de recarregar

    const nome = document.getElementById("nome").value;
    const servico = document.getElementById("servico").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;

    // Envia os dados para o servidor
    const resposta = await fetch("/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, servico,data, horario })
    });

    if (resposta.ok) {
        alert("Agendamento criado com sucesso!");
        carregarAgendamentos(); // atualiza a lista
    } else {
        alert("Erro ao criar agendamento.");
    }
});

// 3. Função que busca e exibe todos os agendamentos
async function carregarAgendamentos() {
    const resposta = await fetch("/agendamentos");
    const agendamentos = await resposta.json();


    const lista = document.getElementById("listaAgendamentos");
    lista.innerHTML = ""; // limpa a lista antes de renderizar
    
    agendamentos.forEach((ag) => {
        const item = document.createElement("li");
        item.innerHTML = `
            <div>
             <strong>${ag.nome}</strong><br>
             <span>${ag.servico}</span><br>
             <span>${ag.data} às ${ag.horario}</span>
            </div>
            <button onclick="cancelarAgendamento(${ag.id})">Cancelar</button>
        `;
        lista.appendChild(item);
    });
}

// 4. Função para cancelar/deletar um agendamento
async function cancelarAgendamento(id) {
    const confirmou = confirm("Deseja cancelar este agendamento?");
    if (!confirmou) return;

    await fetch(`/agendamentos/${id}`, { method: "DELETE" });
    carregarAgendamentos(); // atualiza a lista
}



