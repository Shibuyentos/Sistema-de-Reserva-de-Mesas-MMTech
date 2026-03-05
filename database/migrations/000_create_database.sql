-- ===========================================
-- Sistema de Reserva de Mesas - MMTech
-- Script para CRIAR o Banco de Dados
-- ===========================================
-- Execute este script primeiro, conectado ao banco 'postgres' (padrão)

CREATE DATABASE mmtech_reservas
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

-- Após criar o banco, conecte-se a ele e execute o script 002_create_tables.sql
