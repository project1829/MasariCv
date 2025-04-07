<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$errors = [];
$step3_error = '';
$has_errors = false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $job_titles = $_POST['job_title_exp_ar'] ?? [];
    $company_names = $_POST['company_name_ar'] ?? [];
    $locations = $_POST['company_location_ar'] ?? [];
    $start_dates_exp = $_POST['start_date_exp'] ?? [];
    $end_dates_exp = $_POST['end_date_exp'] ?? [];
    $presents_exp_raw = $_POST['present_exp'] ?? [];
    $tasks_nested = $_POST['tasks_exp_ar'] ?? [];

    $experience_entries = [];

    $entry_count = count($job_titles);

    for ($i = 0; $i < $entry_count; $i++) {
        $entry_errors = [];
        $job_title = trim($job_titles[$i] ?? '');
        $company_name = trim($company_names[$i] ?? '');
        $location = trim($locations[$i] ?? '');
        $start_date = $start_dates_exp[$i] ?? '';
        $end_date = $end_dates_exp[$i] ?? '';
        $is_present = !empty($presents_exp_raw[$i]) && $presents_exp_raw[$i] == '1';
        $tasks_for_this_entry = $tasks_nested[$i] ?? []; // الحصول على مصفوفة المهام لهذه الخبرة

        if (!$is_present && !empty($start_date) && !empty($end_date) && strtotime($end_date) < strtotime($start_date)) {
             $entry_errors['end_date_exp'] = 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.';
             $has_errors = true;
        }

        // يمكنك إضافة المزيد من التحقق هنا

        if (!empty($entry_errors)) {
            $errors[$i] = $entry_errors;
        }

        // تنظيف المهام (إزالة الفارغة)
        $current_tasks = [];
        if (is_array($tasks_for_this_entry)) {
            foreach ($tasks_for_this_entry as $task) {
                $trimmed_task = trim($task);
                if (!empty($trimmed_task)) {
                    $current_tasks[] = $trimmed_task;
                }
            }
        }


        $experience_entries[] = [
            'job_title_exp_ar' => $job_title,
            'company_name_ar' => $company_name,
            'company_location_ar' => $location,
            'start_date_exp' => $start_date,
            'end_date_exp' => $is_present ? null : $end_date,
            'present_exp' => $is_present,
            'tasks' => $current_tasks // تخزين مصفوفة المهام النظيفة
        ];
    }

    if ($has_errors) {
        $_SESSION['step3_error'] = 'يرجى تصحيح الأخطاء في إدخالات الخبرة.';
        // $_SESSION['step3_field_errors'] = $errors; // قد يكون معقدًا للعرض
        // $_SESSION['submitted_step3_data'] = $experience_entries; // لحفظ البيانات المدخلة
        header('Location: cv-builder-ar-step3.php');
        exit;
    } else {
        if (!isset($_SESSION['cv_data']) || !is_array($_SESSION['cv_data'])) {
            $_SESSION['cv_data'] = [];
        }
        $_SESSION['cv_data']['step3'] = $experience_entries;

        unset($_SESSION['step3_error']/*, $_SESSION['step3_field_errors'], $_SESSION['submitted_step3_data']*/);

        header('Location: cv-builder-ar-step4-skills.php');
        exit;
    }
}

$step3_error = $_SESSION['step3_error'] ?? '';
unset($_SESSION['step3_error']);

