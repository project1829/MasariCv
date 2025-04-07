<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

$allowed_styles = ['classic', 'modern', 'creative', 'simple'];
$chosen_style = $_GET['style'] ?? 'classic';
if (!in_array($chosen_style, $allowed_styles)) {
    $chosen_style = 'classic';
}

$cv_data = $_SESSION['cv_data'] ?? [];
$step1_data = $cv_data['step1'] ?? [];
$step2_data = $cv_data['step2'] ?? [];
$step3_data = $cv_data['step3'] ?? [];
$step4_data = $cv_data['step4'] ?? [];

$personal_info = $step1_data;
$education_entries = $step2_data;
$experience_entries = $step3_data;
$skills_text = $step4_data['skills_ar'] ?? '';
$certificate_entries = $step4_data['certificates'] ?? []; // جلب مصفوفة الشهادات
$summary_text = $personal_info['summary_ar'] ?? '';

$skills_list = [];
if (!empty($skills_text)) {
    $skills_list = preg_split('/[,\r\n]+/', $skills_text);
    $skills_list = array_map('trim', $skills_list);
    $skills_list = array_filter($skills_list);
}

?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="المعاينة النهائية لسيرتك الذاتية - مساري">
    <title>المعاينة النهائية - مساري</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="css/cv-output-base.css">
    <link rel="stylesheet" href="css/cv-output-themes.css">
    <link rel="stylesheet" href="css/print.css" media="print">
