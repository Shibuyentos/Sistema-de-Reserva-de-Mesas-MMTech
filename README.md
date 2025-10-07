# Sistema de Reserva de Mesas - MMTech Coworking

![Logo da MMTech](frontend/src/assets/logo.png)

> [cite_start]Este sistema tem como objetivo permitir que os membros de um espaço de coworking reservem mesas conforme necessário[cite: 9]. O projeto foi desenvolvido como um teste de desenvolvimento, abrangendo desde a criação do backend e frontend até à implementação de funcionalidades complexas como autenticação e gestão em tempo real.

---

## ✨ Funcionalidades Principais

-   **Visualização de Mesas:** Interface principal que exibe todas as mesas com o seu status em tempo real (Disponível / Ocupada).
-   **Sistema de Autenticação Completo:**
    -   [cite_start]Registo e Login de utilizadores com senhas encriptadas[cite: 33].
    -   Autenticação baseada em tokens JWT (JSON Web Tokens) para segurança.
    -   Distinção de perfis: `membro` e `admin`.
-   [cite_start]**Reserva de Mesas:** Membros autenticados podem reservar mesas disponíveis com data, horário e finalidade através de um modal intuitivo[cite: 19].
-   **Portal do Membro ("Minhas Reservas"):**
    -   Página dedicada onde os membros podem ver o seu histórico de reservas.
    -   [cite_start]Funcionalidade de **Check-in** e **Check-out** gerida pelo próprio utilizador[cite: 24].
-   **Painel de Administração:**
    -   Página protegida e acessível apenas por administradores.
    -   [cite_start]Visualização completa do histórico de todas as reservas para rastreamento e geração de relatórios[cite: 26].
    -   [cite_start]Ferramentas para registar novas mesas [cite: 15] e gerir o check-in/check-out de qualquer reserva.
-   [cite_start]**Interface Moderna e Responsiva:** Foco em UX/UI para garantir que a interface seja fácil de usar[cite: 30], com animações suaves, tooltips informativos e um design que se adapta a diferentes tamanhos de ecrã.

---

## 🛠️ Tecnologias Utilizadas

#### **Backend**

-   **Node.js**
-   **Express.js**
-   **PostgreSQL** (com a biblioteca `pg`)
-   **JWT (JSON Web Token)** para autenticação
-   **Bcrypt.js** para encriptação de senhas
-   **Dotenv** para gestão de variáveis de ambiente

#### **Frontend**

-   **React** (com Vite)
-   **React Router** para gestão de rotas
-   **React Context API** para gestão de estado global (autenticação)
-   **Axios** para as requisições à API
-   **React Feather** para os ícones
-   **CSS3** com Variáveis para estilização

---

## 🚀 Como Executar o Projeto Localmente

[cite_start]Siga os passos abaixo para configurar e executar o projeto no seu ambiente de desenvolvimento[cite: 10].

### Pré-requisitos

-   **Node.js** (versão 18 ou superior)
-   **npm** (geralmente instalado com o Node.js)
-   **PostgreSQL** instalado e a rodar na sua máquina.

### 1. Configuração da Base de Dados

Antes de iniciar o backend, crie uma base de dados no PostgreSQL (ex: `mmtech_reservas`) e execute as seguintes queries para criar as tabelas necessárias:

```sql
-- Tabela para os utilizadores
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) DEFAULT 'membro' NOT NULL, -- pode ser 'membro' ou 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para as mesas
CREATE TABLE mesas (
    id SERIAL PRIMARY KEY,
    capacidade INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'disponível' NOT NULL
);

-- Tabela para as reservas
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    mesa_id INTEGER NOT NULL REFERENCES mesas(id),
    membro VARCHAR(100) NOT NULL,
    finalidade VARCHAR(255),
    data_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_hora_fim TIMESTAMP WITH TIME ZONE NOT NULL,
    check_in_at TIMESTAMP WITH TIME ZONE,
    check_out_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Configuração do Backend

```bash
# 1. Navegue para a pasta do backend
cd backend

# 2. Crie um ficheiro .env na raiz da pasta 'backend' e adicione as suas variáveis de ambiente:
# Exemplo de .env:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=seu_banco_de_dados
DB_USER=seu_utilizador
DB_PASSWORD=sua_senha
JWT_SECRET=um_segredo_muito_forte_para_o_jwt

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev

# O servidor backend estará a rodar em http://localhost:3000
```

### 3. Configuração do Frontend

```bash
# 1. A partir da raiz do projeto, navegue para a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie a aplicação de desenvolvimento
npm run dev

# A aplicação frontend estará acessível em http://localhost:5173 (ou outra porta indicada pelo Vite)
```

---

## [cite_start]🏛️ Diagramas e Arquitetura [cite: 45]

[cite_start]Conforme solicitado[cite: 45], aqui estão as descrições da arquitetura e do modelo de dados.

### Arquitetura do Sistema

O sistema segue uma **arquitetura Cliente-Servidor** desacoplada:

-   **Cliente (Frontend):** Uma Single-Page Application (SPA) construída em **React**. É responsável por toda a interface do utilizador, pela gestão do estado da UI e pela comunicação com o backend.
-   **Servidor (Backend):** Uma API RESTful construída em **Node.js/Express**. É responsável por toda a lógica de negócio, interações com a base de dados e pela segurança/autenticação.
-   **Base de Dados:** Um sistema **PostgreSQL** que armazena os dados de forma persistente.
-   **Comunicação:** A comunicação entre o cliente e o servidor é feita através de requisições HTTP (GET, POST, etc.), com dados transacionados no formato JSON. A segurança das rotas é garantida por Tokens JWT enviados no header `Authorization`.

### [cite_start]Modelo de Entidade e Relacionamento (MER) [cite: 45]

O modelo de dados baseia-se em três entidades principais:

-   `usuarios`: Armazena os dados dos membros e administradores.
-   `mesas`: Armazena as informações de cada mesa do coworking.
-   `reservas`: Tabela central que conecta um `usuario` e uma `mesa` para um determinado período.

**Relacionamentos:**
-   Um `usuario` pode ter **várias** `reservas`.
-   Uma `mesa` pode ter **várias** `reservas` (desde que os horários não se sobreponham).
-   Cada `reserva` pertence a **um** `membro` (guardado pelo nome) e a **uma** `mesa`.

---

## ✍️ Autor

**Kauann Shibuya**

-   GitHub: [@Shibuyentos](https://github.com/Shibuyentos)
-   *Este projeto foi desenvolvido com a assistência de Wesley Godoy.*