// Array para armazenar as citações
let citacoes = [];

// Elementos do DOM
const form = document.getElementById('citacao-form');
const listaCitacoes = document.getElementById('lista-citacoes');

// Carregar citações do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarCitacoes();
    renderizarCitacoes();
});

// Event listener para o formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();
    adicionarCitacao();
});

function adicionarCitacao() {
    const texto = document.getElementById('texto').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const fonte = document.getElementById('fonte').value.trim();

    if (!texto || !autor) {
        return;
    }

    const novaCitacao = {
        id: Date.now(),
        texto,
        autor,
        fonte,
        data: new Date().toISOString()
    };

    citacoes.unshift(novaCitacao);
    salvarCitacoes();
    renderizarCitacoes();
    form.reset();
}

function renderizarCitacoes() {
    if (citacoes.length === 0) {
        listaCitacoes.innerHTML = '<div class="empty-state">Nenhuma citação adicionada ainda. Adicione sua primeira citação!</div>';
        return;
    }

    listaCitacoes.innerHTML = citacoes.map(citacao => `
        <div class="citacao-item" data-id="${citacao.id}">
            <div class="citacao-texto">"${citacao.texto}"</div>
            <div class="citacao-autor">— ${citacao.autor}</div>
            ${citacao.fonte ? `<div class="citacao-fonte">${citacao.fonte}</div>` : ''}
        </div>
    `).join('');
}

function salvarCitacoes() {
    localStorage.setItem('citacoes', JSON.stringify(citacoes));
}

function carregarCitacoes() {
    const citacoesSalvas = localStorage.getItem('citacoes');
    if (citacoesSalvas) {
        citacoes = JSON.parse(citacoesSalvas);
    }
}
