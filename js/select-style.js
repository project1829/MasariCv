// js/select-style.js

document.addEventListener('DOMContentLoaded', function() {
    const styleRadioButtons = document.querySelectorAll('.style-radio-input');
    const nextStepUrlBase = 'cv-builder-ar-step6-output.php'; // الرابط الأساسي للخطوة التالية

    styleRadioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const selectedStyle = this.value;
                // حفظ النمط في الجلسة (اختياري، يمكن الاعتماد فقط على URL)
                // يمكنك استخدام Fetch API لإرسال طلب AJAX إلى سكربت PHP صغير لحفظ النمط في $_SESSION['cv_data']['step5']['style'] إذا أردت
                // مثال باستخدام Fetch (يتطلب سكربت PHP للمعالجة مثل save_style_session.php):
                /*
                fetch('save_style_session.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ style: selectedStyle })
                })
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        // تم الحفظ بنجاح، الآن قم بالتوجيه
                        window.location.href = `${nextStepUrlBase}?style=${selectedStyle}`;
                    } else {
                        // حدث خطأ أثناء الحفظ
                        console.error('Failed to save style choice to session.');
                        // يمكنك عرض رسالة خطأ للمستخدم هنا إذا أردت
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
                */

                // الطريقة الأبسط: التوجيه مباشرة مع تمرير النمط كـ URL parameter
                console.log(`Style selected: ${selectedStyle}. Redirecting...`); // لغرض التصحيح
                window.location.href = `${nextStepUrlBase}?style=${encodeURIComponent(selectedStyle)}`;
            }
        });
    });
});