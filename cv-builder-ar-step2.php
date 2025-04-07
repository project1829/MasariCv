<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$errors = [];
$step2_error = '';
$has_errors = false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $degrees = $_POST['degree_ar'] ?? [];
    $institutions = $_POST['institution_ar'] ?? [];
    $start_dates = $_POST['start_date_edu'] ?? [];
    $end_dates = $_POST['end_date_edu'] ?? [];
    $presents_raw = $_POST['present_edu'] ?? [];
    $descriptions = $_POST['description_edu_ar'] ?? [];

    $education_entries = [];

    $entry_count = count($degrees);

    for ($i = 0; $i < $entry_count; $i++) {
        $entry_errors = [];
        $degree = trim($degrees[$i] ?? '');
        $institution = trim($institutions[$i] ?? '');
        $start_date = $start_dates[$i] ?? '';
        $end_date = $end_dates[$i] ?? '';
        $is_present = !empty($presents_raw[$i]) && $presents_raw[$i] == '1';
        $description = trim($descriptions[$i] ?? '');

        if (!$is_present && !empty($start_date) && !empty($end_date) && strtotime($end_date) < strtotime($start_date)) {
             $entry_errors['end_date_edu'] = 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.';
             $has_errors = true;
        }

        if (!empty($entry_errors)) {
            $errors[$i] = $entry_errors;
        }

        $education_entries[] = [
            'degree_ar' => $degree,
            'institution_ar' => $institution,
            'start_date_edu' => $start_date,
            'end_date_edu' => $is_present ? null : $end_date,
            'present_edu' => $is_present,
            'description_edu_ar' => $description
        ];
    }

    if ($has_errors) {
        $_SESSION['step2_error'] = 'يرجى تصحيح الأخطاء الموضحة أدناه.';
        $_SESSION['step2_field_errors'] = $errors;
        header('Location: cv-builder-ar-step2.php');
        exit;
    } else {
        if (!isset($_SESSION['cv_data']) || !is_array($_SESSION['cv_data'])) {
            $_SESSION['cv_data'] = [];
        }
        $_SESSION['cv_data']['step2'] = $education_entries;

        unset($_SESSION['step2_error'], $_SESSION['step2_field_errors'], $_SESSION['submitted_step2_data']);

        header('Location: cv-builder-ar-step3.php');
        exit;
    }
}

$step2_error = $_SESSION['step2_error'] ?? '';
$step2_field_errors = $_SESSION['step2_field_errors'] ?? [];
unset($_SESSION['step2_error'], $_SESSION['step2_field_errors'], $_SESSION['submitted_step2_data']);

