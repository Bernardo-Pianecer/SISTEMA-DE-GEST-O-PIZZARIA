const itensMenu = document.querySelectorAll('.item-menu');

// ===== INÍCIO: DADOS DO CARRINHO =====
// Esta lista guarda os produtos escolhidos enquanto a página está aberta.
const carrinho = [];
// ===== FIM: DADOS DO CARRINHO =====

itensMenu.forEach((item) => {
    item.addEventListener('click', () => {
        itensMenu.forEach((link) => link.classList.remove('ativo'));
        item.classList.add('ativo');
    });
});

// Função para rolar o carrossel - versão melhorada
function rolarCarrossel(direcao, tipo) {
    let fila;
    
    // Tenta buscar pela ID do elemento fila
    fila = document.getElementById(`fila-${tipo}`);
    
    // Se não encontrar, procura o carrossel container mais próximo e busca a fila dentro dele
    if (!fila) {
        // Encontra o botão que chamou a função
        const botao = event.target;
        const container = botao.closest('.carrossel-container');
        if (container) {
            fila = container.querySelector('.filaLanches') || container.querySelector('.filaLanchesDoce');
        }
    }
    
    if (!fila) {
        console.warn(`Fila não encontrada para tipo: ${tipo}`);
        return;
    }
    
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
    // O menu público só é iniciado quando seus elementos existem na página.
    if (document.querySelector('.menuPrincipal')) {
        mostrarPorcao('carnes');
        iniciarCarrinho();
    }

    iniciarPainel();
});

// ===== INÍCIO: FUNCIONAMENTO DO CARRINHO =====
// Este bloco cria o botão +, controla quantidades e atualiza os valores do pedido.
// Prepara os botões dos produtos e liga os eventos do carrinho.
function iniciarCarrinho() {
    const menu = document.querySelector('.menuPrincipal');

    // Lê o nome e o preço de cada card para criar o botão de adicionar.
    document.querySelectorAll('.card').forEach((card) => {
        const nome = card.querySelector('.nomeLanche').textContent.trim();
        const preco = card.querySelector('.preçoHambuguer');
        const linhaPreco = document.createElement('div');
        const botao = document.createElement('button');

        linhaPreco.className = 'linha-preco';
        botao.type = 'button';
        botao.className = 'btn-adicionar';
        botao.dataset.acao = 'adicionar';
        botao.textContent = '+';
        botao.setAttribute('aria-label', `Adicionar ${nome} ao pedido`);
        botao.title = `Adicionar ${nome} ao pedido`;
        preco.replaceWith(linhaPreco);
        linhaPreco.append(preco, botao);
    });

    // Um único evento no menu identifica qual botão foi usado.
    menu.addEventListener('click', (evento) => {
        const botao = evento.target.closest('button[data-acao]');
        if (!botao) return;

        const item = botao.closest('.item-carrinho');
        if (botao.dataset.acao === 'adicionar') {
            adicionarProduto(botao.closest('.card'));
        } else if (botao.dataset.acao === 'remover') {
            removerProduto(item.dataset.nome, Number(item.dataset.preco));
        }
    });

    // A quantidade é lida do campo e convertida de texto para número.
    document.getElementById('itensCarrinho').addEventListener('change', (evento) => {
        if (!evento.target.matches('.quantidade-carrinho')) return;

        const linha = evento.target.closest('.item-carrinho');
        const quantidade = Number(evento.target.value);
        atualizarQuantidade(linha.dataset.nome, Number(linha.dataset.preco), quantidade);
    });

    document.getElementById('limparCarrinho').addEventListener('click', limparCarrinho);
    document.getElementById('alternarCarrinho').addEventListener('click', alternarCarrinho);
    atualizarResumo();
}

