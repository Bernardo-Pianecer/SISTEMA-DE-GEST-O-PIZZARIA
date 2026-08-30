function rolarCarrossel(direcao) {
    const fila = document.querySelector('.filaLanches');
    const distancia = 440;

    if (direcao === 'prev') {
        fila.scrollBy({ left: -distancia, behavior: 'smooth' });
        return;
    }

    fila.scrollBy({ left: distancia, behavior: 'smooth' });
}

const itensMenu = document.querySelectorAll('.item-menu');

itensMenu.forEach((item) => {
    item.addEventListener('click', () => {
        itensMenu.forEach((link) => link.classList.remove('ativo'));
        item.classList.add('ativo');
    });
});
