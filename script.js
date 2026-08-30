function rolarCarrossel(direcao) {
    const fila = document.querySelector('.filaLanches');
    const distancia = 440;

    if (direcao === 'prev') {
        fila.scrollBy({ left: -distancia, behavior: 'smooth' });
        return;
    }

    fila.scrollBy({ left: distancia, behavior: 'smooth' });
}
