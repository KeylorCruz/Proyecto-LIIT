<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$form_id = $data['form_id'];

$host = 'localhost';
$dbname = 'ProjectLIIT';
$username = 'root';
$password = '4121';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("DELETE FROM forms WHERE form_id = :form_id");
    $stmt->bindParam(':form_id', $form_id);
    $stmt->execute();

    echo json_encode(array('message' => 'Formulario eliminado con éxito', $form_id));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error al eliminar el formulario: ' . $e->getMessage()));
}
?>
