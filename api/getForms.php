<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'ProjectLIIT';
$username = 'root';
$password = '4121';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Modificar la consulta para seleccionar solo form_id y title
    $stmt = $pdo->query('SELECT form_id, title FROM Forms');
    $formularios = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $formularios[] = $row;
    }

    echo json_encode($formularios);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error al conectar con la base de datos: ' . $e->getMessage()));
}
?>
