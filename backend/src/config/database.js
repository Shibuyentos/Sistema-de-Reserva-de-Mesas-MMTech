const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    perfil TEXT NOT NULL DEFAULT 'membro'
  );

  CREATE TABLE IF NOT EXISTS mesas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    capacidade INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'disponível'
  );

  CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mesa_id INTEGER NOT NULL,
    membro TEXT NOT NULL,
    finalidade TEXT NOT NULL,
    data_hora_inicio TEXT NOT NULL,
    data_hora_fim TEXT NOT NULL,
    check_in_at TEXT,
    check_out_at TEXT,
    FOREIGN KEY (mesa_id) REFERENCES mesas(id)
  );
`);

console.log('✅ Conectado ao SQLite em:', dbPath);

module.exports = db;
