# Sistema de Reserva de Mesas MMTech 🚀

Um sistema web full-stack para a gestão e reserva de mesas em espaços de coworking, desenvolvido com Node.js, Express, PostgreSQL e React.

##  Descrição

Este projeto permite que membros de um espaço de coworking visualizem e reservem mesas para períodos específicos. Adicionalmente, oferece uma área administrativa para o rastreamento do histórico de reservas. A aplicação foi concebida com uma arquitetura cliente-servidor, comunicando através de uma API RESTful.

Este projeto cumpre os seguintes requisitos do documento de teste:
- **Funcionais:** Registro de Mesas (backend), Reservas de Mesas (frontend/backend), Check-in/Check-out (backend) e Rastreamento/Relatórios (frontend/backend).
- **Não Funcionais:** Usabilidade, Manutenção e Escalabilidade e Relatórios para Auditoria.

##  Funcionalidades

- **Backend (API RESTful)**
  - `[✅]` Endpoints para CRUD de Mesas e Reservas.
  - `[✅]` Sistema de reserva com verificação de conflitos de horário.
  - `[✅]` Endpoints para Check-in e Check-out.
  - `[✅]` Endpoint para gerar relatórios de histórico de reservas.

- **Frontend (React App)**
  - `[✅]` Interface reativa com React 18 e Vite.
  - `[✅]` Navegação entre páginas com `react-router-dom`.
  - `[✅]` Visualização de mesas disponíveis em tempo real.
  - `[✅]` Modal para realizar novas reservas.
  - `[✅]` Página de administração para visualizar o histórico completo de reservas.

##  Tecnologias Utilizadas

| Componente | Tecnologias Principais                                |
|------------|--------------------------------------------------------|
| **Backend**| Node.js, Express, PostgreSQL, pg, cors, dotenv         |
| **Frontend**| React 18, Vite, React Router, Axios                    |
| **Gestão** | Git, GitHub, NPM                                       |

##  Guia de Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

Antes de começar, certifique-se de que tem as seguintes ferramentas instaladas:
- [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
- [NPM](https://www.npmjs.com/) (geralmente instalado com o Node.js)
- [PostgreSQL](https://www.postgresql.org/download/)

---

### 1. Clonar o Repositório

```bash
git clone https://github.com/Shibuyentos/Sistema-de-Reserva-de-Mesas-MMTech.git
cd Sistema-de-Reserva-de-Mesas-MMTech
```

### 2. Configurar o Backend

Navegue até à pasta do backend e instale as dependências:

```bash
cd backend
npm install
```

Configure a Base de Dados PostgreSQL:

Certifique-se de que o seu serviço do PostgreSQL está em execução.

Crie um utilizador e uma base de dados para o projeto. Para desenvolvimento, é comum usar a base de dados padrão postgres que já vem criada. As instruções abaixo assumem que você usará a base de dados postgres.

Execute o seguinte script SQL na sua base de dados para criar as tabelas necessárias:

```sql
CREATE TABLE mesas (
    id SERIAL PRIMARY KEY,
    capacidade INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'disponível' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER NOT NULL,
    finalidade VARCHAR(255) NOT NULL,
    data_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_hora_fim TIMESTAMP WITH TIME ZONE,
    check_in_at TIMESTAMP WITH TIME ZONE,
    check_out_at TIMESTAMP WITH TIME ZONE,
    membro VARCHAR(255) NOT NULL,
    CONSTRAINT fk_mesa FOREIGN KEY(mesa_id) REFERENCES mesas(id)
);
```

Configure as Variáveis de Ambiente:

Na pasta backend, crie um ficheiro chamado `.env`.

Copie o conteúdo abaixo para o `.env` e substitua os valores pelos da sua configuração local do PostgreSQL.

```env
# Configuração do Servidor
PORT=3000

# Configuração da Base de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres # Ou o nome da base de dados que você criou
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
```

Execute o servidor do backend:

```bash
npm run dev
```

O servidor estará em execução em http://localhost:3000.

### 3. Configurar o Frontend

Abra um novo terminal. Navegue até à pasta do frontend e instale as dependências:

```bash
cd frontend
npm install
```

(Este comando instalará as versões corretas e estáveis das bibliotecas, incluindo o React 18, conforme definido no package.json).

Execute a aplicação frontend:

```bash
npm run dev
```

A aplicação React estará disponível no endereço fornecido pelo Vite (geralmente http://localhost:5173).

### 4. Utilização e Testes

**Adicionar Mesas (Obrigatório):**

Para que a aplicação mostre mesas disponíveis, primeiro precisa de as registar. Utilize uma ferramenta de API como o Postman ou o Thunder Client (extensão do VS Code).

Crie uma requisição POST para o endpoint: http://localhost:3000/api/mesas

No corpo ("Body") da requisição, envie um JSON como este:

```json
{
  "capacidade": 4
}
```

Crie algumas mesas com diferentes capacidades.

**Navegar na Aplicação:**

Aceda a http://localhost:5173 no seu navegador.

Na Página Inicial, as mesas que criou deverão aparecer. Clique em "Reservar" para criar uma nova reserva.

Navegue para a Página de Admin para ver o relatório com o histórico de todas as reservas feitas.
