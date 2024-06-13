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

    // Captura el parámetro 'form_id' de la URL
    $form_id = isset($_GET['form_id']) ? $_GET['form_id'] : null;

    // Construye la consulta SQL con el filtro WHERE si se proporciona form_id
    $sql = 'SELECT answer_id, answer_date, answer_values,ST_AsText(location) as location FROM answers';
    if ($form_id) {
        $sql .= ' WHERE form_id = :form_id';
    }

    $stmt = $pdo->prepare($sql);
    if ($form_id) {
        $stmt->bindParam(':form_id', $form_id);
    }
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
