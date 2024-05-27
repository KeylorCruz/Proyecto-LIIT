<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'ProjectLIIT';
$username = 'root';
$password = '1234';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Construye la consulta SQL
    $sql = 'SELECT answer_id, answer_date, answer_values,ST_AsText(location) as location FROM answers';

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $answers = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row['answer_values'] = json_decode($row['answer_values'], true);
        $answers[] = $row;
    }
    echo json_encode($answers);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error al conectar con la base de datos: ' . $e->getMessage()));
}