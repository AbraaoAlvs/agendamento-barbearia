// 1. Quando a página carregar, busca os agendamentos existentes
document.addEventListener("DOMContentLoaded", () => {
    carregarAgendamentos();
});

// 2. Quando o formulário for enviado, cria um novo agendamento
document.getElementById("formAgendamento").addEventListener("submit", async (e) => {
    e.preventDefault(); // impede a página de recarregar

    const nome = document.getElementById("nome").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;

    // Envia os dados para o servidor
    const resposta = await fetch("/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, data, horario })
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
