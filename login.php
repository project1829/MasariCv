<?php
// login.php

// بدء أو استئناف الجلسة لتخزين معلومات المستخدم بعد الدخول
session_start();

// إذا كان المستخدم مسجل دخوله بالفعل، قم بتوجيهه إلى لوحة التحكم
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit; // إنهاء التنفيذ فوراً بعد التوجيه
}

// --- تضمين ملف الاتصال بقاعدة البيانات ---
// هذا السطر يجلب الكود من db_connection.php وينفذه.
// إذا تم الاتصال بنجاح في db_connection.php، سيصبح المتغير $pdo متاحاً هنا.
// إذا فشل الاتصال في db_connection.php، سيتوقف التنفيذ هناك (بسبب die()).
require_once 'db_connection.php';

$errors = []; // مصفوفة لتخزين رسائل الأخطاء
$email = ''; // متغير لتذكر البريد الإلكتروني المدخل في حالة الخطأ

// عرض رسالة النجاح القادمة من صفحة التسجيل (إذا وجدت)
$success_message = '';
if (isset($_SESSION['success_message'])) {
    $success_message = $_SESSION['success_message'];
    unset($_SESSION['success_message']); // حذف الرسالة بعد عرضها مرة واحدة
}

// التحقق مما إذا كان النموذج قد تم إرساله باستخدام طريقة POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // --- استلام وتنقية البيانات المدخلة ---
    // استخدام filter_input لتنقية البريد الإلكتروني
    $email = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
    // استلام كلمة المرور كما هي (بدون تنقية HTML/JS)
    $password = $_POST['password'] ?? '';

    // --- التحقق المبدئي من صحة البيانات ---
    if (empty($email)) {
        $errors['email'] = 'حقل البريد الإلكتروني مطلوب.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'صيغة البريد الإلكتروني غير صحيحة.';
    }

    if (empty($password)) {
        $errors['password'] = 'حقل كلمة المرور مطلوب.';
    }

    // --- إذا لم تكن هناك أخطاء في الإدخال المبدئي، حاول التحقق من قاعدة البيانات ---
    if (empty($errors)) {
        try {
            // --- إعداد الاستعلام المُعدّ (Prepared Statement) ---
            // هذا يحمي من هجمات SQL Injection.
            // نبحث عن مستخدم لديه البريد الإلكتروني المُدخل.
            $sql = "SELECT id, name, password_hash FROM users WHERE email = :email LIMIT 1";
            // استخدام كائن الاتصال $pdo الذي تم إنشاؤه في db_connection.php
            $stmt = $pdo->prepare($sql);

            // --- ربط قيمة البريد الإلكتروني بالاستعلام ---
            // نربط المتغير $email بالعلامة :email في الاستعلام.
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);

            // --- تنفيذ الاستعلام ---
            $stmt->execute();

            // --- جلب نتيجة الاستعلام ---
            // نستخدم fetch() لجلب صف واحد (إن وجد) كمصفوفة ترابطية.
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // --- التحقق من وجود المستخدم ومطابقة كلمة المرور ---
            // $user سيكون true (أو يحتوي بيانات) إذا تم العثور على مستخدم.
            // password_verify() تقارن كلمة المرور المدخلة مع الـ hash المخزن في قاعدة البيانات.
            if ($user && password_verify($password, $user['password_hash'])) {

                // --- تسجيل الدخول الناجح ---
                // تخزين معرف واسم المستخدم في الجلسة للوصول إليهما في الصفحات الأخرى.
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['name'];

                // (اختياري) يمكنك تحديث حقل "آخر تسجيل دخول" في قاعدة البيانات هنا إذا أردت.
                // $update_stmt = $pdo->prepare("UPDATE users SET last_login_at = NOW() WHERE id = :id");
                // $update_stmt->bindParam(':id', $user['id']);
                // $update_stmt->execute();

                // --- توجيه المستخدم إلى لوحة التحكم ---
                header('Location: dashboard.php');
                exit; // مهم: إنهاء السكربت بعد التوجيه

            } else {
                // --- فشل تسجيل الدخول (المستخدم غير موجود أو كلمة المرور خاطئة) ---
                $errors['credentials'] = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
            }

        } catch (PDOException $e) {
            // --- التعامل مع أخطاء قاعدة البيانات المحتملة أثناء عملية الاستعلام ---
            error_log("Login Error: " . $e->getMessage()); // تسجيل الخطأ الفعلي للخادم
            $errors['db'] = 'حدث خطأ في الخادم أثناء محاولة تسجيل الدخول. يرجى المحاولة لاحقاً.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول - مساري</title>
    <link rel="stylesheet" href="css/style.css"> <link rel="stylesheet" href="css/login.css"> <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                 <a href="index.html" class="logo">مساري</a>
                <h2>تسجيل الدخول</h2>
                <p>أهلاً بعودتك! أدخل بياناتك للمتابعة.</p>
            </div>

             <?php if (!empty($success_message)): ?>
                <div class="alert alert-success">
                    <?php echo htmlspecialchars($success_message); ?>
                </div>
            <?php endif; ?>

            <?php if (isset($errors['credentials'])): ?>
                <div class="alert alert-danger">
                    <?php echo htmlspecialchars($errors['credentials']); ?>
                </div>
            <?php elseif (isset($errors['db'])): ?>
                 <div class="alert alert-danger">
                    <?php echo htmlspecialchars($errors['db']); ?>
                </div>
            <?php endif; ?>


            <form action="login.php" method="POST" novalidate>
                <div class="form-group">
                    <label for="email">البريد الإلكتروني</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email); ?>" required>
                     <?php if (isset($errors['email'])): ?>
                        <small class="error-text"><?php echo $errors['email']; ?></small>
                    <?php endif; ?>
                </div>
                <div class="form-group">
                    <label for="password">كلمة المرور</label>
                    <input type="password" id="password" name="password" required>
                     <?php if (isset($errors['password'])): ?>
                        <small class="error-text"><?php echo $errors['password']; ?></small>
                    <?php endif; ?>
                </div>
                <div class="form-group form-options">
                     </div>
                <button type="submit" class="btn btn-primary btn-block">تسجيل الدخول</button>
            </form>

            <div class="auth-footer">
                <p>ليس لديك حساب؟ <a href="register.php">أنشئ حساباً جديداً</a></p>
            </div>
        </div>
    </div>
     </body>
</html>