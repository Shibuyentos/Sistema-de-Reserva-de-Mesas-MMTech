-- ===========================================
-- Sistema de Reserva de Mesas - MMTech
-- Script de Criação do Banco de Dados
-- ===========================================

-- Execute este script no seu PostgreSQL para criar todas as tabelas necessárias.
-- Certifique-se de ter criado o banco de dados antes (ex: CREATE DATABASE mmtech_reservas;)

-- ===========================================
-- Tabela de Usuários
-- ===========================================
-- Armazena os dados dos membros e administradores do sistema.
-- O campo 'perfil' pode ser 'membro' ou 'admin'.

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) DEFAULT 'membro' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- Tabela de Mesas
-- ===========================================
-- Armazena as informações de cada mesa do coworking.
-- O campo 'status' indica se a mesa está 'disponível' ou 'indisponível'.

CREATE TABLE IF NOT EXISTS mesas (
    id SERIAL PRIMARY KEY,
    capacidade INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'disponível' NOT NULL
);

-- ===========================================
-- Tabela de Reservas
-- ===========================================
-- Tabela central que conecta um usuário e uma mesa para um determinado período.
-- check_in_at e check_out_at são preenchidos quando o membro faz check-in/out.

CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER NOT NULL REFERENCES mesas(id) ON DELETE CASCADE,
    membro VARCHAR(100) NOT NULL,
    finalidade VARCHAR(255),
    data_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_hora_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    check_in_at TIMESTAMP WITH TIME ZONE,
    check_out_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- Índices para Performance
-- ===========================================

CREATE INDEX IF NOT EXISTS idx_reservas_mesa_id ON reservas(mesa_id);
CREATE INDEX IF NOT EXISTS idx_reservas_membro ON reservas(membro);
CREATE INDEX IF NOT EXISTS idx_reservas_data_inicio ON reservas(data_hora_inicio);

-- ===========================================
-- Dados Iniciais (Opcional)
-- ===========================================
-- Descomente as linhas abaixo para inserir algumas mesas de exemplo.

-- INSERT INTO mesas (capacidade) VALUES (2), (4), (4), (6), (8);

-- Para criar um usuário admin de teste (senha: admin123):
-- INSERT INTO usuarios (nome, email, senha, perfil) 
-- VALUES ('Administrador', 'admin@mmtech.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye./nt.4L/1xqB2U2P.x2FqZ1Z1Z1Z1Z1', 'admin');
