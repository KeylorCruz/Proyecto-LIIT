<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'ProjectLIIT';
$username = 'root';
$password = '4121';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Captura el parámetro 'form_id' de la URL
    $form_id = isset($_GET['form_id']) ? $_GET['form_id'] : null;

    if ($form_id) {
        // Llamar al procedimiento almacenado get_answers_locations
        $stmt = $pdo->prepare('CALL get_answers_locations(:form_id)');
        $stmt->bindParam(':form_id', $form_id, PDO::PARAM_STR);
        $stmt->execute();

        $answers = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $answers[] = $row;
        }

        echo json_encode($answers);
    } else {
        echo json_encode(array('message' => 'No form_id provided'));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error al conectar con la base de datos: ' . $e->getMessage()));
}
