/**
 * ملف الجافاسكريبت الرئيسي للموقع
 * يحتوي على:
 * - التحكم بقائمة الموبايل
 * - تأثيرات التمرير (اختياري)
 * - التحقق من صحة النماذج (Client-side)
 * - منطق لوحة التحكم (محاكاة)
 * - منطق معالج بناء السيرة الذاتية (إضافة ديناميكية، تحقق، انتقال)
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed'); // رسالة للتحقق من أن الملف يعمل

    // --- الدوال المساعدة لعرض الأخطاء ---
    function setError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        // محاولة العثور على الحقل المرتبط بناءً على نمط شائع (إزالة -error)
        const inputField = document.getElementById(elementId.replace('-error', ''));
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
             // إضافة فئة للحقل نفسه لتغيير لونه مثلاً
             if(inputField) inputField.classList.add('input-error');
        } else {
            // تحذير إذا لم يتم العثور على عنصر عرض الخطأ المحدد
             console.warn(`Error element not found for ID: ${elementId}`);
             // لا يزال بإمكاننا محاولة إضافة فئة الخطأ للحقل إن وجد
             if(inputField) inputField.classList.add('input-error');
        }
    }

    function displayFormError(message, formId = 'form-error-message') {
        const formErrorElement = document.getElementById(formId);
        if(formErrorElement){
            formErrorElement.textContent = message;
            formErrorElement.style.display = 'block';
            // جعل رسالة الخطأ واضحة بصريًا (إذا لم تكن منسقة بـ CSS كفاية)
            formErrorElement.style.color = '#dc3545';
            formErrorElement.style.fontWeight = 'bold';
            formErrorElement.style.marginBottom = '1rem';
        } else {
             console.warn(`General form error element not found with ID: ${formId}`);
        }
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
            msg.style.display = 'none'; // إخفاء العنصر
        });
        document.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error'); // إزالة فئة الخطأ من الحقول
        });
        // إخفاء رسالة الخطأ العامة للنموذج أيضًا
        const formErrorElement = document.getElementById('form-error-message');
         if(formErrorElement){
             formErrorElement.style.display = 'none';
         }
    }
    // --- نهاية الدوال المساعدة ---


    // --- التحكم بقائمة الموبايل ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        console.log('Mobile menu elements found.'); // Debug
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                 if (navLinks.classList.contains('active')) {
                    // أغلق القائمة فقط إذا كان رابطًا داخليًا أو رابط صفحة
                     if (link.getAttribute('href').startsWith('#') || link.getAttribute('href').includes('.php') || link.getAttribute('href') === '/') {
                        navLinks.classList.remove('active');
                        const icon = menuToggle.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                     }
                }
            });
        });
    } else {
        console.log('Mobile menu elements not found.'); // Debug
    }


    // --- تأثيرات التمرير (اختياري) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0 && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // observer.unobserve(entry.target); // اختياري: إيقاف المراقبة بعد الظهور
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => { observer.observe(element); });
    }


    // --- تأثير تغيير الهيدر عند التمرير (اختياري) ---
    const header = document.getElementById('main-header');
     if(header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }


    // --- التحقق من نموذج التسجيل (Client-side) ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        console.log('Register form found.'); // Debug
         registerForm.addEventListener('submit', function(event) {
            console.log('Register form submit triggered.'); // Debug
            event.preventDefault(); // منع الإرسال دائمًا للتحقق أولاً
            clearErrors();
            let isValid = validateRegistrationForm(); // استدعاء دالة التحقق
            if (isValid) {
                console.log('Register form is valid (Client-side). Submitting to PHP...');
                // *** التعديل الهام: السماح بالإرسال إلى PHP ***
                this.submit(); // إرسال النموذج فعليًا الآن
                // *** نهاية التعديل الهام ***
            } else {
                console.log('Register form validation failed (Client-side).');
                displayFormError('يرجى تصحيح الأخطاء الموضحة.'); // عرض خطأ عام إذا فشل التحقق
            }
        });
    }

    function validateRegistrationForm() {
        console.log('Validating registration form...'); // Debug
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const passwordConfirm = document.getElementById('password_confirmation');
        const terms = document.getElementById('terms');

        // التحققات الأساسية (يمكن إضافة المزيد)
        if (!name || name.value.trim() === '') { setError('name-error', 'حقل الاسم مطلوب.'); isValid = false; }
        if (!email || email.value.trim() === '') { setError('email-error', 'البريد الإلكتروني مطلوب.'); isValid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError('email-error', 'صيغة البريد غير صحيحة.'); isValid = false; }
        if (!password || password.value.length < 8) { setError('password-error', 'كلمة المرور قصيرة (8 أحرف على الأقل).'); isValid = false; }
        if (!passwordConfirm || password.value !== passwordConfirm.value) { setError('password-confirm-error', 'كلمتا المرور غير متطابقتين.'); isValid = false; }
        if (!terms || !terms.checked) { setError('terms-error', 'يجب الموافقة على الشروط.'); isValid = false; }

        console.log(`Registration validation result: ${isValid}`); // Debug
        return isValid;
    }


    // --- التحقق من نموذج تسجيل الدخول (Client-side) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log('Login form found.'); // Debug
        loginForm.addEventListener('submit', function(event) {
            console.log('Login form submit triggered.'); // Debug
            event.preventDefault(); // منع الإرسال للتحقق
            clearErrors();
            let isValid = validateLoginForm(); // استدعاء دالة التحقق
            if (isValid) {
                console.log('Login form is valid (Client-side). Submitting to PHP...');
                // *** التعديل الهام: السماح بالإرسال إلى PHP ***
                this.submit(); // إرسال النموذج فعليًا الآن
                // *** نهاية التعديل الهام ***
            } else {
                console.log('Login form validation failed (Client-side).');
                displayFormError('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
            }
        });
    }

    function validateLoginForm() {
        console.log('Validating login form...'); // Debug
        let isValid = true;
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        if (!email || email.value.trim() === '') { setError('email-error', 'البريد الإلكتروني مطلوب.'); isValid = false; }
        if (!password || password.value.trim() === '') { setError('password-error', 'كلمة المرور مطلوبة.'); isValid = false; }
        console.log(`Login validation result: ${isValid}`); // Debug
        return isValid;
    }


    // --- منطق لوحة التحكم ---
    const cvListContainer = document.getElementById('cv-list');
    const noCvsMessage = document.getElementById('no-cvs-message');
    const createNewCvButton = document.getElementById('create-new-cv-btn');
    const languageModal = document.getElementById('language-selection-modal');
    const closeModalButton = document.querySelector('.close-modal-btn');
    const languageOptionButtons = document.querySelectorAll('.lang-option-btn');
    const logoutButton = document.getElementById('logout-btn');

    // دالة لجلب بيانات لوحة التحكم (محاكاة حاليًا)
    function loadDashboardData() {
        console.log('Loading dashboard data (simulation)...');
        // لاحقًا: استبدل هذا بـ fetch('/api/dashboard-data') لجلب البيانات الحقيقية
        const mockCvData = [
            { id: 1, title: "السيرة الذاتية لتخصص هندسة الحاسوب", lastModified: "28 مارس 2025", language: "ar" },
            { id: 2, title: "Marketing Specialist CV", lastModified: "25 مارس 2025", language: "en" },
            { id: 3, title: "ملف مهندس معماري (ثنائي اللغة)", lastModified: "20 مارس 2025", language: "bilingual" },
        ];
        renderCvList(mockCvData);
    }

    // دالة لعرض قائمة السير الذاتية
    function renderCvList(cvs) {
        if (!cvListContainer || !noCvsMessage) return;
        cvListContainer.innerHTML = '';
        if (!cvs || cvs.length === 0) {
            noCvsMessage.style.display = 'block';
            cvListContainer.style.display = 'none';
        } else {
            noCvsMessage.style.display = 'none';
            cvListContainer.style.display = 'grid'; // أو 'flex' أو 'block' حسب تنسيق CSS
            cvs.forEach(cv => {
                const cvItem = document.createElement('div');
                cvItem.classList.add('cv-item');
                cvItem.setAttribute('data-cv-id', cv.id);
                let badgeClass = '', badgeText = '';
                switch(cv.language) {
                    case 'ar': badgeClass = 'ar'; badgeText = 'عربي'; break;
                    case 'en': badgeClass = 'en'; badgeText = 'English'; break;
                    case 'bilingual': badgeClass = 'bilingual'; badgeText = 'ثنائي اللغة'; break;
                    default: badgeClass = ''; badgeText = cv.language;
                }
                // تعديل الروابط لتشير لملفات PHP (أو المسارات الصحيحة لاحقًا)
                cvItem.innerHTML = `
                    <div class="cv-item-info">
                        ${badgeText ? `<span class="cv-language-badge ${badgeClass}">${badgeText}</span>` : ''}
                        <h3 class="cv-title">${cv.title || 'بدون عنوان'}</h3>
                        <p class="cv-last-modified">آخر تعديل: ${cv.lastModified || 'غير معروف'}</p>
                    </div>
                    <div class="cv-item-actions">
                        <a href="cv-builder-${cv.language}-step1.php?cv_id=${cv.id}" class="action-btn edit-btn" title="تعديل"><i class="fas fa-edit"></i></a>
                        <a href="cv-builder-${cv.language}-step6-output.php?style=classic&cv_id=${cv.id}" class="action-btn preview-btn" title="معاينة" target="_blank"><i class="fas fa-eye"></i></a>
                        <a href="/api/cv/download/${cv.id}" class="action-btn download-btn" title="تحميل PDF"><i class="fas fa-download"></i></a>
                        <button class="action-btn delete-btn" title="حذف"><i class="fas fa-trash-alt"></i></button>
                    </div>`;
                cvListContainer.appendChild(cvItem);
            });
        }
    }

    // تشغيل تحميل البيانات فقط إذا كنا في صفحة لوحة التحكم
    if (document.querySelector('.dashboard-container')) {
        loadDashboardData();
    }

    // فتح نافذة اختيار اللغة
    if (createNewCvButton && languageModal && closeModalButton) {
        createNewCvButton.addEventListener('click', () => languageModal.style.display = 'flex');
        closeModalButton.addEventListener('click', () => languageModal.style.display = 'none');
        window.addEventListener('click', (event) => { if (event.target == languageModal) languageModal.style.display = 'none'; });
    }

    // التعامل مع اختيار اللغة
    if (languageOptionButtons.length > 0) {
        languageOptionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedLang = button.getAttribute('data-lang');
                console.log(`Language selected: ${selectedLang}. Redirecting...`);
                // توجيه لأول خطوة في المسار اللغوي المختار
                window.location.href = `cv-builder-${selectedLang}-step1.php`;
                if(languageModal) languageModal.style.display = 'none';
            });
        });
    }

    // التعامل مع حذف سيرة ذاتية (محاكاة)
    if (cvListContainer) {
        cvListContainer.addEventListener('click', function(event) {
            const targetButton = event.target.closest('button.delete-btn');
            if (!targetButton) return;
            const cvItem = targetButton.closest('.cv-item');
            const cvId = cvItem ? cvItem.getAttribute('data-cv-id') : null;
            if (!cvId) return;

            if (confirm(`هل أنت متأكد من حذف هذه السيرة الذاتية (ID: ${cvId})؟`)) {
                console.log(`Confirmed deletion for CV ID: ${cvId} (Simulation)`);
                // لاحقًا: استبدل هذا بـ fetch DELETE لـ /api/cv/{cvId}
                cvItem.remove(); // إزالة العنصر من الواجهة
                if (cvListContainer.children.length === 0 && noCvsMessage) {
                    noCvsMessage.style.display = 'block';
                    cvListContainer.style.display = 'none';
                }
                alert(`محاكاة: تم حذف السيرة الذاتية ${cvId}`);
            }
        });
    }

    // التعامل مع زر تسجيل الخروج (محاكاة)
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Logout requested (simulation)...');
            // لاحقًا: استبدل هذا بـ fetch POST لـ /api/logout
            alert('تم تسجيل الخروج (محاكاة)!');
            window.location.href = 'login.php';
        });
    }

    // --- منطق معالج بناء السيرة الذاتية ---

    // --- الخطوة 1: المعلومات الشخصية ---
    const cvStep1Form = document.getElementById('cv-step1-form');
    if (cvStep1Form) {
        cvStep1Form.addEventListener('submit', function(event) {
            event.preventDefault();
            clearErrors();
            let isValid = validateCvStep1Form(); // الدالة المحدثة (اختياري)
            if (isValid) { this.submit(); } // الإرسال لـ PHP Step 2
            else { displayFormError('يرجى تصحيح أخطاء الصيغة (إن وجدت).'); }
        });
    }
    function validateCvStep1Form() { // النسخة الاختيارية
        let isValid = true;
        const email = document.getElementById('email');
        const linkedinUrl = document.getElementById('linkedin_url');
        const portfolioUrl = document.getElementById('portfolio_url');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && email.value.trim() !== '' && !emailRegex.test(email.value)) { setError('email-error', '...'); isValid = false; }
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (linkedinUrl && linkedinUrl.value.trim() !== '' && !urlRegex.test(linkedinUrl.value)) { setError('linkedin_url-error', '...'); isValid = false; }
        if (portfolioUrl && portfolioUrl.value.trim() !== '' && !urlRegex.test(portfolioUrl.value)) { setError('portfolio_url-error', '...'); isValid = false; }
        return isValid;
    }


    // --- الخطوة 2: التعليم ---
    const addEducationButton = document.getElementById('add-education-btn');
    const educationEntriesContainer = document.getElementById('education-entries-container');
    const educationTemplate = document.getElementById('education-template');
    let educationEntryIndex = 0;

    function addEducationEntry() { // دالة إضافة حقول التعليم
        if (!educationTemplate || !educationEntriesContainer) return;
        educationEntryIndex++;
        const newEntry = educationTemplate.cloneNode(true);
        newEntry.style.display = 'block'; newEntry.removeAttribute('id'); newEntry.classList.add('education-entry-item');
        newEntry.querySelectorAll('input, textarea, label').forEach(el => {
            const oldId = el.id; const oldFor = el.getAttribute('for');
            if (oldId) el.id = oldId.replace('_0', `_${educationEntryIndex}`);
            if (oldFor) el.setAttribute('for', oldFor.replace('_0', `_${educationEntryIndex}`));
            if (el.tagName === 'INPUT' && el.type !== 'checkbox') el.value = '';
            if (el.tagName === 'TEXTAREA') el.value = '';
            if (el.tagName === 'INPUT' && el.type === 'checkbox') el.checked = false;
            if(el.classList.contains('edu-present-checkbox')) { const endDateInput = newEntry.querySelector(`input[name="end_date_edu[]"]`); if(endDateInput) endDateInput.disabled = false; }
            const errorDiv = newEntry.querySelector(`#${oldId}-error`); if(errorDiv) errorDiv.id = el.id + '-error';
        });
        const removeButton = newEntry.querySelector('.remove-entry-btn');
        if (removeButton) { removeButton.addEventListener('click', function() { newEntry.remove(); }); }
        educationEntriesContainer.appendChild(newEntry);
    }
    if (educationEntriesContainer) { addEducationEntry(); } // إضافة أول عنصر عند التحميل
    if (addEducationButton) { addEducationButton.addEventListener('click', addEducationEntry); }

    const cvStep2Form = document.getElementById('cv-step2-form');
    if (cvStep2Form) {
         cvStep2Form.addEventListener('submit', function(event) {
             event.preventDefault(); clearErrors(); let isValid = validateCvStep2Form(); // استدعاء دالة التحقق
             if (isValid) { this.submit(); } // الإرسال لـ PHP Step 3
             else { displayFormError('يرجى تصحيح أخطاء الصيغة في إدخالات التعليم.'); }
         });
    }
    function validateCvStep2Form() { // النسخة الاختيارية
        let isValid = true;
        const allEntries = document.querySelectorAll('#education-entries-container .education-entry-item:not(#education-template)');
        allEntries.forEach((entry, index) => {
            const startDateInput = entry.querySelector('input[name^="start_date_edu"]');
            const endDateInput = entry.querySelector('input[name^="end_date_edu"]');
            const presentCheckbox = entry.querySelector('input[name^="present_edu"]');
            if (!presentCheckbox?.checked && startDateInput?.value && endDateInput?.value && endDateInput.value < startDateInput.value) {
                 let errorDivId = endDateInput.id ? endDateInput.id + '-error' : `edu_end_date_${index}_error`;
                 setError(errorDivId, 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.'); isValid = false;
             }
        });
        return isValid;
    }
    // مستمع حدث تغيير خانة الاختيار 'present' للتعليم (موجود بالفعل في مكان آخر ربما، تأكد منه)
    document.addEventListener('change', function(event) { // باستخدام تفويض الأحداث
        if (event.target.classList.contains('edu-present-checkbox')) {
            const entryItem = event.target.closest('.education-entry-item');
            if (entryItem) {
                const endDateInput = entryItem.querySelector('input[name^="end_date_edu[]"]');
                if (endDateInput) { endDateInput.disabled = event.target.checked; if (event.target.checked) endDateInput.value = ''; }
            }
        }
         // إضافة نفس المنطق لخانة الخبرة
         if (event.target.classList.contains('exp-present-checkbox')) {
            const entryItem = event.target.closest('.experience-entry-item');
            if (entryItem) {
                const endDateInput = entryItem.querySelector('input[name^="end_date_exp[]"]');
                if (endDateInput) { endDateInput.disabled = event.target.checked; if (event.target.checked) endDateInput.value = '';}
            }
        }
    });


     // --- الخطوة 3: الخبرة والمهام ---
    const addExperienceButton = document.getElementById('add-experience-btn');
    const experienceEntriesContainer = document.getElementById('experience-entries-container');
    const experienceTemplate = document.getElementById('experience-template');
    let experienceEntryIndex = 0;

    function addExperienceEntry() { // دالة إضافة حقول الخبرة
        if (!experienceTemplate || !experienceEntriesContainer) return;
        experienceEntryIndex++;
        const newEntry = experienceTemplate.cloneNode(true);
        newEntry.style.display = 'block'; newEntry.removeAttribute('id'); newEntry.classList.add('experience-entry-item');
        const currentExpIndex = experienceEntryIndex; newEntry.setAttribute('data-index', currentExpIndex);

        newEntry.querySelectorAll('input:not([name^="tasks"]), textarea:not([name^="tasks"]), label:not([for^="task"])').forEach(el => {
             const oldId = el.id; const oldFor = el.getAttribute('for');
             if (oldId) el.id = oldId.replace('_0', `_${currentExpIndex}`);
             if (oldFor) el.setAttribute('for', oldFor.replace('_0', `_${currentExpIndex}`);
             if (el.tagName === 'INPUT' && el.type !== 'checkbox') el.value = '';
             if (el.tagName === 'TEXTAREA') el.value = '';
             if (el.tagName === 'INPUT' && el.type === 'checkbox') el.checked = false;
             if(el.classList.contains('exp-present-checkbox')) { const endDateInput = newEntry.querySelector(`input[name="end_date_exp[]"]`); if(endDateInput) endDateInput.disabled = false; }
             const errorDiv = newEntry.querySelector(`#${oldId}-error`); if(errorDiv) errorDiv.id = el.id + '-error';
         });

        const taskListDiv = newEntry.querySelector('.task-list');
        const addTaskBtn = newEntry.querySelector('.add-task-btn');
        if (addTaskBtn && taskListDiv) { addTaskBtn.addEventListener('click', () => { addTaskInput(taskListDiv, currentExpIndex); }); }

        const removeExpButton = newEntry.querySelector('.exp-remove-btn');
        if (removeExpButton) { removeExpButton.addEventListener('click', function() { newEntry.remove(); }); }

        experienceEntriesContainer.appendChild(newEntry);
        // if (taskListDiv) addTaskInput(taskListDiv, currentExpIndex); // Add one task field initially?
    }

    function addTaskInput(taskListContainer, expIndex) { // دالة إضافة حقل مهمة
         if (!taskListContainer) return;
          const taskItem = document.createElement('div'); taskItem.classList.add('task-item');
          const taskInput = document.createElement('input'); taskInput.type = 'text';
          taskInput.name = `tasks_exp_ar[${expIndex}][]`; taskInput.placeholder = 'أدخل مهمة منجزة...';
          const removeTaskBtn = document.createElement('button'); removeTaskBtn.type = 'button';
          removeTaskBtn.className = 'remove-task-btn'; removeTaskBtn.title = 'إزالة المهمة';
          removeTaskBtn.innerHTML = '&times;'; removeTaskBtn.addEventListener('click', () => { taskItem.remove(); });
          taskItem.appendChild(taskInput); taskItem.appendChild(removeTaskBtn);
          taskListContainer.appendChild(taskItem); taskInput.focus();
    }

    if (experienceEntriesContainer) { addExperienceEntry(); } // إضافة أول عنصر عند التحميل
    if (addExperienceButton) { addExperienceButton.addEventListener('click', addExperienceEntry); }

    const cvStep3Form = document.getElementById('cv-step3-form');
    if (cvStep3Form) {
         cvStep3Form.addEventListener('submit', function(event) {
             event.preventDefault(); clearErrors(); let isValid = validateCvStep3Form(); // استدعاء دالة التحقق
             if (isValid) { this.submit(); } // الإرسال لـ PHP Step 4
             else { displayFormError('يرجى تصحيح أخطاء الصيغة في إدخالات الخبرة.'); }
         });
    }
     function validateCvStep3Form() { // النسخة الاختيارية
        let isValid = true;
        const allEntries = document.querySelectorAll('#experience-entries-container .experience-entry-item:not(#experience-template)');
        allEntries.forEach((entry, index) => {
            const startDateInput = entry.querySelector('input[name^="start_date_exp"]');
            const endDateInput = entry.querySelector('input[name^="end_date_exp"]');
            const presentCheckbox = entry.querySelector('input[name^="present_exp"]');
             if (!presentCheckbox?.checked && startDateInput?.value && endDateInput?.value && endDateInput.value < startDateInput.value) {
                 let errorDivId = endDateInput.id ? endDateInput.id + '-error' : `exp_end_date_${index}_error`;
                 setError(errorDivId, 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.'); isValid = false;
             }
        });
        // No validation for skills textarea needed here anymore
        return isValid;
    }
     // Event listener for 'Present' checkbox in Experience (handled by delegation above)


    // --- الخطوة 4: المهارات ---
    const cvStep4Form = document.getElementById('cv-step4-form');
    if (cvStep4Form) {
        cvStep4Form.addEventListener('submit', function(event) {
            // No real client-side validation needed as it's optional free text
            // Unless you add max length check etc.
            console.log('CV Step 4 form submitted.');
            // Allow default submission
        });
    }


    // --- الخطوة 5: اختيار النمط ---
    const cvStep5FormStyle = document.getElementById('cv-step5-form');
    const styleRadioButtons = cvStep5FormStyle?.querySelectorAll('input[name="style_choice"]');
    if (cvStep5FormStyle && styleRadioButtons && styleRadioButtons.length > 0) {
        styleRadioButtons.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    const selectedStyle = this.value;
                    console.log(`Style selected: ${selectedStyle}. Redirecting...`);
                    // --- Redirect immediately ---
                    window.location.href = `cv-builder-ar-step6-output.php?style=${selectedStyle}`;
                }
            });
             // Optional: Add 'selected' class for visual feedback
             const item = radio.closest('.option-item');
             const label = radio.nextElementSibling;
             radio.addEventListener('change', () => {
                const groupContainer = radio.closest('.options-container');
                if (groupContainer) {
                    groupContainer.querySelectorAll('.option-label').forEach(lbl => lbl.classList.remove('selected'));
                    if (radio.checked && label && label.tagName === 'LABEL') { label.classList.add('selected'); }
                }
            });
             if (radio.checked && label && label.tagName === 'LABEL') { label.classList.add('selected'); }
        });
    } else if (cvStep5FormStyle) {
        console.warn('Step 5 JS: Form found, but no style radio buttons found.');
    }


}); // --- نهاية مستمع الحدث DOMContentLoaded ---
