<?php
// db_connection.php

$db_host = '127.0.0.1';         // استخدم IP المحلي بدل "localhost"
$db_name = 'masari_db';
$db_user = 'root';
$db_pass = '';
$charset = 'utf8mb4';

// DSN
$dsn = "mysql:host=$db_host;port=3306;dbname=$db_name;charset=$charset";

// خيارات الاتصال
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// الاتصال
try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
} catch (\PDOException $e) {
    error_log("PDO Connection Error: " . $e->getMessage());
    die("عذراً، حدث خطأ فني أثناء محاولة الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بالدعم الفني.");
}
?>