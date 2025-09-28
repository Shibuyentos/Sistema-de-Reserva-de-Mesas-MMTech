# Sistema de Gerenciamento de Mesas – MMTech

Sistema de reserva de mesas para coworking em **Node.js + Express com PostgreSQL**.  
Permite cadastrar mesas, solicitar reservas, consultar disponibilidade e registrar check-in/check-out de forma simples e eficiente.

---

## Funcionalidades

### Cadastro de mesas
- **Descrição:** Cadastra uma nova mesa com capacidade e status inicial.  
- **Rota:** `POST /api/mesas`  
- **Exemplo corpo:**  
```json
{ "capacidade": 4 }
```

### Listagem de mesas
- **Descrição:** Retorna todas as mesas cadastradas.  
- **Rota:** `GET /api/mesas`

### Consulta de disponibilidade
- **Descrição:** Lista mesas disponíveis entre um início e um fim.  
- **Rota:**  
```
GET /api/reservas/disponiveis?inicio=2025-09-28T10:00:00Z&fim=2025-09-28T12:00:00Z
```

### Solicitação de reserva
- **Descrição:** Cria uma reserva informando mesa, finalidade, período e membro.  
- **Rota:** `POST /api/reservas/reservar`  
- **Exemplo corpo:**  
```json
{ 
  "mesa_id": 1, 
  "finalidade": "Reunião", 
  "data_hora_inicio": "2025-09-28T10:00:00Z", 
  "data_hora_fim": "2025-09-28T12:00:00Z", 
  "membro": "João Silva" 
}
```

### Check-in da reserva
- **Descrição:** Marca o horário de check-in de uma reserva existente.  
- **Rota:** `POST /api/reservas/check_in/:reserva_id`

### Check-out da reserva
- **Descrição:** Marca o horário de check-out de uma reserva existente.  
- **Rota:** `POST /api/reservas/check_out/:reserva_id`

### Teste da API
- **Descrição:** Verifica se o servidor está rodando.  
- **Rota:** `GET /` (raiz)

---

## Estrutura do Projeto

```bash
Gerenciamento-de-mesas-MMTech
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── database.js
│   │   ├── controllers
│   │   │   ├── MesaController.js
│   │   │   └── ReservaController.js
│   │   ├── routes
│   │   │   ├── MesaRoutes.js
│   │   │   └── ReservaRoutes.js
│   │   └── app.js
│   ├── package.json
│   └── server.js
├── .env.example
├── .gitignore
└── README.md
```

---

## Tecnologias

- Node.js  
- Express  
- PostgreSQL  
- pg  
- dotenv  
- cors  
- nodemon  

---

## Banco de Dados (tabelas)

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

## 🖥 Como rodar localmente

1. **Clonar o repositório**  
```bash
git clone https://github.com/SEU_USUARIO/Gerenciamento-de-mesas-MMTech.git
cd Gerenciamento-de-mesas-MMTech/backend
```

2. **Instalar dependências**  
```bash
npm install
```

3. **Configurar variáveis de ambiente**  
Crie o arquivo `.env` na pasta `backend` (baseado no `.env.example`):  
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=sua_senha
```

4. **Criar tabelas no PostgreSQL**  
Execute no banco as queries do tópico [Banco de Dados](#-banco-de-dados-tabelas).

5. **Iniciar o servidor**  
```bash
npm run dev
```

6. **Acessar servidor**  
[http://localhost:3000](http://localhost:3000)

---

## Rotas rápidas (cheat sheet)

- `POST /api/mesas`  
- `GET /api/mesas`  
- `GET /api/reservas/disponiveis?inicio=ISO&fim=ISO`  
- `POST /api/reservas/reservar`  
- `POST /api/reservas/check_in/:reserva_id`  
- `POST /api/reservas/check_out/:reserva_id`  
- `GET /` (teste do servidor)

---

## Observações

- O arquivo `.env.example` serve apenas como modelo, não é lido pelo Node.  
- A rota de teste é a raiz `/` (não existe `/api/teste`).  
- As tabelas precisam estar criadas antes de usar as rotas de reserva.  
