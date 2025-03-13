<?php
$host = '127.0.0.1'; // Хост базы данных
$user = 'root'; // Имя пользователя базы данных
$password = 'Cstud161620'; // Пароль пользователя базы данных
$database = 'site'; // Имя базы данных

try {
    // Подключение к базе данных
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}
?>