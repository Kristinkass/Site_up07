<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require 'config.php'; // Подключение к базе данных

// Запрос для получения общей информации о стране
$locationId = 1; // ID страны
$stmt = $pdo->prepare("SELECT official_name, capital, area_km2, description, official_language, religion FROM Locations WHERE location_id = :location_id");
$stmt->execute(['location_id' => $locationId]);
$locationData = $stmt->fetch(PDO::FETCH_ASSOC);

// Запрос для получения крупных городов
$stmt = $pdo->prepare("SELECT name, photo FROM Cities WHERE country_id = :country_id");
$stmt->execute(['country_id' => $locationId]);
$citiesData = $stmt->fetchAll(PDO::FETCH_ASSOC); // Исправлено: $citiesData вместо $citiesData
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Описание страны</title>
    <style>
        /* Ваши стили */
    </style>
</head>
<body>
    <div class="section">
        <h1 class="section-title">🌍 <?php echo htmlspecialchars($locationData['official_name']); ?></h1>
        <div class="image-gallery">
            <img src="/api/placeholder/400/300" alt="Пейзаж страны">
            <img src="/api/placeholder/400/300" alt="Столица">
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">📋 Общая информация</h2>
        <div class="info-grid">
            <div>
                <h3>Основные данные</h3>
                <table>
                    <tr>
                        <td>Официальное название</td>
                        <td><?php echo htmlspecialchars($locationData['official_name']); ?></td>
                    </tr>
                    <tr>
                        <td>Столица</td>
                        <td><?php echo htmlspecialchars($locationData['capital']); ?></td>
                    </tr>
                    <tr>
                        <td>Площадь</td>
                        <td><?php echo htmlspecialchars($locationData['area_km2']); ?> кв. км</td>
                    </tr>
                    <tr>
                        <td>Население</td>
                        <td><?php echo htmlspecialchars($locationData['description']); ?></td>
                    </tr>
                    <tr>
                        <td>Государственный язык</td>
                        <td><?php echo htmlspecialchars($locationData['official_language']); ?></td>
                    </tr>
                    <tr>
                        <td>Основная религия</td>
                        <td><?php echo htmlspecialchars($locationData['religion']); ?></td>
                    </tr>
                </table>
            </div>
            <div>
                <h3>Крупные города</h3>
                <div class="image-gallery">
                    <?php foreach ($citiesData as $city): ?>
                        <img src="<?php echo htmlspecialchars($city['photo']); ?>" alt="<?php echo htmlspecialchars($city['name']); ?>">
                        <?php echo htmlspecialchars($city['name']); ?><br>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>

    <!-- Остальные разделы (Государственные символы, История, Деятели искусства и т.д.) -->
</body>
</html>