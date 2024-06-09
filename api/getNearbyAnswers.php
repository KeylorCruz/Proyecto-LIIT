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

    // Captura los parámetros 'p_latitude', 'p_longitude' y 'p_distance' de la URL
    $p_latitude = isset($_GET['p_latitude']) ? floatval($_GET['p_latitude']) : null;
    $p_longitude = isset($_GET['p_longitude']) ? floatval($_GET['p_longitude']) : null;
    $p_distance = isset($_GET['p_distance']) ? intval($_GET['p_distance']) : null;

    if ($p_latitude !== null && $p_longitude !== null && $p_distance !== null) {
        // Llamar al procedimiento almacenado get_nearby_answers
        $stmt = $pdo->prepare('CALL get_nearby_answers(:p_latitude, :p_longitude, :p_distance)');
        $stmt->bindParam(':p_latitude', $p_latitude, PDO::PARAM_STR);
        $stmt->bindParam(':p_longitude', $p_longitude, PDO::PARAM_STR);
        $stmt->bindParam(':p_distance', $p_distance, PDO::PARAM_INT);
        $stmt->execute();

        $answers = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $answers[] = $row;
        }

        echo json_encode($answers);
    } else {
        echo json_encode(array('message' => 'Missing or invalid parameters'));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('message' => 'Error al conectar con la base de datos: ' . $e->getMessage()));
}
