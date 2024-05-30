<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
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
    $form_id = $data['form_id'];//isset($_POST['form_id']) ? $_POST['form_id'] : null;
    $answer_values = json_encode($data['answer_values']);//isset($_POST['answer_values']) ? json_decode($_POST['answer_values'], true) : null; // Ensures it's an associative array
    $lat = $data['lat'];
    $lng = $data['lng'];

    // Maneja datos faltantes o inválidos
    if (!$form_id) {
        http_response_code(400);
        echo json_encode(array('message' => 'Missing required parameter: form_id'));
        exit;
    } else if (!$answer_values) {
        http_response_code(400); 
        echo json_encode(array('message' => 'Missing required parameter: answer_values'));
        exit;
    } else if (!$lat) {
        http_response_code(400); 
        echo json_encode(array('message' => 'Missing required parameter: lat'));
        exit;
    } else if (!$lng) {
        http_response_code(400); 
        echo json_encode(array('message' => 'Missing required parameter: lng'));
        exit;
    }
    
    $sql = 'SELECT insert_answer( :form_id, :answer_values, :lat, :lng ) AS answer_id';
    $stmt = $pdo->prepare($sql);

    // Enlaza parámetros de forma segura para prevenir la inyección SQL
    $stmt->bindParam(':form_id', $form_id, PDO::PARAM_STR); 
    $stmt->bindParam(':answer_values', $answer_values, PDO::PARAM_STR); 
    $stmt->bindParam(':lat', $lat, PDO::PARAM_STR);
    $stmt->bindParam(':lng', $lng, PDO::PARAM_STR);
    
    $stmt->execute();

    $last_id = $pdo->lastInsertId();
    echo ('Answer inserted successfully!' + $last_id);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error inserting answer: ' . $e->getMessage()));
}