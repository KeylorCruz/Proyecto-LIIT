<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
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

    // Captura el parámetro 'form_id' de la URL
    $form_id = isset($_GET['form_id']) ? $_GET['form_id'] : null;

    // Construye la consulta SQL con el filtro WHERE si se proporciona form_id
    $sql = 'SELECT title, questions,description FROM forms';
    if ($form_id) {
        $sql .= ' WHERE form_id = :form_id';
    }

    $stmt = $pdo->prepare($sql);
    if ($form_id) {
        $stmt->bindParam(':form_id', $form_id, PDO::PARAM_INT);
    }
    $stmt->execute();

    $formularios = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row['questions'] = json_decode($row['questions'], true); // Decodificar la cadena JSON
        $formularios[] = $row;
    }
    echo json_encode($formularios);
        
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error al conectar con la base de datos: ' . $e->getMessage()));
}