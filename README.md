# Sistema de Reserva de Mesas - MMTech Coworking

![Logo da MMTech](frontend/src/assets/logo.png)

> Este sistema tem como objetivo permitir que os membros de um espaço de coworking reservem mesas conforme necessário. O projeto foi desenvolvido como um teste de desenvolvimento, abrangendo desde a criação do backend e frontend até à implementação de funcionalidades complexas como autenticação e gestão em tempo real.

---

## Funcionalidades Principais

- **Visualização de Mesas:** Interface principal que exibe todas as mesas com o seu status em tempo real (Disponível / Ocupada).
- **Sistema de Autenticação Completo:**
    - Registro e Login de usuários com senhas criptografadas.
    - Autenticação baseada em tokens JWT (JSON Web Tokens) para segurança.
    - Distinção de perfis: `membro` e `admin`.
- **Reserva de Mesas:** Membros autenticados podem reservar mesas disponíveis com data, horário e finalidade através de um modal intuitivo.
- **Portal do Membro ("Minhas Reservas"):**
    - Página dedicada onde os membros podem ver o seu histórico de reservas.
    - Funcionalidade de **Check-in** e **Check-out** gerenciada pelo próprio usuário.
- **Painel de Administração:**
    - Página protegida e acessível apenas por administradores.
    - Visualização completa do histórico de todas as reservas para rastreamento e geração de relatórios.
    - Ferramentas para registrar novas mesas e gerir o check-in/check-out de qualquer reserva.
- **Interface Moderna e Responsiva:** Foco em UX/UI para garantir que a interface seja fácil de usar, com animações suaves, notificações Toast e um design que se adapta a diferentes tamanhos de tela.

---

## Tecnologias Utilizadas

#### **Backend**
- **Node.js** com **Express.js**
- **Prisma ORM** para modelagem e acesso ao banco de dados
- **PostgreSQL** rodando via **Docker**
- **JWT (JSON Web Token)** para autenticação
- **Bcrypt.js** para criptografia de senhas
- **Dotenv** para gerenciamento de variáveis de ambiente

#### **Frontend**
- **React** (Vite)
- **React Router** para gerenciamento de rotas
- **React Context API** para estado global (Autenticação e Notificações)
- **Axios** para requisições à API
- **React Feather** para ícones
- **CSS3** com Variáveis para estilização

---

## Como Executar o Projeto Localmente

O projeto agora conta com **Docker** para facilitação do ambiente de banco de dados e **Prisma** para gerenciamento do esquema.

### Pré-requisitos
- **Node.js** (v18+)
- **Docker** e **Docker Compose**
- **npm**

### 1. Configuração do Ambiente
```bash
# Clone o repositório e entre na pasta
cd Sistema-de-Reserva-de-Mesas-MMTech

# Copie o arquivo de variáveis de ambiente
cp .env.example .env

# O arquivo .env já vem configurado para o banco Docker (porta 5433).
# Se necessário, ajuste o JWT_SECRET no arquivo .env
```

### 2. Iniciar o Banco de Dados (Docker)
```bash
# Sobe o container do PostgreSQL em background
docker-compose up -d
```

### 3. Configurar o Backend e Banco de Dados (Prisma)
```bash
cd backend
npm install

# Aplica as migrações (cria as tabelas no banco Docker)
npx prisma migrate dev --name init

# Inicia o servidor
npm run dev
```
O servidor backend estará rodando em `http://localhost:3000`.

### 4. Iniciar o Frontend
```bash
cd ../frontend
npm install
npm run dev
```
A aplicação estará acessível em `http://localhost:5173`.

---

## Diagramas e Arquitetura

### Arquitetura do Sistema
O sistema segue uma **arquitetura Cliente-Servidor** desacoplada:
- **Cliente (Frontend):** SPA construída em React com Context API para autenticação e notificações Toast.
- **Servidor (Backend):** API RESTful em Node.js utilizando Prisma ORM para uma comunicação segura e tipos de dados consistentes com o PostgreSQL.
- **Base de Dados:** Instância PostgreSQL containerizada via Docker.

### Modelo de Dados (Prisma)
- `Usuario`: Dados de membros e administradores.
- `Mesa`: Cadastros das mesas disponíveis.
- `Reserva`: Vincula um usuário a uma mesa em um período específico, controlando check-in e check-out.

---

## Autor
**Kauann Shibuya**
- GitHub: [@Shibuyentos](https://github.com/Shibuyentos)
- *Assistência de Wesley Godoy.*