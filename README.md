
# Sistema de Reserva de Mesas MMTech 

##  Funcionalidades

- **Backend (API RESTful)**
  - `[✅]` Cadastro de novas mesas.
  - `[✅]` Listagem de todas as mesas e de mesas disponíveis.
  - `[✅]` Sistema de reserva com verificação de conflitos de horários para evitar sobreposições.
  - `[✅]` Funcionalidades de Check-in e Check-out para as reservas.
  - `[✅]` Conexão com banco de dados PostgreSQL.

- **Frontend (React App)**
  - `[✅]` Interface reativa construída com React e Vite.
  - `[✅]` Visualização das mesas disponíveis em tempo real.
  - `[✅]` Modal para realizar reservas de forma simples e intuitiva.
  - `[✅]` Comunicação com o backend para obter dados e criar reservas.

##  Tecnologias Utilizadas

| Componente | Tecnologias                                            |
|------------|--------------------------------------------------------|
| **Backend**| Node.js, Express, PostgreSQL, Cors, Dotenv             |
| **Frontend**| React, Vite, Axios                                     |
| **Gestão** | Git, GitHub, NPM                                       |

##  Pré-requisitos

Antes de começar, certifique-se de que tem as seguintes ferramentas instaladas na sua máquina:
- [Node.js](https://nodejs.org/en/) (que inclui o NPM)
- [PostgreSQL](https://www.postgresql.org/download/)

##  Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Clonar o Repositório

```bash
git clone [https://github.com/seu-usuario/Sistema-de-Reserva-de-Mesas-MMTech.git](https://github.com/seu-usuario/Sistema-de-Reserva-de-Mesas-MMTech.git)
cd Sistema-de-Reserva-de-Mesas-MMTech
````

### 2\. Configurar o Backend

1.  **Navegue até à pasta do backend e instale as dependências:**

    ```bash
    cd backend
    npm install
    ```

2.  **Configure o Banco de Dados PostgreSQL:**

      - Certifique-se de que o seu serviço do PostgreSQL está a ser executado.
      - Crie uma base de dados. Ex: `mmtech_reservas`.
      - Execute os seguintes scripts SQL para criar as tabelas necessárias:
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

3.  **Configure as Variáveis de Ambiente:**

      - Na pasta `backend`, crie um ficheiro chamado `.env`.
      - Copie o conteúdo abaixo para o ficheiro `.env` e substitua os valores pelos da sua configuração do PostgreSQL.
        ```env
        # Configuração do Servidor
        PORT=3000

        # Configuração do Banco de Dados PostgreSQL
        DB_HOST=localhost
        DB_PORT=5432
        DB_NAME=seu_banco_de_dados # Ex: mmtech_reservas
        DB_USER=seu_usuario_postgres
        DB_PASSWORD=sua_senha_postgres
        ```

4.  **Execute o servidor do backend:**

    ```bash
    npm run dev
    ```

      - O servidor estará a ser executado em `http://localhost:3000`.

### 3\. Configurar o Frontend

1.  **Abra um novo terminal.** Navegue até à pasta do frontend e instale as dependências:

    ```bash
    cd frontend
    npm install
    ```

2.  **Execute a aplicação frontend:**

    ```bash
    npm run dev
    ```

      - A aplicação React estará disponível no endereço fornecido pelo Vite (geralmente `http://localhost:5173`).

### 4\. Testar a Aplicação

1.  Abra `http://localhost:5173` (ou o endereço do frontend) no seu navegador.
2.  Para que as mesas apareçam, primeiro precisa de as registar. Utilize uma ferramenta como o [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/) para fazer um `POST` para o endpoint do backend:
      - **URL**: `http://localhost:3000/api/mesas`
      - **Body** (raw, JSON):
        ```json
        {
          "capacidade": 4
        }
        ```
      - Crie algumas mesas com diferentes capacidades.
3.  Atualize a página do frontend. As mesas que criou devem aparecer como disponíveis.
4.  Clique no botão "Reservar" de uma mesa, preencha o formulário e confirme a reserva.
5.  A mesa reservada deverá desaparecer da lista de mesas disponíveis, confirmando que o fluxo está a funcionar\!

<!-- end list -->