?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="الخطوة الثانية في بناء سيرتك الذاتية: المؤهلات التعليمية.">
    <title>بناء السيرة الذاتية (2/6): المؤهلات التعليمية - مساري</title>
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
                <div class="progress-step active">2 التعليم</div>
                <div class="progress-step">3 الخبرة</div>
                <div class="progress-step">4 المهارات</div>
                <div class="progress-step">5 اختيار القالب</div>
                <div class="progress-step">6 معاينة</div>
            </div>

            <h2>الخطوة 2: المؤهلات التعليمية (عربي)</h2>
            <p class="form-subtitle">أضف شهاداتك ومؤهلاتك الدراسية. يمكنك إضافة أكثر من مؤهل أو تجاوز هذه الخطوة.</p>

            <?php if (!empty($step2_error)): ?>
                <div id="form-error-message" class="alert alert-danger" style="display: block;">
                    <?php echo htmlspecialchars($step2_error); ?>
                </div>
            <?php endif; ?>

            <form id="cv-step2-form" action="cv-builder-ar-step2.php" method="POST">

                <div id="education-entries-container">
                        <div class="education-entry-item" data-index="0">
                             <hr style="display: none;">
                             <div class="form-group">
                                 <label for="degree_ar_0">المؤهل / الدرجة العلمية</label>
                                 <input type="text" id="degree_ar_0" name="degree_ar[]" placeholder="مثال: بكالوريوس علوم الحاسب">
                                 <?php if (isset($step2_field_errors[0]['degree_ar'])): ?>
                                     <div class="error-message field-error"><?php echo htmlspecialchars($step2_field_errors[0]['degree_ar']); ?></div>
                                 <?php endif; ?>
                             </div>
                             <div class="form-group">
                                 <label for="institution_ar_0">اسم المؤسسة التعليمية</label>
                                 <input type="text" id="institution_ar_0" name="institution_ar[]" placeholder="مثال: جامعة الملك سعود">
                                  <?php if (isset($step2_field_errors[0]['institution_ar'])): ?>
                                     <div class="error-message field-error"><?php echo htmlspecialchars($step2_field_errors[0]['institution_ar']); ?></div>
                                 <?php endif; ?>
                             </div>
                            <div class="date-group">
                                 <div class="form-group">
                                     <label for="start_date_edu_0">تاريخ البدء</label>
                                     <input type="month" id="start_date_edu_0" name="start_date_edu[]">
                                      <?php if (isset($step2_field_errors[0]['start_date_edu'])): ?>
                                         <div class="error-message field-error"><?php echo htmlspecialchars($step2_field_errors[0]['start_date_edu']); ?></div>
                                     <?php endif; ?>
                                 </div>
                                 <div class="form-group">
                                     <label for="end_date_edu_0">تاريخ الانتهاء</label>
                                     <input type="month" id="end_date_edu_0" name="end_date_edu[]">
                                     <div class="form-check">
                                          <input type="checkbox" id="present_edu_0" name="present_edu[0]" value="1" class="edu-present-checkbox">
                                          <label for="present_edu_0">لا أزال أدرس هنا</label>
                                     </div>
                                      <?php if (isset($step2_field_errors[0]['end_date_edu'])): ?>
                                         <div class="error-message field-error"><?php echo htmlspecialchars($step2_field_errors[0]['end_date_edu']); ?></div>
                                     <?php endif; ?>
                                 </div>
                            </div>
                             <div class="form-group">
                                 <label for="description_edu_ar_0">وصف إضافي (اختياري)</label>
                                 <textarea id="description_edu_ar_0" name="description_edu_ar[]" rows="3" placeholder="مثال: مواد رئيسية، مشروع تخرج، تقدير..."></textarea>
                                  <?php if (isset($step2_field_errors[0]['description_edu_ar'])): ?>
                                     <div class="error-message field-error"><?php echo htmlspecialchars($step2_field_errors[0]['description_edu_ar']); ?></div>
                                 <?php endif; ?>
                             </div>
                             <button type="button" class="remove-entry-btn" title="إزالة هذا المؤهل" style="display: none;">&times; إزالة</button>
                         </div>

                    <div class="education-entry-item template" style="display: none;" id="education-template">
                          <hr>
                          <div class="form-group">
                              <label for="degree_ar_TEMPLATE">المؤهل / الدرجة العلمية</label>
                              <input type="text" id="degree_ar_TEMPLATE" name="degree_ar[]" placeholder="مثال: بكالوريوس علوم الحاسب" disabled>
                              <div class="error-message field-error"></div>
                          </div>
                          <div class="form-group">
                              <label for="institution_ar_TEMPLATE">اسم المؤسسة التعليمية</label>
                              <input type="text" id="institution_ar_TEMPLATE" name="institution_ar[]" placeholder="مثال: جامعة الملك سعود" disabled>
                              <div class="error-message field-error"></div>
                          </div>
                         <div class="date-group">
                              <div class="form-group">
                                  <label for="start_date_edu_TEMPLATE">تاريخ البدء</label>
                                  <input type="month" id="start_date_edu_TEMPLATE" name="start_date_edu[]" disabled>
                                  <div class="error-message field-error"></div>
                              </div>
                              <div class="form-group">
                                  <label for="end_date_edu_TEMPLATE">تاريخ الانتهاء</label>
                                  <input type="month" id="end_date_edu_TEMPLATE" name="end_date_edu[]" disabled>
                                  <div class="form-check">
                                       <input type="checkbox" id="present_edu_TEMPLATE" name="present_edu[]" value="1" class="edu-present-checkbox" disabled>
                                       <label for="present_edu_TEMPLATE">لا أزال أدرس هنا</label>
                                  </div>
                                  <div class="error-message field-error"></div>
                              </div>
                         </div>
                          <div class="form-group">
                              <label for="description_edu_ar_TEMPLATE">وصف إضافي (اختياري)</label>
                              <textarea id="description_edu_ar_TEMPLATE" name="description_edu_ar[]" rows="3" placeholder="مثال: مواد رئيسية، مشروع تخرج، تقدير..." disabled></textarea>
                              <div class="error-message field-error"></div>
                          </div>
                          <button type="button" class="remove-entry-btn" title="إزالة هذا المؤهل">&times; إزالة</button>
                      </div>

                </div>

                <button type="button" id="add-education-btn" class="secondary-btn add-entry-btn">
                    <i class="fas fa-plus"></i> إضافة مؤهل تعليمي آخر
                </button>

                <div class="builder-navigation">
                     <a href="cv-builder-ar-step1.php" class="secondary-btn prev-step-btn"><i class="fas fa-arrow-right"></i> السابق: المعلومات الشخصية</a>
                     <button type="submit" class="cta-btn next-step-btn">التالي: الخبرة العملية <i class="fas fa-arrow-left"></i></button>
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

</body>
</html>