</head>
<body class="cv-output-page style-<?php echo htmlspecialchars($chosen_style); ?>">

    <div class="cv-actions no-print">
        <div class="container">
            <a href="cv-builder-ar-step1.php" class="secondary-btn edit-cv-btn">
                <i class="fas fa-edit"></i> تعديل البيانات
            </a>
            <span> | </span>
            <span> النمط المختار: <strong><?php echo htmlspecialchars(ucfirst($chosen_style)); ?></strong> </span>
            <span> | </span>
             <a href="cv-builder-ar-step5-select-style.php" class="secondary-btn change-style-btn">
                <i class="fas fa-palette"></i> تغيير النمط
            </a>
            <button onclick="window.print();" class="cta-btn print-cv-btn">
                <i class="fas fa-print"></i> طباعة / حفظ PDF
            </button>
        </div>
    </div>

    <div class="cv-paper container">

        <header class="cv-header">
            <?php if (!empty($personal_info['name_ar'])): ?>
                <h1><?php echo htmlspecialchars($personal_info['name_ar']); ?></h1>
            <?php endif; ?>
            <?php if (!empty($personal_info['job_title_ar'])): ?>
                <h2><?php echo htmlspecialchars($personal_info['job_title_ar']); ?></h2>
            <?php endif; ?>

            <div class="contact-info">
                <?php if (!empty($personal_info['email'])): ?>
                    <span><i class="fas fa-envelope"></i> <?php echo htmlspecialchars($personal_info['email']); ?></span>
                <?php endif; ?>
                <?php if (!empty($personal_info['phone'])): ?>
                    <span><i class="fas fa-phone"></i> <?php echo htmlspecialchars($personal_info['phone']); ?></span>
                <?php endif; ?>
                 <?php if (!empty($personal_info['address_ar'])): ?>
                    <span><i class="fas fa-map-marker-alt"></i> <?php echo htmlspecialchars($personal_info['address_ar']); ?></span>
                <?php endif; ?>
                 <?php if (!empty($personal_info['linkedin_url'])): ?>
                    <span><i class="fab fa-linkedin"></i> <a href="<?php echo htmlspecialchars($personal_info['linkedin_url']); ?>" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
                <?php endif; ?>
                 <?php if (!empty($personal_info['portfolio_url'])): ?>
                     <span><i class="fas fa-link"></i> <a href="<?php echo htmlspecialchars($personal_info['portfolio_url']); ?>" target="_blank" rel="noopener noreferrer">معرض الأعمال</a></span>
                <?php endif; ?>
            </div>
        </header>

        <?php if (!empty($summary_text)): ?>
            <section class="cv-section cv-summary">
                 <p><?php echo nl2br(htmlspecialchars($summary_text)); ?></p>
            </section>
        <?php endif; ?>

        <?php if (!empty($education_entries) && count(array_filter($education_entries)) > 0 ): ?>
            <section class="cv-section cv-education">
                <h3 class="section-title">المؤهلات التعليمية</h3>
                <?php foreach ($education_entries as $edu): ?>
                    <?php if (!empty($edu['degree_ar']) || !empty($edu['institution_ar'])): ?>
                        <div class="cv-entry">
                            <h4><?php echo htmlspecialchars($edu['degree_ar'] ?? ''); ?></h4>
                            <p class="institution"><?php echo htmlspecialchars($edu['institution_ar'] ?? ''); ?></p>
                            <p class="dates">
                                <?php echo htmlspecialchars($edu['start_date_edu'] ?? ''); ?> -
                                <?php echo !empty($edu['present_edu']) ? 'حتى الآن' : htmlspecialchars($edu['end_date_edu'] ?? ''); ?>
                            </p>
                            <?php if (!empty($edu['description_edu_ar'])): ?>
                                <p class="description"><?php echo nl2br(htmlspecialchars($edu['description_edu_ar'])); ?></p>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </section>
        <?php endif; ?>

        <?php if (!empty($experience_entries) && count(array_filter($experience_entries)) > 0 ): ?>
            <section class="cv-section cv-experience">
                <h3 class="section-title">الخبرة العملية</h3>
                <?php foreach ($experience_entries as $exp): ?>
                     <?php if (!empty($exp['job_title_exp_ar']) || !empty($exp['company_name_ar'])): ?>
                        <div class="cv-entry">
                            <h4><?php echo htmlspecialchars($exp['job_title_exp_ar'] ?? ''); ?></h4>
                            <p class="institution">
                                <?php echo htmlspecialchars($exp['company_name_ar'] ?? ''); ?>
                                <?php if (!empty($exp['company_location_ar'])): ?>
                                    <span class="location">(<?php echo htmlspecialchars($exp['company_location_ar']); ?>)</span>
                                <?php endif; ?>
                            </p>
                            <p class="dates">
                                 <?php echo htmlspecialchars($exp['start_date_exp'] ?? ''); ?> -
                                 <?php echo !empty($exp['present_exp']) ? 'حتى الآن' : htmlspecialchars($exp['end_date_exp'] ?? ''); ?>
                            </p>
                            <?php if (!empty($exp['tasks']) && is_array($exp['tasks'])): ?>
                                <ul class="task-list-output">
                                    <?php foreach ($exp['tasks'] as $task): ?>
                                        <li><?php echo htmlspecialchars($task); ?></li>
                                    <?php endforeach; ?>
                                </ul>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </section>
        <?php endif; ?>

         <?php if (!empty($skills_list)): ?>
            <section class="cv-section cv-skills">
                <h3 class="section-title">المهارات</h3>
                <ul class="skills-list-output">
                    <?php foreach ($skills_list as $skill): ?>
                        <li><?php echo htmlspecialchars($skill); ?></li>
                    <?php endforeach; ?>
                </ul>
            </section>
        <?php endif; ?>

        <?php if (!empty($certificate_entries) && count(array_filter($certificate_entries)) > 0 ): ?>
            <section class="cv-section cv-certificates">
                <h3 class="section-title">الشهادات والدورات</h3>
                <?php foreach ($certificate_entries as $cert): ?>
                    <?php if (!empty($cert['cert_name_ar'])): ?>
                        <div class="cv-entry">
                            <h4><?php echo htmlspecialchars($cert['cert_name_ar']); ?></h4>
                            <?php if (!empty($cert['cert_org_ar']) || !empty($cert['cert_date_ar'])): ?>
                                <p class="institution">
                                    <?php if (!empty($cert['cert_org_ar'])): ?>
                                        <?php echo htmlspecialchars($cert['cert_org_ar']); ?>
                                    <?php endif; ?>
                                    <?php if (!empty($cert['cert_org_ar']) && !empty($cert['cert_date_ar'])): ?>
                                        <span class="separator"> | </span>
                                    <?php endif; ?>
                                    <?php if (!empty($cert['cert_date_ar'])): ?>
                                        <span class="date"><?php echo htmlspecialchars($cert['cert_date_ar']); ?></span>
                                    <?php endif; ?>
                                </p>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </section>
        <?php endif; ?>

    </div>

    <script src="js/script.js"></script>

</body>
</html>,