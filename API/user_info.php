<?php
// dice all'app chi sono: dal token ricavo l'id dell'utente e restituisco id, username e ruolo
// carico la classe dei token e la connessione al database
require_once 'TokenManager.php';
require_once 'DbConnector.php';

// rispondo sempre in JSON
header('Content-Type: application/json; charset=UTF-8');

// leggo gli header della richiesta (in minuscolo così "Authorization" e "authorization" sono uguali)
$headers = array_change_key_case(getallheaders(), CASE_LOWER);

if (!empty($headers['authorization'])) {
    // l'header è "Bearer <token>": prendo solo la seconda parte
    $token = explode(' ', $headers['authorization'])[1] ?? '';
    $tokenManager = new TokenManager();
    // se la firma non torna o il token è scaduto mi fermo qui
    if (!$tokenManager->validate($token)) {
        http_response_code(401);
        echo json_encode(["Error" => "Invalid Token"]);
        exit;
    }
    // il token è valido: ricavo l'id dell'utente che sta facendo la richiesta
    $userId = $tokenManager->extractID($token);
} else {
    http_response_code(401);
    echo json_encode(["Error" => "No Token Provided"]);
    exit;
}

$dbConnector = new DbConnector('localhost', 'root', 'root', 'esame_demattei');
$statement = $dbConnector->prepare('SELECT id, username, role FROM users WHERE id = :userId;');
$statement->bindParam(':userId', $userId);
$statement->execute();
$result = $statement->fetch(PDO::FETCH_ASSOC);

if ($result) {
    http_response_code(200);
    echo json_encode([
        // (int) perché PDO restituirebbe l'id come stringa
        'user_id' => (int)$result['id'],
        'username' => $result['username'],
        'role' => $result['role'],
    ]);
} else {
    http_response_code(404);
    echo json_encode(["Error" => "User not found"]);
}
