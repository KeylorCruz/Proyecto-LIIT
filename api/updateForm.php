<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// Recibir datos POST desde Angular
$data = json_decode(file_get_contents("php://input"), true);

$host = 'localhost';
$dbname = 'ProjectLIIT';
$username = 'root';
$password = '4121';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


    // Preparar el update en la base de datos
    $stmt = $pdo->prepare('UPDATE forms SET title = :title, description = :description, questions = :questions WHERE form_id = :form_id');
    
    // Vincular parámetros
    $stmt->bindParam(':form_id', $data['form_id']);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':description', $data['description']);
    $stmt->bindParam(':questions', json_encode($data['questions'])); // Convertir el array de preguntas a JSON
    
    // Ejecutar la consulta
    $stmt->execute();

    echo json_encode(array('message' => 'Formulario actualizado con éxito', 'form_id' => $data['form_id']));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error al guardar el formulario: ' . $e->getMessage()));
}
?>
