<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$errors = [];
$step4_error = '';
$input = [];
$has_errors = false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $skills_text = trim($_POST['skills_ar'] ?? '');

    $cert_names = $_POST['cert_name_ar'] ?? [];
    $cert_orgs = $_POST['cert_org_ar'] ?? [];
    $cert_dates = $_POST['cert_date_ar'] ?? [];

    $certificate_entries = [];
    $cert_entry_count = count($cert_names);

    for ($i = 0; $i < $cert_entry_count; $i++) {
        $cert_name = trim($cert_names[$i] ?? '');
        $cert_org = trim($cert_orgs[$i] ?? '');
        $cert_date = $cert_dates[$i] ?? '';

        // أضف التحقق هنا إذا لزم الأمر (مثل صيغة التاريخ)
        // if (!empty($cert_date) && !preg_match('/^\d{4}(-\d{2})?$/', $cert_date)) {
        //     // $errors['certificates'][$i]['cert_date_ar'] = 'صيغة التاريخ غير صحيحة (YYYY أو YYYY-MM).';
        //     $has_errors = true;
        // }

        // أضف فقط الإدخالات التي تحتوي على اسم شهادة على الأقل
        if (!empty($cert_name)) {
            $certificate_entries[] = [
                'cert_name_ar' => $cert_name,
                'cert_org_ar' => $cert_org,
                'cert_date_ar' => $cert_date
            ];
        }
    }


    if ($has_errors) {
        $_SESSION['step4_error'] = 'يرجى تصحيح الأخطاء.';
        // $_SESSION['step4_field_errors'] = $errors; // لتمرير الأخطاء للواجهة
        $_SESSION['step4_old_input'] = $_POST; // حفظ كل المدخلات لإعادة الملء
        header('Location: cv-builder-ar-step4-skills.php');
        exit;
    }

    if (!isset($_SESSION['cv_data']) || !is_array($_SESSION['cv_data'])) {
        $_SESSION['cv_data'] = [];
    }
    // حفظ المهارات والشهادات معًا في بيانات الخطوة الرابعة
    $_SESSION['cv_data']['step4'] = [
        'skills_ar' => $skills_text,
        'certificates' => $certificate_entries
    ];

    unset($_SESSION['step4_error'], $_SESSION['step4_old_input']);

    header('Location: cv-builder-ar-step5-select-style.php');
    exit;
}

$step4_error = $_SESSION['step4_error'] ?? '';
$step4_old_input = $_SESSION['step4_old_input'] ?? [];
// $step4_field_errors = $_SESSION['step4_field_errors'] ?? []; // لاستخدامه في عرض الأخطاء لاحقاً
unset($_SESSION['step4_error'], $_SESSION['step4_old_input']/*, $_SESSION['step4_field_errors']*/);

// استرداد البيانات المحفوظة سابقاً أو المدخلات القديمة
$skills_text = $_SESSION['cv_data']['step4']['skills_ar'] ?? ($step4_old_input['skills_ar'] ?? '');
// استرداد الشهادات القديمة لإعادة الملء (يتطلب تعديل HTML لعرضها)
$previous_certificates = $_SESSION['cv_data']['step4']['certificates'] ?? ($step4_old_input['cert_name_ar'] ? array_map(null, $step4_old_input['cert_name_ar'], $step4_old_input['cert_org_ar'], $step4_old_input['cert_date_ar']) : []);


