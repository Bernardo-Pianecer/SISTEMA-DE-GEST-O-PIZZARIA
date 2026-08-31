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
