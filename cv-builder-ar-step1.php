<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$errors = [];
$step1_error = '';
$input = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

     $name_ar = trim($_POST['name_ar'] ?? '');
     $job_title_ar = trim($_POST['job_title_ar'] ?? '');
     $summary_ar = trim($_POST['summary_ar'] ?? ''); // إضافة حقل الملخص
     $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
     $phone = trim($_POST['phone'] ?? '');
     $address_ar = trim($_POST['address_ar'] ?? '');
     $linkedin_url = filter_input(INPUT_POST, 'linkedin_url', FILTER_SANITIZE_URL);
     $portfolio_url = filter_input(INPUT_POST, 'portfolio_url', FILTER_SANITIZE_URL);

     $input = $_POST;

     if (!empty($email) && $email !== false && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
         $errors['email'] = 'صيغة البريد الإلكتروني غير صحيحة.';
     }
     if (!empty($linkedin_url) && $linkedin_url !== false && !filter_var($linkedin_url, FILTER_VALIDATE_URL)) {
         $errors['linkedin_url'] = 'صيغة رابط LinkedIn غير صحيحة.';
     }
     if (!empty($portfolio_url) && $portfolio_url !== false && !filter_var($portfolio_url, FILTER_VALIDATE_URL)) {
         $errors['portfolio_url'] = 'صيغة رابط معرض الأعمال غير صحيحة.';
     }
     // يمكنك إضافة تحقق للطول الأقصى للملخص هنا إذا أردت
     // if (mb_strlen($summary_ar) > 500) {
     //     $errors['summary_ar'] = 'الملخص المهني طويل جدًا (الحد الأقصى 500 حرف).';
     // }


     if (!empty($errors)) {
         $_SESSION['step1_error'] = 'يرجى تصحيح الأخطاء.';
         $_SESSION['step1_field_errors'] = $errors;
         $_SESSION['step1_old_input'] = $input;
         header('Location: cv-builder-ar-step1.php');
         exit;
     }

     if (!isset($_SESSION['cv_data']) || !is_array($_SESSION['cv_data'])) {
         $_SESSION['cv_data'] = [];
     }
     // سيتم حفظ summary_ar تلقائيًا ضمن $input
     $_SESSION['cv_data']['step1'] = $input;

     unset($_SESSION['step1_error'], $_SESSION['step1_field_errors'], $_SESSION['step1_old_input']);

     header('Location: cv-builder-ar-step2.php');
     exit;
}

$step1_error = $_SESSION['step1_error'] ?? '';
$step1_field_errors = $_SESSION['step1_field_errors'] ?? [];
$step1_old_input = $_SESSION['step1_old_input'] ?? [];
unset($_SESSION['step1_error'], $_SESSION['step1_field_errors'], $_SESSION['step1_old_input']);

$userEmail = $_SESSION['user_email'] ?? '';

?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="الخطوة الأولى في بناء سيرتك الذاتية: المعلومات الشخصية.">
    <title>بناء السيرة الذاتية (1/6): المعلومات الشخصية - مساري</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/login.css">
    <link rel="stylesheet" href="css/builder.css">
