// =====================================================
// CONTROLE DE ACESSO
// Login, sessão e proteção das páginas internas.
// Os dados ficam no localStorage (apenas demonstração).
// =====================================================

// Nome da chave usada para guardar o usuário logado.
const CHAVE_USUARIO = "palladares_usuario";

// ----- LEITURA E GRAVAÇÃO DA SESSÃO -----

// Devolve o usuário logado ou null se ninguém estiver logado.
function lerUsuario() {
    const texto = localStorage.getItem(CHAVE_USUARIO);
    if (!texto) return null;

    try {
        return JSON.parse(texto);
    } catch (erro) {
        // Se o conteúdo estiver corrompido, apaga e considera deslogado.
        localStorage.removeItem(CHAVE_USUARIO);
        return null;
    }
}

// Guarda o usuário logado no localStorage.
function salvarUsuario(usuario) {
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

// ----- LOGIN -----

// Confere nome e senha na lista de usuários do banco.
function conferirCredenciais(nome, senha) {
    for (let i = 0; i < banco.usuarios.length; i++) {
        const usuario = banco.usuarios[i];
        if (usuario.nome === nome && usuario.senha === senha) {
            return usuario;
        }
    }
    return null;
}

// Devolve o nome da página inicial de cada perfil.
function paginaDoPerfil(perfil) {
    if (perfil === "Administrador") return "adm.html";
    if (perfil === "Atendente") return "atendente.html";
    if (perfil === "Cozinheiro") return "cozinha.html";
    return "login.html";
}

// ----- PROTEÇÃO DAS PÁGINAS -----

// Verifica se o usuário logado pode abrir a página atual.
// perfilPermitido é o perfil que aquela página aceita.
function protegerPagina(perfilPermitido) {
    const usuario = lerUsuario();

    // Sem login: volta para a tela de acesso.
    if (!usuario) {
        window.location.href = "login.html";
        return null;
    }

    // Perfil errado: manda para a página correta do próprio perfil.
    if (usuario.perfil !== perfilPermitido) {
        window.location.href = paginaDoPerfil(usuario.perfil);
        return null;
    }

    return usuario;
}

// Mostra o nome e o perfil no canto superior das telas internas.
function mostrarUsuarioNaTela(usuario) {
    const elemento = document.getElementById("nomeUsuario");
    if (elemento && usuario) {
        elemento.textContent = usuario.nome + " • " + usuario.perfil;
    }
}

// ----- SAIR -----

// Encerra a sessão e volta para o login.
// O replace() impede que o botão Voltar reabra a página interna.
function sairDoSistema() {
    localStorage.removeItem(CHAVE_USUARIO);
    window.location.replace("login.html");
}

// Impede que o botão Voltar do navegador mostre uma página
// interna depois que o usuário saiu.
function bloquearBotaoVoltar() {
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", function () {
        if (!lerUsuario()) {
            window.location.replace("login.html");
        } else {
            window.history.pushState(null, "", window.location.href);
        }
    });
}

// ----- TELA DE LOGIN -----

// Liga o formulário de login quando ele existe na página.
function iniciarLogin() {
    const formulario = document.getElementById("formLogin");
    if (!formulario) return;

    const campoMensagem = document.getElementById("mensagemLogin");

    // Se já existe alguém logado, vai direto para a página do perfil.
    const usuarioAtual = lerUsuario();
    if (usuarioAtual) {
        window.location.href = paginaDoPerfil(usuarioAtual.perfil);
        return;
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nome = document.getElementById("nomeLogin").value.trim();
        const senha = document.getElementById("senhaLogin").value;
        const perfil = document.getElementById("perfilLogin").value;

        // Validação 1: campos obrigatórios.
        if (nome === "" || senha === "" || perfil === "") {
            mostrarMensagem(campoMensagem, "Preencha nome, senha e perfil.", "erro");
            return;
        }

        // Validação 2: confere as credenciais.
        const usuario = conferirCredenciais(nome, senha);
        if (!usuario) {
            mostrarMensagem(campoMensagem, "Nome ou senha incorretos.", "erro");
            return;
        }

        // Validação 3: o perfil escolhido precisa ser o do usuário.
        if (usuario.perfil !== perfil) {
            mostrarMensagem(campoMensagem, "Este usuário não pertence ao perfil selecionado.", "erro");
            return;
        }

        // Tudo certo: grava a sessão e redireciona.
        salvarUsuario({ nome: usuario.nome, perfil: usuario.perfil });
        mostrarMensagem(campoMensagem, "Acesso liberado. Abrindo o painel...", "sucesso");

        setTimeout(function () {
            window.location.href = paginaDoPerfil(usuario.perfil);
        }, 600);
    });
}

// Escreve uma mensagem de erro ou sucesso na tela de login.
function mostrarMensagem(elemento, texto, tipo) {
    if (!elemento) return;

    elemento.textContent = texto;
    elemento.className = "mensagem-login " + tipo;
    elemento.hidden = false;
}