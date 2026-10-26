-- Database dell'esame: contiene solo la tabella users
-- Importalo da phpMyAdmin (scheda "Importa") oppure incollalo nella scheda "SQL"

CREATE DATABASE IF NOT EXISTS esame_demattei
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE esame_demattei;

-- tabella degli utenti (stessa struttura della foto)
CREATE TABLE IF NOT EXISTS users (
  id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(30)  NOT NULL,
  password VARCHAR(60)  NOT NULL,                                   -- 60 caratteri = lunghezza dell'hash di password_hash()
  role     ENUM('Utente', 'Moderatore', 'SuperAdmin', '') NOT NULL, -- i nuovi utenti partono sempre come 'Utente'
  PRIMARY KEY (id),
  UNIQUE KEY username (username)                                    -- non possono esistere due utenti con lo stesso username
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