</head>
<body>

    <header id="main-header">
        <nav class="container">
            <a href="index.php" class="logo">مساري</a>
            <ul class="nav-links">
                <li><a href="dashboard.php">لوحة التحكم</a></li>
                <li><a href="account-settings.php">إعدادات الحساب</a></li>
                <li><a href="logout.php">تسجيل الخروج</a></li>
            </ul>
            <button id="menu-toggle" aria-label="Toggle Menu"><i class="fas fa-bars"></i></button>
        </nav>
    </header>

    <main class="form-page-container">
        <div class="form-container builder-container">

            <div class="progress-indicator">
                <div class="progress-step active">1 المعلومات الشخصية</div>
                <div class="progress-step">2 التعليم</div>
                <div class="progress-step">3 الخبرة</div>
                <div class="progress-step">4 المهارات</div>
                <div class="progress-step">5 اختيار القالب</div>
                <div class="progress-step">6 معاينة</div>
            </div>

            <h2>الخطوة 1: المعلومات الشخصية (عربي)</h2>
            <p class="form-subtitle">أدخل المعلومات التي ترغب بإضافتها لسيرتك الذاتية.</p>

            <?php if (!empty($step1_error)): ?>
                <div id="form-error-message" class="alert alert-danger" style="display: block;">
                    <?php echo htmlspecialchars($step1_error); ?>
                </div>
            <?php endif; ?>

            <form id="cv-step1-form" action="cv-builder-ar-step1.php" method="POST">

                <div class="form-group">
                    <label for="name_ar">الاسم الكامل</label>
                    <input type="text" id="name_ar" name="name_ar" value="<?php echo htmlspecialchars($step1_old_input['name_ar'] ?? ''); ?>">
                    <div id="name_ar-error" class="error-message field-error"><?php echo htmlspecialchars($step1_field_errors['name_ar'] ?? ''); ?></div>
                </div>

                <div class="form-group">
                    <label for="job_title_ar">المسمى الوظيفي أو الهدف الوظيفي</label>
                    <input type="text" id="job_title_ar" name="job_title_ar" placeholder="اختياري: مثال: مطور واجهات أمامية..." value="<?php echo htmlspecialchars($step1_old_input['job_title_ar'] ?? ''); ?>">
                    <div id="job_title_ar-error" class="error-message field-error"><?php echo htmlspecialchars($step1_field_errors['job_title_ar'] ?? ''); ?></div>
                </div>

                <div class="form-group">
                    <label for="summary_ar">الملخص المهني أو الهدف الوظيفي (اختياري)</label>
                    <textarea id="summary_ar" name="summary_ar" rows="4" placeholder="اكتب هنا نبذة مختصرة (2-4 أسطر) عن خبراتك وأهدافك المهنية..."><?php echo htmlspecialchars($step1_old_input['summary_ar'] ?? ''); ?></textarea>
                    <small>هذا النص سيظهر في أعلى سيرتك الذاتية.</small>
                    <div id="summary_ar-error" class="error-message field-error"><?php echo htmlspecialchars($step1_field_errors['summary_ar'] ?? ''); ?></div>
                </div>
                <div class="form-group">
                    <label for="email">البريد الإلكتروني</label>
                    <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($step1_old_input['email'] ?? $userEmail); ?>">
                    <div id="email-error" class="error-message field-error"><?php echo htmlspecialchars($step1_field_errors['email'] ?? ''); ?></div>
                </div>

                <div class="form-group">
                    <label for="phone">رقم الهاتف (اختياري)</label>
                    <input type="tel" id="phone" name="phone" value="<?php echo htmlspecialchars($step1_old_input['phone'] ?? ''); ?>">
                     <div id="phone-error" class="error-message field-error"><?php echo htmlspecialchars($step1_field_errors['phone'] ?? ''); ?></div>
                </div>

                 <div class="form-group">
                    <label for="address_ar">العنوان (اختياري)</label>
                    <input type="text" id="address_ar" name="address_ar" placeholder="مثال: الرياض، المملكة العربية السعودية" value="<?php echo htmlspecialchars($step1_old_input['address_ar'] ?? ''); ?>">
                    <div id="address_ar-error" class="error-message field-error"><?php echo htmlspecialchars($step1_field_errors['address_ar'] ?? ''); ?></div>
                </div>

                 <div class="form-group">
                    <label for="linkedin_url">رابط LinkedIn (اختياري)</label>
                    <input type="url" id="linkedin_url" name="linkedin_url" placeholder="https://linkedin.com/in/yourprofile" value="<?php echo htmlspecialchars($step1_old_input['linkedin_url'] ?? ''); ?>">
                    <div id="linkedin_url-error" class="error-message field-error"><?php echo htmlspecialchars($step1_field_errors['linkedin_url'] ?? ''); ?></div>
                </div>

                 <div class="form-group">
                    <label for="portfolio_url">رابط معرض الأعمال (اختياري)</label>
                    <input type="url" id="portfolio_url" name="portfolio_url" placeholder="https://yourportfolio.com" value="<?php echo htmlspecialchars($step1_old_input['portfolio_url'] ?? ''); ?>">
                    <div id="portfolio_url-error" class="error-message field-error"><?php echo htmlspecialchars($step1_field_errors['portfolio_url'] ?? ''); ?></div>
                </div>


                <div class="builder-navigation">
                     <button type="submit" class="cta-btn next-step-btn">التالي: التعليم <i class="fas fa-arrow-left"></i></button>
                </div>
            </form>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; <?php echo date("Y"); ?> مساري. جميع الحقوق محفوظة.</p>
            <ul>
                <li><a href="privacy.php">سياسة الخصوصية</a></li>
                <li><a href="terms.php">شروط الاستخدام</a></li>
            </ul>
        </div>
    </footer>

    <script src="js/script.js"></script>
</body>
</html>