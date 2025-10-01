// Array para armazenar as citações
let citacoes = [];
let citacoesFiltradas = [];

// Elementos do DOM
const form = document.getElementById('citacao-form');
const listaCitacoes = document.getElementById('lista-citacoes');
const buscaCitacao = document.getElementById('busca-citacao');
const filtroAutor = document.getElementById('filtro-autor');
const totalCitacoes = document.getElementById('total-citacoes');

// Carregar citações do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', () => {
  carregarCitacoes();
  atualizarFiltroAutores();
  aplicarFiltros();
});

// Event listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();
  adicionarCitacao();
});

buscaCitacao.addEventListener('input', aplicarFiltros);
filtroAutor.addEventListener('change', aplicarFiltros);

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
  atualizarFiltroAutores();
  aplicarFiltros();
  form.reset();
}

function renderizarCitacoes(citacoesParaRenderizar = citacoesFiltradas) {
  atualizarEstatisticas();

  if (citacoesParaRenderizar.length === 0) {
    const mensagem = citacoes.length === 0
      ? 'Nenhuma citação adicionada ainda. Adicione sua primeira citação!'
      : 'Nenhuma citação encontrada com os filtros aplicados.';
    listaCitacoes.innerHTML = `<div class="empty-state">${mensagem}</div>`;
    return;
  }

  listaCitacoes.innerHTML = citacoesParaRenderizar.map(citacao => `
        <div class="citacao-item" data-id="${citacao.id}">
            <div class="citacao-content">
                <div class="citacao-texto">${citacao.texto}</div>
                <div class="citacao-meta">
                    <div class="citacao-autor">— ${citacao.autor}</div>
                    ${citacao.fonte ? `<div class="citacao-fonte">${citacao.fonte}</div>` : ''}
                    <div class="citacao-data">${formatarData(citacao.data)}</div>
                </div>
            </div>
            <div class="citacao-actions">
                <button class="btn-copiar" onclick="copiarCitacao('${citacao.id}')" title="Copiar citação">
                    📋
                </button>
                <button class="btn-deletar" onclick="deletarCitacao('${citacao.id}')" title="Deletar citação">
                    🗑️
                </button>
            </div>
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

function aplicarFiltros() {
  const textoBusca = buscaCitacao.value.toLowerCase();
  const autorSelecionado = filtroAutor.value;

  citacoesFiltradas = citacoes.filter(citacao => {
    const matchTexto = textoBusca === '' ||
      citacao.texto.toLowerCase().includes(textoBusca) ||
      citacao.autor.toLowerCase().includes(textoBusca) ||
      (citacao.fonte && citacao.fonte.toLowerCase().includes(textoBusca));

    const matchAutor = autorSelecionado === '' || citacao.autor === autorSelecionado;

    return matchTexto && matchAutor;
  });

  renderizarCitacoes();
}

function atualizarFiltroAutores() {
  const autores = [...new Set(citacoes.map(citacao => citacao.autor))].sort();
  const autorAtual = filtroAutor.value;

  filtroAutor.innerHTML = '<option value="">Todos os autores</option>';
  autores.forEach(autor => {
    const option = document.createElement('option');
    option.value = autor;
    option.textContent = autor;
    if (autor === autorAtual) option.selected = true;
    filtroAutor.appendChild(option);
  });
}

function atualizarEstatisticas() {
  const total = citacoesFiltradas.length;
  const totalGeral = citacoes.length;

  if (total === totalGeral) {
    totalCitacoes.textContent = `${total} cita${total !== 1 ? 'ções' : 'ção'}`;
  } else {
    totalCitacoes.textContent = `${total} de ${totalGeral} cita${totalGeral !== 1 ? 'ções' : 'ção'}`;
  }
}

function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function deletarCitacao(id) {
  if (confirm('Tem certeza que deseja deletar esta citação?')) {
    citacoes = citacoes.filter(citacao => citacao.id !== parseInt(id));
    salvarCitacoes();
    atualizarFiltroAutores();
    aplicarFiltros();
  }
}

function copiarCitacao(id) {
  const citacao = citacoes.find(c => c.id === parseInt(id));
  if (citacao) {
    const textoCitacao = `"${citacao.texto}" — ${citacao.autor}${citacao.fonte ? ` (${citacao.fonte})` : ''}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textoCitacao).then(() => {
        mostrarNotificacao('Citação copiada!');
      });
    } else {
      // Fallback para navegadores mais antigos
      const textarea = document.createElement('textarea');
      textarea.value = textoCitacao;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      mostrarNotificacao('Citação copiada!');
    }
  }
}

function mostrarNotificacao(mensagem) {
  const notificacao = document.createElement('div');
  notificacao.className = 'notificacao';
  notificacao.textContent = mensagem;
  document.body.appendChild(notificacao);

  setTimeout(() => {
    notificacao.classList.add('show');
  }, 10);

  setTimeout(() => {
    notificacao.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notificacao);
    }, 300);
  }, 2000);
}
