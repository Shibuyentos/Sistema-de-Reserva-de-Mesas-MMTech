#  Sistema de Gerenciamento de Mesas – MMTech

Sistema de reserva de mesas para coworking em Node.js + Express com PostgreSQL.  
Permite cadastrar mesas, solicitar reservas, consultar disponibilidade e registrar check-in/check-out de forma simples e eficiente.

---

##  Funcionalidades

### Cadastro de mesas
Descrição: Cadastra uma nova mesa com capacidade e status inicial.  
Método e rota: POST /api/mesas  
Exemplo de corpo: { "capacidade": 4 }

### Listagem de mesas
Descrição: Retorna todas as mesas cadastradas.  
Método e rota: GET /api/mesas

### Consulta de disponibilidade
Descrição: Lista mesas disponíveis entre um início e um fim.  
Método e rota: GET /api/reservas/disponiveis?inicio=2025-09-28T10:00:00Z&fim=2025-09-28T12:00:00Z

### Solicitação de reserva
Descrição: Cria uma reserva informando mesa, finalidade, período e membro.  
Método e rota: POST /api/reservas/reservar  
Exemplo de corpo: { "mesa_id": 1, "finalidade": "Reunião", "data_hora_inicio": "2025-09-28T10:00:00Z", "data_hora_fim": "2025-09-28T12:00:00Z", "membro": "João Silva" }

### Check-in da reserva
Descrição: Marca o horário de check-in de uma reserva existente.  
Método e rota: POST /api/reservas/check_in/:reserva_id

### Check-out da reserva
Descrição: Marca o horário de check-out de uma reserva existente.  
Método e rota: POST /api/reservas/check_out/:reserva_id

### Teste da API
Descrição: Verifica se o servidor está rodando.  
Método e rota: GET /api/teste

---

##  Estrutura do Projeto

```bash
Gerencimento-de-mesas-MMTech
├── backend
│ ├── src
│ │ ├── config
│ │ │ └── database.js
│ │ ├── controllers
│ │ │ ├── MesaController.js
│ │ │ ├── ReservaController.js
│ │ │ └── TesteController.js
│ │ ├── routes
│ │ │ ├── MesaRoutes.js
│ │ │ ├── ReservaRoutes.js
│ │ │ └── TesteRoutes.js
│ │ └── app.js
│ ├── package.json
│ └── server.js
├── .env
├── .env.exemple
├── .gitignore
└── README.md
```

---

##  Tecnologias

Node.js, Express, PostgreSQL, pg, dotenv, cors, nodemon.

---

##  Banco de Dados (tabelas)

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

---

##  Como rodar localmente

Clonar o repositório:  
git clone https://github.com/SEU_USUARIO/Gerencimento-de-mesas-MMTech.git  
cd Gerencimento-de-mesas-MMTech/backend  

Instalar dependências:  
npm install  

Criar e preencher o arquivo .env:  
PORT=3000  
DB_HOST=localhost  
DB_PORT=5432  
DB_NAME=postgres  
DB_USER=postgres  
DB_PASSWORD=sua_senha  

Iniciar o servidor:  
npm run dev  

URL padrão do servidor:  
http://localhost:3000

---

##  Rotas rápidas (cheat sheet)

POST /api/mesas  
GET /api/mesas  
GET /api/reservas/disponiveis?inicio=ISO&fim=ISO  
POST /api/reservas/reservar  
POST /api/reservas/check_in/:reserva_id  
POST /api/reservas/check_out/:reserva_id  
GET /api/teste  
