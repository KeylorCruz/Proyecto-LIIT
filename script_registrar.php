<?php
//Script hecho para ejecutar manualmente con PHP CLI
$host = 'localhost';
$dbname = 'ProjectLIIT';
$username = 'root';
$password = '4121';

//Cambiar segun los datos del usuario que se desea agregar
$user_id = 2020186460;
$password = 'contraseña1';
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (user_id, password) VALUES (?, ?)");
    $stmt->execute([$user_id, $hashed_pass]);

    if ($stmt->rowCount() > 0) {
        echo "Usuario creado con éxito.";
    } else {
        echo "Error al crear usuario.";
    }
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    $conn = null;
}
?>
