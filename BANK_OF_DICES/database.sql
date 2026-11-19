CREATE DATABASE IF NOT EXISTS Palladares;
use Palladares;

CREATE TABLE IF NOT EXISTS funcionario (
    id_func INT PRIMARY KEY AUTO_INCREMENT,
    nome_func VARCHAR(500) NOT NULL,
    telefone_func VARCHAR(20) NOT NULL,
    endereco_func Varchar(200),
    cargo_func INT NOT NULL DEFAULT 0,
    status_func BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (telefone_func)
);

CREATE TABLE IF NOT EXISTS cliente(
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nome_cliente VARCHAR(500) NOT NULL,
    telefone_cliente VARCHAR(20) NOT NULL,
    endereco_cliente VARCHAR(200) NOT NULL,
    UNIQUE (telefone_cliente)
);

CREATE TABLE IF NOT EXISTS produto(
    id_prod INT PRIMARY KEY AUTO_INCREMENT,
    descricao_prod VARCHAR(500) NOT NULL,
    valor_prod DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS ingredientes(
    id_ingre INT PRIMARY KEY AUTO_INCREMENT,
    descricao_ingre VARCHAR(500) NOT NULL,
    restricao_ingre VARCHAR(500) NOT NULL,
    quantidade_ingre INT,
    UNIQUE (descricao_ingre)
);

CREATE TABLE if NOT EXISTS compra(
    id_compra INT PRIMARY KEY AUTO_INCREMENT,
    data_compra DATE,
    id_cliente int NOT NULL,
    status_compra BOOLEAN NOT NULL DEFAULT TRUE,
    id_func INT,
        FOREIGN KEY (id_func)
        REFERENCES funcionario(id_func),
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
);

CREATE TABLE if NOT EXISTS compraxproduto(
    id_compra int NOT NULL,
    id_prod int NOT NULL,
    qtd_prod INT NOT NULL DEFAULT 1,
        FOREIGN KEY (id_compra)
        REFERENCES compra(id_compra),
        FOREIGN KEY (id_prod)
        REFERENCES produto(id_prod)
);