<?php
try {
    $host = '127.0.0.1';
    $port = '3306';
    $user = 'root';
    $pass = '';
    $dbname = 'masari_db';

    // الاتصال بدون تحديد قاعدة بيانات
    $pdo = new PDO("mysql:host=$host;port=$port;charset=utf8mb4", $user, $pass);

    // إنشاء قاعدة البيانات إذا لم تكن موجودة
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "تم إنشاء قاعدة البيانات بنجاح.<br>";

    // إعادة الاتصال مع تحديد القاعدة الجديدة
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $user, $pass);

    // استيراد ملف SQL
    $sql = file_get_contents("masari_db.sql");
    $pdo->exec($sql);

    echo "تم استيراد الجداول والبيانات بنجاح.";
} catch (PDOException $e) {
    echo "فشل في الاتصال أو الاستيراد: " . $e->getMessage();
}
?>