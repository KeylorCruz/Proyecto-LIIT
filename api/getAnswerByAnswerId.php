<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

$host = 'localhost';
$dbname = 'ProjectLIIT';
$username = 'root';
$password = '4121';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Captura el parámetro 'answer_id' de la URL
    $answer_id = isset($_GET['answer_id']) ? $_GET['answer_id'] : null;

    if (!$answer_id) {
        http_response_code(400); // Bad Request
        echo json_encode(array('message' => 'El parámetro answer_id es obligatorio'));
        exit;
    }

    // Consulta SQL para obtener una respuesta específica
    $sql = 'SELECT answer_id, answer_date, answer_values, ST_AsText(location) as location
            FROM answers
            WHERE answer_id = :answer_id';

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':answer_id', $answer_id, PDO::PARAM_INT);
    $stmt->execute();

    $answer = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($answer) {
        $answer['answer_values'] = json_decode($answer['answer_values'], true); // Decodificar JSON
        echo json_encode($answer);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(array('message' => 'No se encontró la respuesta con el ID proporcionado'));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error al conectar con la base de datos: ' . $e->getMessage()));
}