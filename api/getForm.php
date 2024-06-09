<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'ProjectLIIT';
$username = 'root';
$password = '4121';

// Obtener el ID del formulario desde los parámetros de la URL
$formId = $_GET['formId']; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Seleccionar solo los campos necesarios y asegurarse de que el campo 'questions' se maneja como JSON
    $stmt = $pdo->prepare("SELECT title, description, questions FROM forms WHERE form_id = :formId");
    $stmt->bindParam(':formId', $formId);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        // Convertir el campo 'questions' de JSON a un array PHP para que Angular pueda interpretarlo correctamente
        $result['questions'] = json_decode($result['questions'], true);
        echo json_encode($result);
    } else {
        echo json_encode(['message' => 'Formulario no encontrado']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error de conexión: ' . $e->getMessage()]);
}