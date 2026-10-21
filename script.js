// 1. Mapeamento dos elementos do HTML
const inputTarefa = document.getElementById('novaTarefa');
const btnAdicionar = document.getElementById('adicionarTarefa');
const listaTarefas = document.getElementById('listaTarefas');

// 2. A NOSSA BASE DE DADOS
// Vai no LocalStorage e tenta pegar 'minhasTarefas'. 
// O "|| []" significa: Se não tiver nada salvo, comece com uma lista vazia.
let tarefas = JSON.parse(localStorage.getItem('minhasTarefas')) || [];

// 3. FUNÇÃO QUE DESENHA A TELA
// Toda vez que a nossa base de dados mudar, essa função apaga a tela e desenha tudo de novo atualizado.
function atualizarTela() {
    // Apaga todo o HTML de dentro da lista para não duplicar
    listaTarefas.innerHTML = '';

    // O forEach percorre cada item da nossa base de dados (o 'index' é a posição dela na lista: 0, 1, 2...)
    tarefas.forEach(function(tarefa, index) {
        const novoItem = document.createElement('li');

        // 1. A CAIXINHA ESTÉTICA
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarefa.concluida; // A caixinha apenas reflete se está concluída ou não
        checkbox.style.pointerEvents = 'none'; // O segredo: impede que o clique pare na caixinha, repassando para o <li>
        checkbox.classList.add('checkbox-tarefa');

        // 2. O TEXTO ISOLADO (necessário para não desalinhar o botão)
        const tagTexto = document.createElement('span');
        tagTexto.textContent = tarefa.texto;
        tagTexto.classList.add('texto-tarefa');

        // 3. A SUA LÓGICA ORIGINAL INTACTA
        novoItem.addEventListener('click', function() {
            tarefa.concluida = !tarefa.concluida; 
            salvarNoLocalStorage(); 
            atualizarTela(); 
        });

        if (tarefa.concluida === true) {
            novoItem.classList.add('riscada');
        }

        // 4. O BOTÃO DE DELETAR
        const btnDeletar = document.createElement('button');
        btnDeletar.textContent = '\u{1F5D1}';
        btnDeletar.classList.add('btn-deletar');
        
        btnDeletar.addEventListener('click', function(evento) {
            evento.stopPropagation();
            tarefas.splice(index, 1); 
            salvarNoLocalStorage();
            atualizarTela();
        });

        // 5. MONTANDO A TELA (Esquerda, Centro, Direita)
        novoItem.appendChild(checkbox);
        novoItem.appendChild(tagTexto);
        novoItem.appendChild(btnDeletar);

        listaTarefas.appendChild(novoItem);
    });
}

// 4. FUNÇÃO PARA SALVAR NO COMPUTADOR
function salvarNoLocalStorage() {
    // Converte nossa lista para Texto (JSON) e guarda na gaveta 'minhasTarefas'
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
}

// 5. AÇÃO DO BOTÃO ADICIONAR
btnAdicionar.addEventListener('click', function() {
    const textoDigitado = inputTarefa.value.trim();

    if (textoDigitado === '') {
        return;
    }

    // Em vez de criar HTML, nós empurramos (push) um "Objeto" para a nossa base de dados
    tarefas.push({
        texto: textoDigitado,
        concluida: false // Toda tarefa nasce não-concluída
    });

    inputTarefa.value = '';
    
    salvarNoLocalStorage(); // Salva a tarefa nova no computador
    atualizarTela(); // Manda desenhar a tarefa nova na tela
});

// 6. INÍCIO DO APP
// Quando a página carrega pela primeira vez (F5), ele chama essa função para desenhar as tarefas que já estavam salvas.
atualizarTela();