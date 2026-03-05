# Sistema de Reserva de Mesas - MMTech Coworking

![Logo da MMTech](frontend/src/assets/logo.png)

> Este sistema tem como objetivo permitir que os membros de um espaço de coworking reservem mesas conforme necessário. O projeto foi desenvolvido como um teste de desenvolvimento, abrangendo desde a criação do backend e frontend até à implementação de funcionalidades complexas como autenticação e gestão em tempo real.
> Este sistema tem como objetivo permitir que os membros de um espaço de coworking reservem mesas conforme necessário. O projeto foi desenvolvido como um teste de desenvolvimento, abrangendo desde a criação do backend e frontend até à implementação de funcionalidades complexas como autenticação e gestão em tempo real.

---

## Funcionalidades Principais

-   **Visualização de Mesas:** Interface principal que exibe todas as mesas com o seu status em tempo real (Disponível / Ocupada).
-   **Sistema de Autenticação Completo:**
    -   Registo e Login de utilizadores com senhas encriptadas.
    -   Autenticação baseada em tokens JWT (JSON Web Tokens) para segurança.
    -   Distinção de perfis: `membro` e `admin`.
-   **Reserva de Mesas:** Membros autenticados podem reservar mesas disponíveis com data, horário e finalidade através de um modal intuitivo.
-   **Portal do Membro ("Minhas Reservas"):**
    -   Página dedicada onde os membros podem ver o seu histórico de reservas.
    -   Funcionalidade de **Check-in** e **Check-out** gerida pelo próprio utilizador.
-   **Painel de Administração:**
    -   Página protegida e acessível apenas por administradores.
    -   Visualização completa do histórico de todas as reservas para rastreamento e geração de relatórios.
    -   Ferramentas para registar novas mesas e gerir o check-in/check-out de qualquer reserva.
-   **Interface Moderna e Responsiva:** Foco em UX/UI para garantir que a interface seja fácil de usar, com animações suaves, tooltips informativos e um design que se adapta a diferentes tamanhos de ecrã.

---

## Tecnologias Utilizadas

#### **Backend**

-   **Node.js**
-   **Express.js**
-   **SQLite** (com a biblioteca `better-sqlite3`)
-   **JWT (JSON Web Token)** para autenticação
-   **Bcrypt.js** para encriptação de senhas

#### **Frontend**
- **React** (Vite)
- **React Router** para gerenciamento de rotas
- **React Context API** para estado global (Autenticação e Notificações)
- **Axios** para requisições à API
- **React Feather** para ícones
- **CSS3** com Variáveis para estilização

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

-   **Node.js** (versão 18 ou superior)
-   **npm** (geralmente instalado com o Node.js)

> Não é necessário instalar nenhum banco de dados. O SQLite cria o ficheiro `database.db` automaticamente ao iniciar o servidor.

### 1. Backend

```bash
cd backend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor ficará disponível em **http://localhost:3000**.
O ficheiro `backend/database.db` será criado automaticamente com todas as tabelas na primeira execução.

> **Opcional:** crie um ficheiro `.env` dentro de `backend/` para definir um segredo JWT personalizado:
> ```
> JWT_SECRET=um_segredo_muito_forte
> ```
> Se omitido, o sistema usará um valor padrão de desenvolvimento.

### 2. Frontend

```bash
cd ../frontend
npm install
npm run dev
```

A aplicação ficará acessível em **http://localhost:5173**.

---

## 🏛️ Arquitetura

O sistema segue uma **arquitetura Cliente-Servidor** desacoplada:

-   **Cliente (Frontend):** SPA construída em **React**, responsável pela interface e comunicação com o backend.
-   **Servidor (Backend):** API RESTful em **Node.js/Express**, responsável pela lógica de negócio, autenticação e acesso à base de dados.
-   **Base de Dados:** **SQLite** — ficheiro local `backend/database.db`, sem necessidade de servidor de banco de dados externo.
-   **Comunicação:** Requisições HTTP com dados em JSON. Segurança das rotas protegidas garantida por Tokens JWT no header `Authorization`.

### Modelo de Dados (MER)

Três entidades principais:

-   `usuarios`: membros e administradores.
-   `mesas`: informações de cada mesa do coworking.
-   `reservas`: conecta um utilizador e uma mesa para um determinado período.

**Relacionamentos:**
-   Um `usuario` pode ter **várias** `reservas`.
-   Uma `mesa` pode ter **várias** `reservas` (desde que os horários não se sobreponham).
-   Cada `reserva` pertence a **um** `membro` e a **uma** `mesa`.

---

## Autor
**Kauann Shibuya**

-   GitHub: [@Shibuyentos](https://github.com/Shibuyentos)
-   *Este projeto foi desenvolvido com a assistência de Wesley Godoy.*