// Recolhe ou expande o painel flutuante sem perder os itens escolhidos.
function alternarCarrinho() {
    const painel = document.getElementById('pedido');
    const botao = document.getElementById('alternarCarrinho');
    const recolhido = painel.classList.toggle('recolhido');

    botao.textContent = recolhido ? '+' : '\u2212';
    botao.setAttribute('aria-expanded', String(!recolhido));
    botao.setAttribute('aria-label', recolhido ? 'Expandir carrinho' : 'Recolher carrinho');
}

// Converte o preço escrito como "R$ 20,00" para o número 20.
function lerPreco(textoPreco) {
    const precoNumerico = textoPreco.replace(/[^\d,]/g, '').replace(',', '.');
    return Number(precoNumerico);
}

// Entrada: card clicado. Processamento: procura ou cria o produto no carrinho.
function adicionarProduto(card) {
    const nome = card.querySelector('.nomeLanche').textContent.trim();
    const preco = lerPreco(card.querySelector('.preçoHambuguer').textContent);
    const produtoExistente = carrinho.find((produto) => produto.nome === nome && produto.preco === preco);

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({ nome, preco, quantidade: 1 });
    }

    // Saída: redesenha as quantidades e os valores mostrados na página.
    atualizarResumo();
}

// Atualiza a quantidade digitada ou remove o produto quando ela chega a zero.
function atualizarQuantidade(nome, preco, quantidade) {
    const indice = carrinho.findIndex((produto) => produto.nome === nome && produto.preco === preco);
    if (indice === -1) return;

    if (!Number.isFinite(quantidade) || quantidade <= 0) {
        carrinho.splice(indice, 1);
    } else {
        carrinho[indice].quantidade = quantidade;
    }

    atualizarResumo();
}

// Retira do carrinho o produto correspondente ao botão Remover.
function removerProduto(nome, preco) {
    const indice = carrinho.findIndex((produto) => produto.nome === nome && produto.preco === preco);
    if (indice !== -1) carrinho.splice(indice, 1);
    atualizarResumo();
}

// Formata valores numéricos como moeda brasileira (por exemplo, R$ 20,00).
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Atualiza a lista, o contador de itens e os valores do resumo do pedido.
function atualizarResumo() {
    const lista = document.getElementById('itensCarrinho');
    const contador = document.getElementById('contadorItens');
    const rotuloItens = document.getElementById('rotuloItens');
    const subtotalElemento = document.getElementById('subtotal');
    const totalElemento = document.getElementById('total');
    const totalCompacto = document.getElementById('totalCompacto');
    const avisoVazio = document.getElementById('carrinhoVazio');
    let quantidadeTotal = 0;
    let subtotal = 0;

    // Limpa a lista para desenhar novamente com os dados mais recentes.
    lista.replaceChildren();
    avisoVazio.hidden = carrinho.length > 0;

    carrinho.forEach((produto) => {
        quantidadeTotal += produto.quantidade;
        subtotal += produto.preco * produto.quantidade;

        const linha = document.createElement('li');
        linha.className = 'item-carrinho';
        linha.dataset.nome = produto.nome;
        linha.dataset.preco = produto.preco;

        const informacoes = document.createElement('div');
        informacoes.className = 'informacoes-item';
        const nome = document.createElement('strong');
        nome.textContent = produto.nome;
        const valor = document.createElement('small');
        valor.textContent = `${formatarMoeda(produto.preco)} cada`;
        informacoes.append(nome, valor);

        const quantidade = document.createElement('input');
        quantidade.className = 'quantidade-carrinho';
        quantidade.type = 'number';
        quantidade.min = '0';
        quantidade.value = produto.quantidade;
        quantidade.setAttribute('aria-label', `Quantidade de ${produto.nome}`);

        const remover = document.createElement('button');
        remover.type = 'button';
        remover.className = 'btn-remover';
        remover.dataset.acao = 'remover';
        remover.textContent = 'Remover';

        linha.append(informacoes, quantidade, remover);
        lista.append(linha);
    });

    contador.textContent = quantidadeTotal;
    rotuloItens.textContent = quantidadeTotal === 1 ? 'item no carrinho' : 'itens no carrinho';
    subtotalElemento.textContent = formatarMoeda(subtotal);
    totalElemento.textContent = formatarMoeda(subtotal);
    totalCompacto.textContent = formatarMoeda(subtotal);
}

