<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

require_once 'db_connection.php';

$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['user_name'] ?? 'المستخدم';

$cvs_list = [];
$dashboard_error = null;
try {
    $sql = "SELECT id, title, updated_at FROM cvs WHERE user_id = :user_id ORDER BY updated_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $cvs_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    error_log("Error fetching CVs for user $user_id: " . $e->getMessage());
    $dashboard_error = "حدث خطأ أثناء تحميل السير الذاتية المحفوظة.";
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة التحكم - مساري</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/dashboard.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body>

    <header class="main-header">
        <nav class="navbar">
            <div class="container">
                <a href="index.php" class="logo">مساري</a>
                <ul class="nav-links">
                    <li><a href="dashboard.php">لوحة التحكم</a></li>
                    <li><a href="logout.php" class="btn btn-outline">تسجيل الخروج</a></li>
                </ul>
                 <button class="mobile-menu-toggle">☰</button>
            </div>
        </nav>
    </header>

    <main class="dashboard-main">
        <div class="container">

            <section class="welcome-section">
                <h1>أهلاً بك، <?php echo htmlspecialchars($user_name); ?>!</h1>
                <p>هنا يمكنك إدارة سيرك الذاتية والبدء في إنشاء واحدة جديدة.</p>
            </section>

            <section class="create-cv-section">
                <button id="create-cv-btn" class="btn btn-primary btn-lg">
                    <i class="fas fa-plus"></i>
                    أنشئ سيرة ذاتية جديدة
                </button>
            </section>

            <hr class="separator">

            <section class="saved-cvs-section">
                <h2>السير الذاتية المحفوظة</h2>

                <?php if (isset($dashboard_error)): ?>
                    <div class="alert alert-danger"><?php echo htmlspecialchars($dashboard_error); ?></div>
                <?php endif; ?>

                <?php if (empty($cvs_list) && !isset($dashboard_error)): ?>
                    <div class="no-cvs-message">
                        <p>لا توجد لديك أي سير ذاتية محفوظة حتى الآن.</p>
                        <p>ابدأ بإنشاء سيرتك الذاتية الأولى بالضغط على الزر أعلاه!</p>
                    </div>
                <?php elseif (!empty($cvs_list)): ?>
                    <div class="cv-list">
                        <?php foreach ($cvs_list as $cv): ?>
                            <div class="cv-item">
                                <div class="cv-info">
                                    <h3 class="cv-title">
                                        <?php echo !empty($cv['title']) ? htmlspecialchars($cv['title']) : 'سيرة ذاتية بدون عنوان'; ?>
                                    </h3>
                                    <span class="cv-date">
                                        آخر تحديث: <?php echo date('Y-m-d', strtotime($cv['updated_at'])); ?>
                                    </span>
                                </div>
                                <div class="cv-actions">
                                    <a href="cv-builder-ar-step1.php?cv_id=<?php echo $cv['id']; ?>" class="btn btn-secondary btn-sm" title="تعديل">
                                        <i class="fas fa-edit"></i> تعديل
                                    </a>
                                    <a href="cv-builder-ar-step6-output.php?cv_id=<?php echo $cv['id']; ?>&style=modern" target="_blank" class="btn btn-info btn-sm" title="معاينة">
                                         <i class="fas fa-eye"></i> معاينة
                                    </a>
                                    <a href="delete_cv.php?id=<?php echo $cv['id']; ?>" class="btn btn-danger btn-sm delete-cv-btn" title="حذف">
                                         <i class="fas fa-trash-alt"></i> حذف
                                    </a>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </section>

        </div>
    </main>

    <footer class="main-footer">
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> مساري. جميع الحقوق محفوظة.</p>
        </div>
    </footer>

    <div id="language-select-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal-btn">&times;</span>
            <h2>اختر لغة السيرة الذاتية</h2>
            <p>حدد اللغة التي تريد إنشاء سيرتك الذاتية بها.</p>
            <div class="modal-actions">
                <a href="cv-builder-ar-step1.php" class="btn btn-primary">
                    <i class="fas fa-language"></i> عربي
                </a>
                <a href="cv-builder-en-step1.php" class="btn btn-secondary">
                    <i class="fas fa-language"></i> English
                </a>
                <a href="cv-builder-bi-step1.php" class="btn btn-secondary">
                    <i class="fas fa-language"></i> ثنائي اللغة
                </a>
            </div>
        </div>
    </div>

    <script src="js/modal.js"></script>
    <script src="js/script.js"></script>

</body>
</html>