?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="الخطوة الرابعة في بناء سيرتك الذاتية: المهارات والشهادات.">
    <title>بناء السيرة الذاتية (4/6): المهارات والشهادات - مساري</title>
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
                <div class="progress-step">1 المعلومات الشخصية</div>
                <div class="progress-step">2 التعليم</div>
                <div class="progress-step">3 الخبرة</div>
                <div class="progress-step active">4 المهارات والشهادات</div>
                <div class="progress-step">5 اختيار القالب</div>
                <div class="progress-step">6 معاينة</div>
            </div>

            <h2>الخطوة 4: المهارات والشهادات (عربي)</h2>
            <p class="form-subtitle">أضف مهاراتك، بالإضافة إلى أي شهادات مهنية أو دورات تدريبية حصلت عليها.</p>

            <?php if (!empty($step4_error)): ?>
                <div id="form-error-message" class="alert alert-danger" style="display: block;">
                    <?php echo htmlspecialchars($step4_error); ?>
                </div>
            <?php endif; ?>

            <form id="cv-step4-form" action="cv-builder-ar-step4-skills.php" method="POST">

                <fieldset class="builder-fieldset">
                    <legend>قائمة المهارات</legend>
                    <div class="form-group">
                        <label for="skills_ar">اذكر مهاراتك (يُفضل الفصل بينها بفاصلة أو كل مهارة في سطر)</label>
                        <textarea id="skills_ar" name="skills_ar" rows="8" placeholder="مثال: التواصل الفعال, العمل ضمن فريق, PHP, MySQL..."><?php echo htmlspecialchars($skills_text); ?></textarea>
                        <small>اذكر المهارات الشخصية والفنية.</small>
                        <div id="skills_ar-error" class="error-message field-error"></div>
                    </div>
                </fieldset>

                <fieldset class="builder-fieldset">
                    <legend>الشهادات والدورات التدريبية (اختياري)</legend>
                    <div id="certificates-container">
                        <div class="certificate-entry-item entry-item" data-index="0">
                             <hr style="display: none;">
                             <div class="form-group">
                                 <label for="cert_name_ar_0">اسم الشهادة / الدورة</label>
                                 <input type="text" id="cert_name_ar_0" name="cert_name_ar[]" placeholder="مثال: شهادة PMP لإدارة المشاريع">
                                 <div class="error-message field-error"></div>
                             </div>
                             <div class="form-group">
                                 <label for="cert_org_ar_0">الجهة المانحة (اختياري)</label>
                                 <input type="text" id="cert_org_ar_0" name="cert_org_ar[]" placeholder="مثال: معهد PMI أو Coursera">
                                 <div class="error-message field-error"></div>
                             </div>
                             <div class="form-group">
                                 <label for="cert_date_ar_0">تاريخ الحصول عليها (اختياري)</label>
                                 <input type="month" id="cert_date_ar_0" name="cert_date_ar[]" placeholder="YYYY-MM">
                                 <div class="error-message field-error"></div>
                             </div>
                             <button type="button" class="remove-entry-btn cert-remove-btn" title="إزالة هذه الشهادة" style="display: none;">&times; إزالة</button>
                         </div>

                        <div class="certificate-entry-item entry-item template" style="display: none;" id="certificate-template">
                              <hr>
                              <div class="form-group">
                                  <label for="cert_name_ar_TEMPLATE">اسم الشهادة / الدورة</label>
                                  <input type="text" id="cert_name_ar_TEMPLATE" name="cert_name_ar[]" placeholder="مثال: شهادة PMP لإدارة المشاريع" disabled>
                                  <div class="error-message field-error"></div>
                              </div>
                              <div class="form-group">
                                  <label for="cert_org_ar_TEMPLATE">الجهة المانحة (اختياري)</label>
                                  <input type="text" id="cert_org_ar_TEMPLATE" name="cert_org_ar[]" placeholder="مثال: معهد PMI أو Coursera" disabled>
                                  <div class="error-message field-error"></div>
                              </div>
                              <div class="form-group">
                                  <label for="cert_date_ar_TEMPLATE">تاريخ الحصول عليها (اختياري)</label>
                                  <input type="month" id="cert_date_ar_TEMPLATE" name="cert_date_ar[]" placeholder="YYYY-MM" disabled>
                                  <div class="error-message field-error"></div>
                              </div>
                              <button type="button" class="remove-entry-btn cert-remove-btn" title="إزالة هذه الشهادة">&times; إزالة</button>
                          </div>
                    </div>
                    <button type="button" id="add-certificate-btn" class="secondary-btn add-entry-btn">
                        <i class="fas fa-plus"></i> إضافة شهادة أو دورة أخرى
                    </button>
                </fieldset>

                <div class="builder-navigation">
                     <a href="cv-builder-ar-step3.php" class="secondary-btn prev-step-btn"><i class="fas fa-arrow-right"></i> السابق: الخبرة</a>
                     <button type="submit" class="cta-btn next-step-btn">التالي: اختيار القالب <i class="fas fa-arrow-left"></i></button>
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

    <script src="js/builder-dynamic-entries.js"></script>
    <script src="js/script.js"></script>
    <script>
        // تأكد من أن لديك وظائف مشابهة في builder-dynamic-entries.js
        // للتعامل مع #add-certificate-btn و #certificate-template
        // وحاوية #certificates-container وأزرار .cert-remove-btn
        // بنفس الطريقة التي تتعامل بها مع التعليم والخبرة.
    </script>
</body>
</html>