<?php
// registrazione di un nuovo utente: errorCode dice al frontend cosa è andato storto
// (1 = campo vuoto, 2 = username già in uso, 3 = password diverse, 4 = username troppo lungo)
require_once 'DbConnector.php';

$errorCode = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $registerData = json_decode(file_get_contents('php://input'), true) ?? [];

    // leggo i tre campi (se mancano li considero vuoti)
    $username = trim($registerData['username'] ?? '');
    $password = $registerData['password'] ?? '';
    $password2 = $registerData['password2'] ?? '';

    // controllo che nessuno dei tre campi sia vuoto
    if (strlen($username) === 0 || strlen($password) === 0 || strlen($password2) === 0) {
        $errorCode = '1';
    } elseif (mb_strlen($username) > 30) {
        // nel database username è varchar(30)
        $errorCode = '4';
    }

    if (!$errorCode) {
        $connection = new DbConnector('localhost', 'root', 'root', 'esame_demattei');
        // controllo che lo username non sia già usato da qualcun altro
        $statement = $connection->prepare('SELECT * FROM users WHERE users.username = :username');
        $statement->bindParam(':username', $username);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);

        if (!empty($result)) {
            $errorCode = '2';
        } elseif ($password !== $password2) {
            $errorCode = '3';
        } else {
            // hasho la password prima di salvarla, così login.php (password_verify) la riconosce
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // nuovo utente: parte sempre con ruolo "Utente" (Moderatore/SuperAdmin si assegnano a mano dal DB)
            $statement = $connection->prepare(
                "INSERT INTO users (username, password, role) VALUES (:username, :password, 'Utente')"
            );
            $statement->bindParam(':username', $username);
            $statement->bindParam(':password', $hashedPassword);
            $statement->execute();
        }
    }
}

// rispondo sempre in JSON
header('Content-Type: application/json; charset=UTF-8');
echo json_encode(["errorCode" => $errorCode]);
