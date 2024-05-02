<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Recibir datos POST desde Angular
$data = json_decode(file_get_contents("php://input"), true);

$host = 'localhost';
$dbname = 'ProjectLIIT';
$username = 'root';
$password = '4121';

function generateUniqueFormId($pdo, $length = 8) {
    do {
        $bytes = random_bytes((int) ceil($length / 2));
        $id = bin2hex($bytes);
        $form_id = substr($id, 0, $length);
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM Forms WHERE form_id = :form_id");
        $stmt->bindParam(':form_id', $form_id);
        $stmt->execute();
    } while ($stmt->fetchColumn() > 0);
    return $form_id;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Generar un ID aleatorio de 8 dígitos para el nuevo formulario
    $form_id = generateUniqueFormId($pdo);
    
    // Obtener la fecha y hora actual
    $creation_date = date('Y-m-d H:i:s');

    // Preparar la inserción en la base de datos
    $stmt = $pdo->prepare('INSERT INTO Forms (form_id, title, description, creation_date, questions) VALUES (:form_id, :title, :description, :creation_date, :questions)');
    
    // Vincular parámetros
    $stmt->bindParam(':form_id', $form_id);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':description', $data['description']);
    $stmt->bindParam(':creation_date', $creation_date);
    $stmt->bindParam(':questions', json_encode($data['questions'])); // Convertir el array de preguntas a JSON
    
    // Ejecutar la consulta
    $stmt->execute();

    echo json_encode(array('message' => 'Formulario guardado con éxito', 'form_id' => $form_id));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error al guardar el formulario: ' . $e->getMessage()));
}
?>
