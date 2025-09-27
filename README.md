# Gerencimento-de-mesas-MMTech
Descrição

Este projeto é parte do teste de desenvolvimento para criação de um sistema de reserva de mesas em coworking.
Até o momento, foram implementadas as seguintes funcionalidades:

Rota de Teste (/api/teste) → confirma que a API está rodando.

Registro de Mesas (POST /api/mesas) → permite cadastrar mesas informando sua capacidade.

Listagem de Mesas (GET /api/mesas) → retorna todas as mesas cadastradas no banco.

Estrutura inicial do banco de dados com tabelas de mesas e reservas.

Tecnologias Utilizadas

Node.js (runtime JavaScript)

Express (framework para criação da API)

PostgreSQL (banco de dados relacional)

pg (driver do PostgreSQL para Node.js)

dotenv (gerenciamento de variáveis de ambiente)

cors (configuração de CORS para permitir requisições externas)

nodemon (ambiente de desenvolvimento com hot reload)

Estrutura do Projeto
Gerencimento de mesas MMTech
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── database.js
│   │   ├── controllers
│   │   │   ├── MesaController.js
│   │   │   └── TesteController.js
│   │   ├── routes
│   │   │   ├── MesaRoutes.js
│   │   │   └── TesteRoutes.js
│   │   └── app.js
│   ├── server.js
│   └── sql
│       └── init.sql
├── package.json
└── .env.exemple

Configuração do Banco de Dados

Certifique-se de que o PostgreSQL está instalado e rodando na sua máquina.

Crie o banco de dados:

CREATE DATABASE data_warehouse;


Rode o script init.sql localizado em backend/sql/init.sql para criar as tabelas necessárias:

psql -U postgres -d data_warehouse -f backend/sql/init.sql

Script init.sql
-- Tabela de mesas
CREATE TABLE mesas (
    id SERIAL PRIMARY KEY,
    capacidade INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'disponível' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de reservas
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER NOT NULL, -- Relaciona com a mesa
    finalidade VARCHAR(255) NOT NULL,
    data_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_hora_fim TIMESTAMP WITH TIME ZONE, -- Opcional, pode ser preenchido no check-out
    check_in_at TIMESTAMP WITH TIME ZONE, -- Registra o momento do check-in
    check_out_at TIMESTAMP WITH TIME ZONE, -- Registra o momento do check-out

    CONSTRAINT fk_mesa
        FOREIGN KEY(mesa_id) 
        REFERENCES mesas(id)
);

Configuração e Execução
1. Clonar o repositório
git clone https://github.com/usuario/Gerencimento-de-mesas-MMTech.git
cd Gerencimento-de-mesas-MMTech/backend

2. Instalar dependências
npm install

3. Configurar variáveis de ambiente

Crie um arquivo .env na pasta backend/ baseado no .env.exemple:

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=data_warehouse
DB_USER=postgres
DB_PASSWORD=sua_senha

4. Rodar o servidor em desenvolvimento
npm run dev


Se tudo estiver correto, o terminal mostrará:

Servidor rodando na porta 3000
Acesse: http://localhost:3000
✅ Conectado ao PostgreSQL

Endpoints Disponíveis
Teste

GET http://localhost:3000/api/teste
Retorna uma mensagem confirmando que a API está rodando.

Mesas

GET /api/mesas → lista todas as mesas cadastradas.

POST /api/mesas → cria uma nova mesa.

Body esperado:

{
  "capacidade": 4
}

Próximos Objetivos

Implementar rotas de reservas de mesas (data, horário e finalidade).

Criar lógica para atribuição de mesas após aprovação.

Registrar check-in e check-out dos membros.

Gerar relatórios de uso e ocupação.