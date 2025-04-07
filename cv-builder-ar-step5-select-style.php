<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$available_styles = [
    'classic' => 'نمط كلاسيكي',
    'modern' => 'نمط حديث',
    'creative' => 'نمط إبداعي',
    'simple' => 'نمط بسيط'
];

// لا حاجة لجلب النمط السابق هنا لأن JS سيتعامل مع الاختيار والتوجيه مباشرة
// $selected_style = $_SESSION['cv_data']['step5']['style'] ?? '';

?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="الخطوة الخامسة في بناء سيرتك الذاتية: اختيار نمط التصميم.">
    <title>بناء السيرة الذاتية (5/6): اختيار النمط - مساري</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/builder.css">
    <link rel="stylesheet" href="css/options.css">
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
        <div class="form-container builder-container wider-container">

            <div class="progress-indicator">
                <div class="progress-step">1 المعلومات الشخصية</div>
                <div class="progress-step">2 التعليم</div>
                <div class="progress-step">3 الخبرة</div>
                <div class="progress-step">4 المهارات</div>
                <div class="progress-step active">5 اختيار النمط</div>
                <div class="progress-step">6 العرض النهائي</div>
            </div>

            <h2>الخطوة 5: اختيار نمط السيرة الذاتية</h2>
            <p class="form-subtitle">اختر النمط العام الذي تفضله. سيتم نقلك مباشرة للعرض النهائي.</p>

            <form id="cv-step5-form">

                <fieldset class="options-group">
                    <legend>اختر نمطًا</legend>
                    <div class="options-container style-options-gallery">
                        <?php if (!empty($available_styles) && is_array($available_styles)): ?>
                            <?php foreach ($available_styles as $value => $label): ?>
                                <div class="option-item style-option-item">
                                    <input type="radio"
                                           name="style_choice"
                                           value="<?php echo htmlspecialchars($value); ?>"
                                           id="style_<?php echo htmlspecialchars($value); ?>"
                                           class="style-radio-input"
                                           required>
                                    <label for="style_<?php echo htmlspecialchars($value); ?>" class="option-label button-like">
                                        <?php echo htmlspecialchars($label); ?>
                                    </label>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <p>عفواً، لا توجد أنماط متاحة حالياً.</p>
                        <?php endif; ?>
                    </div>
                    <div id="style_choice-error" class="error-message field-error"></div>
                </fieldset>

                <div class="builder-navigation">
                    <a href="cv-builder-ar-step4-skills.php" class="secondary-btn prev-step-btn"><i class="fas fa-arrow-right"></i> السابق: المهارات</a>
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

    <script src="js/select-style.js"></script>
    <script src="js/script.js"></script>
</body>
</html>