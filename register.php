<?php
// register.php

// بدء أو استئناف الجلسة (مفيد إذا أردت حماية الصفحة أو تمرير رسائل)
session_start();

// إذا كان المستخدم مسجل دخوله بالفعل، قم بتوجيهه إلى لوحة التحكم
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit; // إنهاء التنفيذ
}

// --- تضمين ملف الاتصال بقاعدة البيانات ---
// هذا السطر يجلب الكود من db_connection.php وينفذه.
// إذا تم الاتصال بنجاح، يصبح المتغير $pdo متاحاً هنا.
require_once 'db_connection.php';

$errors = []; // مصفوفة لتخزين رسائل الأخطاء
$success_message = ''; // رسالة للنجاح (عادة لا تستخدم مع التوجيه الفوري)
$name = ''; // لتذكر قيمة الاسم عند حدوث خطأ
$email = ''; // لتذكر قيمة البريد عند حدوث خطأ

// التحقق مما إذا كان الطلب هو POST (تم إرسال النموذج)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // --- استلام وتنقية البيانات ---
    // استخدام filter_input و trim لإزالة المسافات الزائدة وتنقية المدخلات
    $name = trim(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS)); // إزالة بعض الرموز الخطرة
    $email = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL)); // إزالة الرموز غير الصالحة للبريد
    $password = $_POST['password'] ?? ''; // استلام كلمة المرور كما هي
    $password_confirm = $_POST['password_confirm'] ?? '';

    // --- التحقق من صحة البيانات (Validation) ---

    // التحقق من الاسم
    if (empty($name)) {
        $errors['name'] = 'حقل الاسم مطلوب.';
    }

    // التحقق من البريد الإلكتروني
    if (empty($email)) {
        $errors['email'] = 'حقل البريد الإلكتروني مطلوب.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'صيغة البريد الإلكتروني غير صحيحة.';
    } else {
        // التحقق من وجود البريد الإلكتروني مسبقاً في قاعدة البيانات
        try {
            // استخدام الاستعلام المُعدّ للتحقق من وجود البريد
            $stmt_check_email = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
            $stmt_check_email->bindParam(':email', $email);
            $stmt_check_email->execute();
            // إذا fetch() أعادت أي صف، فالبريد موجود
            if ($stmt_check_email->fetch()) {
                $errors['email'] = 'هذا البريد الإلكتروني مسجل بالفعل.';
            }
        } catch (PDOException $e) {
            error_log("Error checking email existence: " . $e->getMessage());
            $errors['db'] = 'حدث خطأ في الخادم، يرجى المحاولة مرة أخرى.';
        }
    }

    // التحقق من كلمة المرور
    if (empty($password)) {
        $errors['password'] = 'حقل كلمة المرور مطلوب.';
    } elseif (strlen($password) < 8) {
        // يمكنك إضافة شروط أخرى لتعقيد كلمة المرور إذا أردت
        $errors['password'] = 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.';
    } elseif ($password !== $password_confirm) {
        $errors['password_confirm'] = 'كلمتا المرور غير متطابقتين.';
    }

    // --- إذا لم تكن هناك أخطاء، قم بإدراج المستخدم الجديد ---
    if (empty($errors)) {
        // تشفير كلمة المرور باستخدام password_hash (الطريقة الآمنة الموصى بها)
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        try {
            // --- إعداد استعلام الإدراج المُعدّ ---
            $sql = "INSERT INTO users (name, email, password_hash, created_at, updated_at) VALUES (:name, :email, :password_hash, NOW(), NOW())";
            // استخدام كائن الاتصال $pdo
            $stmt = $pdo->prepare($sql);

            // --- ربط القيم بالاستعلام ---
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password_hash', $password_hash);

            // --- تنفيذ الاستعلام ---
            if ($stmt->execute()) {
                // تم التسجيل بنجاح
                // توجيه المستخدم إلى صفحة تسجيل الدخول مع رسالة نجاح عبر الجلسة
                $_SESSION['success_message'] = 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.';
                header('Location: login.php');
                exit; // مهم: إنهاء السكربت بعد التوجيه

            } else {
                // فشل تنفيذ الاستعلام لسبب غير متوقع
                $errors['db'] = 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى.';
            }
        } catch (PDOException $e) {
            // التعامل مع أخطاء قاعدة البيانات المحتملة أثناء الإدراج
            error_log("Registration Error: " . $e->getMessage()); // تسجيل الخطأ الفعلي للخادم
            $errors['db'] = 'حدث خطأ في الخادم أثناء محاولة التسجيل.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إنشاء حساب جديد - مساري</title>
    <link rel="stylesheet" href="css/style.css"> <link rel="stylesheet" href="css/login.css"> <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <a href="index.php" class="logo">مساري</a>
                <h2>إنشاء حساب جديد</h2>
                <p>انضم إلينا وابدأ في بناء سيرتك الذاتية.</p>
            </div>

            <?php if (!empty($errors)): ?>
                <div class="alert alert-danger">
                    <ul>
                        <?php foreach ($errors as $field => $error): // عرض كل خطأ ?>
                            <li><?php echo htmlspecialchars($error); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>

            <?php if (!empty($success_message)): // عادة لا يظهر بسبب التوجيه ?>
                <div class="alert alert-success">
                    <?php echo htmlspecialchars($success_message); ?>
                </div>
            <?php endif; ?>

            <form action="register.php" method="POST" novalidate>
                <div class="form-group">
                    <label for="name">الاسم الكامل</label>
                    <input type="text" id="name" name="name" value="<?php echo htmlspecialchars($name); ?>" required>
                    <?php if (isset($errors['name'])): ?>
                        <small class="error-text"><?php echo $errors['name']; ?></small>
                    <?php endif; ?>
                </div>
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
                <div class="form-group">
                    <label for="password_confirm">تأكيد كلمة المرور</label>
                    <input type="password" id="password_confirm" name="password_confirm" required>
                     <?php if (isset($errors['password_confirm'])): ?>
                        <small class="error-text"><?php echo $errors['password_confirm']; ?></small>
                    <?php endif; ?>
                </div>
                <button type="submit" class="btn btn-primary btn-block">إنشاء الحساب</button>
            </form>

            <div class="auth-footer">
                <p>لديك حساب بالفعل؟ <a href="login.php">سجل الدخول</a></p>
            </div>
        </div>
    </div>
    </body>
</html>