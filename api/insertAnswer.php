<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$host = 'localhost';
$dbname = 'ProjectLIIT';
$username = 'root';
$password = '4121';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Captura parámetros: form_id, answer_values (JSON) y ubicación
    $form_id = $data['form_id'];
    $answer_values = json_encode($data['answer_values']);
    $lat = $data['lat'];
    $lng = $data['lng'];

    // Maneja datos faltantes o inválidos
    if (!$form_id || !$answer_values || !$lat || !$lng) {
        http_response_code(400);
        echo json_encode(array('message' => 'Missing required parameters'));
        exit;
    }

    // SQL para insertar respuesta
    $sql = 'INSERT INTO answers (form_id, answer_values, location) VALUES (:form_id, :answer_values, ST_PointFromText(:location, 4326))';
    $stmt = $pdo->prepare($sql);

    // Enlaza parámetros de forma segura para prevenir la inyección SQL
    $stmt->bindParam(':form_id', $form_id, PDO::PARAM_STR);
    $stmt->bindParam(':answer_values', $answer_values, PDO::PARAM_STR);
    $location = "POINT($lat $lng)";
    $stmt->bindParam(':location', $location, PDO::PARAM_STR);

    $stmt->execute();

    // Obtener el último ID insertado
    $last_id = $pdo->lastInsertId();
    http_response_code(200);
    echo json_encode(array('message' => 'Answer inserted successfully!', 'answer_id' => $last_id));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error inserting answer: ' . $e->getMessage()));
}