// Esvazia o carrinho e redesenha o resumo com valores zerados.
function limparCarrinho() {
    carrinho.length = 0;
    atualizarResumo();
}
// ===== FIM: FUNCIONAMENTO DO CARRINHO =====


// =====================================================
// PAINEL ADMINISTRATIVO - LOGIN, PEDIDOS E PERMISSÕES
// Os dados ficam no navegador usando localStorage.
// =====================================================

// Verifica se existe uma lista salva. Se não existir, cria alguns pedidos de exemplo.
function buscarPedidos() {
    const dadosSalvos = localStorage.getItem('palladares_pedidos');
    if (dadosSalvos) return JSON.parse(dadosSalvos);
    localStorage.setItem('palladares_pedidos', JSON.stringify(banco.pedidosIniciais));
    return banco.pedidosIniciais;
}

function salvarPedidos(pedidos) {
    localStorage.setItem('palladares_pedidos', JSON.stringify(pedidos));
}

function iniciarPainel() {
    const formularioLogin = document.getElementById('formLogin');
    if (formularioLogin) formularioLogin.addEventListener('submit', entrarNoSistema);

    const formularioPedido = document.getElementById('formPedido');
    if (formularioPedido) formularioPedido.addEventListener('submit', cadastrarPedido);

    const nomeUsuario = document.getElementById('nomeUsuario');
    const usuario = JSON.parse(localStorage.getItem('palladares_usuario') || 'null');
    if (nomeUsuario && usuario) nomeUsuario.textContent = usuario.nome + ' • ' + usuario.perfil;

    if (document.getElementById('listaPedidosAdm')) atualizarAdministrador();
    if (document.getElementById('pedidosCozinha')) atualizarCozinha();
    if (document.getElementById('pedidosAtendente')) atualizarAtendente();
}

// Faz o acesso de demonstração e direciona para a tela de cada perfil.
function entrarNoSistema(evento) {
    evento.preventDefault();
    const nome = document.getElementById('nomeLogin').value.trim();
    const perfil = document.getElementById('perfilLogin').value;
    if (nome === '' || perfil === '') {
        alert('Preencha seu nome e selecione um perfil.');
        return;
    }

    localStorage.setItem('palladares_usuario', JSON.stringify({ nome, perfil }));
    if (perfil === 'Administrador') window.location.href = 'adm.html';
    if (perfil === 'Cozinheiro') window.location.href = 'cozinha.html';
    if (perfil === 'Atendente') window.location.href = 'atendente.html';
}

function sairDoSistema() {
    localStorage.removeItem('palladares_usuario');
    window.location.href = 'login.html';
}

function formatarMoedaPainel(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarAdministrador() {
    const pedidos = buscarPedidos();
    const totalPedidos = pedidos.length;
    const emPreparo = pedidos.filter((pedido) => pedido.status === 'Em preparo').length;
    const aguardando = pedidos.filter((pedido) => pedido.status === 'Aguardando').length;
    const prontos = pedidos.filter((pedido) => pedido.status === 'Pronto').length;

    document.getElementById('totalPedidos').textContent = totalPedidos;
    document.getElementById('pedidosPreparo').textContent = emPreparo;
    document.getElementById('pedidosAguardando').textContent = aguardando;
    document.getElementById('pedidosProntos').textContent = prontos;

    const lista = document.getElementById('listaPedidosAdm');
    lista.innerHTML = '';
    pedidos.slice().reverse().forEach((pedido) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `<td>#${pedido.id}</td><td>${pedido.cliente}</td><td>${pedido.produto}</td><td>${pedido.quantidade}</td><td><span class="status ${classeStatus(pedido.status)}">${pedido.status}</span></td><td>${pedido.horario}</td>`;
        lista.appendChild(linha);
    });
}

