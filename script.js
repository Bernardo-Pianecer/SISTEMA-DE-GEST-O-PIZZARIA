const botoesCarrossel = document.querySelectorAll('.btn-carrossel');

botoesCarrossel.forEach((botao) => {
    botao.addEventListener('click', () => {
        const carrossel = botao.closest('.carrossel-container');
        const fila = carrossel.querySelector('.filaLanches');
        const direcao = botao.dataset.direcao;
        const distancia = 440;
        const deslocamento = direcao === 'prev' ? -distancia : distancia;

        fila.scrollBy({ left: deslocamento, behavior: 'smooth' });
    });
});

const itensMenu = document.querySelectorAll('.item-menu');

itensMenu.forEach((item) => {
    item.addEventListener('click', () => {
        itensMenu.forEach((link) => link.classList.remove('ativo'));
        item.classList.add('ativo');
    });
});

// Função para rolar o carrossel
function rolarCarrossel(direcao, tipo = null) {
    let fila;
    if (tipo) {
        fila = document.getElementById(`fila-${tipo}`);
    } else {
        // Fallback para carrosséis sem tipo especificado
        const carrossel = event.target.closest('.carrossel-container');
        fila = carrossel.querySelector('.filaLanches');
    }
    
    if (!fila) return;
    
    const distancia = 440;
    const deslocamento = direcao === 'prev' ? -distancia : distancia;
    fila.scrollBy({ left: deslocamento, behavior: 'smooth' });
}

// Função para mostrar/esconder carrosséis de porções
function mostrarPorcao(tipo) {
    // Esconde todos os carrosséis
    const carrosséis = document.querySelectorAll('.carrossel-porcoes');
    carrosséis.forEach((carrossel) => {
        carrossel.style.display = 'none';
    });
    
    // Remove classe ativa de todos os botões de tipo
    const tiposBotoes = document.querySelectorAll('.tipo-porcao');
    tiposBotoes.forEach((botao) => {
        botao.classList.remove('ativo');
    });
    
    // Mostra o carrossel selecionado
    const carrosselSelecionado = document.getElementById(`carrossel-${tipo}`);
    if (carrosselSelecionado) {
        carrosselSelecionado.style.display = 'flex';
        carrosselSelecionado.style.flexDirection = 'column';
    }
    
    // Adiciona classe ativa ao botão clicado
    const botaoClicado = document.querySelector(`.tipo-porcao.${tipo === 'frutosDoMar' ? 'frutosDoMar' : tipo}`);
    if (botaoClicado) {
        botaoClicado.classList.add('ativo');
    }
}

// Inicia mostrando o carrossel de Carnes ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    mostrarPorcao('carnes');
});
