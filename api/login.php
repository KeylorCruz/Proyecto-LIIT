<?php
header('Access-Control-Allow-Origin: http://localhost:4200');
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

    $stmt = $pdo->prepare('SELECT password FROM users WHERE user_id = :user_id');
    
    // Vincular parámetros
    $stmt->bindParam(':user_id', $data['user_id'], PDO::PARAM_INT);
    
    // Ejecutar la consulta
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $hashed_password = $result['password'];

        // Verificar la contraseña
        if (password_verify($data['password'], $hashed_password)) {
            echo json_encode(array('success' => true, 'message' => "¡Bienvenido!"));
        } else {
            echo json_encode(array('success' => false, 'message' => "Usuario o contraseña incorrectos."));
        }
    } else {
        echo json_encode(array('success' => false, 'message' => "Usuario no encontrado."));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array('success' => false, 'message' => "Error en la base de datos: " . $e->getMessage()));
}
?>