function atualizarCozinha() {
    const pedidos = buscarPedidos();
    const lista = document.getElementById('pedidosCozinha');
    lista.innerHTML = '';
    const pedidosAtivos = pedidos.filter((pedido) => pedido.status !== 'Entregue');

    if (pedidosAtivos.length === 0) {
        lista.innerHTML = '<p class="mensagem-vazia">Não há pedidos pendentes no momento.</p>';
        return;
    }

    pedidosAtivos.forEach((pedido) => {
        const card = document.createElement('article');
        card.className = 'pedido-card';
        const textoBotao = pedido.status === 'Aguardando' ? 'Iniciar preparo' : 'Marcar como pronto';
        card.innerHTML = `<h3>Pedido #${pedido.id}</h3><p><strong>${pedido.produto}</strong> • ${pedido.quantidade} unidade(s)</p><p>Cliente: ${pedido.cliente}</p><p>Destino: ${pedido.mesa}</p><p>Horário: ${pedido.horario}</p><p>Status: <span class="status ${classeStatus(pedido.status)}">${pedido.status}</span></p><div class="pedido-acoes"><button class="botao-painel" onclick="avancarPedido(${pedido.id})">${textoBotao}</button></div>`;
        lista.appendChild(card);
    });
}

function avancarPedido(id) {
    const pedidos = buscarPedidos();
    const indice = pedidos.findIndex((pedido) => pedido.id === id);
    if (indice === -1) return;

    if (pedidos[indice].status === 'Aguardando') pedidos[indice].status = 'Em preparo';
    else if (pedidos[indice].status === 'Em preparo') pedidos[indice].status = 'Pronto';
    salvarPedidos(pedidos);
    atualizarCozinha();
}

function atualizarAtendente() {
    const pedidos = buscarPedidos();
    const lista = document.getElementById('pedidosAtendente');
    lista.innerHTML = '';

    pedidos.slice().reverse().forEach((pedido) => {
        const linha = document.createElement('tr');
        const acao = pedido.status === 'Pronto' ? `<button class="botao-painel" onclick="entregarPedido(${pedido.id})">Entregar</button>` : '-';
        linha.innerHTML = `<td>#${pedido.id}</td><td>${pedido.cliente}</td><td>${pedido.produto}</td><td>${pedido.mesa}</td><td><span class="status ${classeStatus(pedido.status)}">${pedido.status}</span></td><td>${acao}</td>`;
        lista.appendChild(linha);
    });
}

function cadastrarPedido(evento) {
    evento.preventDefault();
    const cliente = document.getElementById('clientePedido').value.trim();
    const produto = document.getElementById('produtoPedido').value.trim();
    const quantidade = Number(document.getElementById('quantidadePedido').value);
    const mesa = document.getElementById('mesaPedido').value.trim();

    if (cliente === '' || produto === '' || mesa === '' || quantidade < 1) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const pedidos = buscarPedidos();
    const novoPedido = {
        id: pedidos.length ? Math.max(...pedidos.map((pedido) => pedido.id)) + 1 : 1001,
        cliente, produto, quantidade, mesa, status: 'Aguardando',
        horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    pedidos.push(novoPedido);
    salvarPedidos(pedidos);
    evento.target.reset();
    atualizarAtendente();
    alert('Pedido registrado e enviado para a cozinha!');
}

function entregarPedido(id) {
    const pedidos = buscarPedidos();
    const indice = pedidos.findIndex((pedido) => pedido.id === id);
    if (indice === -1 || pedidos[indice].status !== 'Pronto') return;
    pedidos[indice].status = 'Entregue';
    salvarPedidos(pedidos);
    atualizarAtendente();
}

function classeStatus(status) {
    if (status === 'Em preparo') return 'preparo';
    if (status === 'Pronto' || status === 'Entregue') return 'pronto';
    return '';
}