?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="الخطوة الثالثة في بناء سيرتك الذاتية: الخبرة العملية.">
    <title>بناء السيرة الذاتية (3/6): الخبرة العملية - مساري</title>
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
                <div class="progress-step active">3 الخبرة</div>
                <div class="progress-step">4 المهارات</div>
                <div class="progress-step">5 اختيار القالب</div>
                <div class="progress-step">6 معاينة</div>
            </div>

            <h2>الخطوة 3: الخبرة العملية (عربي)</h2>
            <p class="form-subtitle">أضف خبراتك المهنية السابقة أو الحالية، مع أهم المهام التي قمت بها.</p>

            <?php if (!empty($step3_error)): ?>
                <div id="form-error-message" class="alert alert-danger" style="display: block;">
                    <?php echo htmlspecialchars($step3_error); ?>
                </div>
            <?php endif; ?>

            <form id="cv-step3-form" action="cv-builder-ar-step3.php" method="POST">

                <fieldset class="builder-fieldset">
                    <legend>الخبرة العملية</legend>
                    <div id="experience-entries-container">
                        <div class="experience-entry-item entry-item" data-index="0">
                             <hr style="display: none;">
                             <div class="form-group">
                                 <label for="job_title_exp_ar_0">المسمى الوظيفي</label>
                                 <input type="text" id="job_title_exp_ar_0" name="job_title_exp_ar[]" placeholder="مثال: محاسب">
                                 <div class="error-message field-error"></div>
                             </div>
                             <div class="form-group">
                                 <label for="company_name_ar_0">اسم الشركة</label>
                                 <input type="text" id="company_name_ar_0" name="company_name_ar[]" placeholder="مثال: شركة الأمل للتجارة">
                                 <div class="error-message field-error"></div>
                             </div>
                            <div class="form-group">
                                 <label for="company_location_ar_0">موقع الشركة (اختياري)</label>
                                 <input type="text" id="company_location_ar_0" name="company_location_ar[]" placeholder="مثال: جدة، السعودية">
                                  <div class="error-message field-error"></div>
                             </div>
                            <div class="date-group">
                                 <div class="form-group">
                                     <label for="start_date_exp_0">تاريخ البدء</label>
                                     <input type="month" id="start_date_exp_0" name="start_date_exp[]">
                                     <div class="error-message field-error"></div>
                                 </div>
                                 <div class="form-group">
                                     <label for="end_date_exp_0">تاريخ الانتهاء</label>
                                     <input type="month" id="end_date_exp_0" name="end_date_exp[]">
                                     <div class="form-check">
                                          <input type="checkbox" id="present_exp_0" name="present_exp[0]" value="1" class="exp-present-checkbox">
                                          <label for="present_exp_0">أعمل هنا حالياً</label>
                                     </div>
                                     <div class="error-message field-error"></div>
                                 </div>
                            </div>

                            <div class="tasks-section">
                                 <h4>المهام المنجزة (اختياري):</h4>
                                 <div class="task-list">
                                     <div class="task-item">
                                         <textarea name="tasks_exp_ar[0][]" rows="2" placeholder="أضف مهمة قمت بها..."></textarea>
                                         <button type="button" class="remove-task-btn" title="إزالة المهمة">&times;</button>
                                     </div>
                                 </div>
                                 <button type="button" class="secondary-btn add-task-btn">
                                     <i class="fas fa-plus"></i> إضافة مهمة
                                 </button>
                             </div>

                             <button type="button" class="remove-entry-btn exp-remove-btn" title="إزالة هذه الخبرة" style="display: none;">&times; إزالة الخبرة</button>
                         </div>

                        <div class="experience-entry-item entry-item template" style="display: none;" id="experience-template">
                              <hr>
                              <div class="form-group">
                                  <label for="job_title_exp_ar_TEMPLATE">المسمى الوظيفي</label>
                                  <input type="text" id="job_title_exp_ar_TEMPLATE" name="job_title_exp_ar[]" placeholder="مثال: محاسب" disabled>
                                  <div class="error-message field-error"></div>
                              </div>
                              <div class="form-group">
                                  <label for="company_name_ar_TEMPLATE">اسم الشركة</label>
                                  <input type="text" id="company_name_ar_TEMPLATE" name="company_name_ar[]" placeholder="مثال: شركة الأمل للتجارة" disabled>
                                  <div class="error-message field-error"></div>
                              </div>
                             <div class="form-group">
                                  <label for="company_location_ar_TEMPLATE">موقع الشركة (اختياري)</label>
                                  <input type="text" id="company_location_ar_TEMPLATE" name="company_location_ar[]" placeholder="مثال: جدة، السعودية" disabled>
                                   <div class="error-message field-error"></div>
                              </div>
                             <div class="date-group">
                                  <div class="form-group">
                                      <label for="start_date_exp_TEMPLATE">تاريخ البدء</label>
                                      <input type="month" id="start_date_exp_TEMPLATE" name="start_date_exp[]" disabled>
                                      <div class="error-message field-error"></div>
                                  </div>
                                  <div class="form-group">
                                      <label for="end_date_exp_TEMPLATE">تاريخ الانتهاء</label>
                                      <input type="month" id="end_date_exp_TEMPLATE" name="end_date_exp[]" disabled>
                                      <div class="form-check">
                                           <input type="checkbox" id="present_exp_TEMPLATE" name="present_exp[]" value="1" class="exp-present-checkbox" disabled>
                                           <label for="present_exp_TEMPLATE">أعمل هنا حالياً</label>
                                      </div>
                                      <div class="error-message field-error"></div>
                                  </div>
                             </div>

                             <div class="tasks-section">
                                  <h4>المهام المنجزة (اختياري):</h4>
                                  <div class="task-list">

                                  </div>
                                  <button type="button" class="secondary-btn add-task-btn">
                                      <i class="fas fa-plus"></i> إضافة مهمة
                                  </button>
                              </div>

                              <button type="button" class="remove-entry-btn exp-remove-btn" title="إزالة هذه الخبرة">&times; إزالة الخبرة</button>
                          </div>

                          <div class="task-item template" id="task-template" style="display: none;">
                                <textarea name="tasks_exp_ar[TEMPLATE_INDEX][]" rows="2" placeholder="أضف مهمة قمت بها..." disabled></textarea>
                                <button type="button" class="remove-task-btn" title="إزالة المهمة">&times;</button>
                          </div>

                    </div>
                    <button type="button" id="add-experience-btn" class="secondary-btn add-entry-btn">
                        <i class="fas fa-plus"></i> إضافة خبرة عملية أخرى
                    </button>
                </fieldset>

                <div class="builder-navigation">
                     <a href="cv-builder-ar-step2.php" class="secondary-btn prev-step-btn"><i class="fas fa-arrow-right"></i> السابق: التعليم</a>
                     <button type="submit" class="cta-btn next-step-btn">التالي: المهارات <i class="fas fa-arrow-left"></i></button>
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