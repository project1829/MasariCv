// js/builder-dynamic-entries.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Dynamic Entries JS Loaded");

    // --- عدادات لتوليد معرفات فريدة ---
    let educationCounter = 1;
    let experienceCounter = 1;
    let certificateCounter = 1;
    // لا نحتاج لعداد مهام منفصل، سيعتمد على عداد الخبرة

    // --- وظيفة عامة لاستنساخ وإعداد قالب ---
    function cloneAndPrepareTemplate(templateId, containerId, counter) {
        const template = document.getElementById(templateId);
        const container = document.getElementById(containerId);

        if (!template || !container) {
            console.error(`Template (${templateId}) or Container (${containerId}) not found.`);
            return null;
        }

        const clone = template.cloneNode(true); // استنساخ عميق

        // إزالة خصائص القالب
        clone.classList.remove('template');
        clone.removeAttribute('id');
        clone.style.display = ''; // إظهار العنصر

        // جعل المعرفات والـ for فريدة
        const elementsWithId = clone.querySelectorAll('[id]');
        elementsWithId.forEach(el => {
            const oldId = el.id;
            const newId = oldId.replace(/_TEMPLATE|_0/g, `_${counter}`); // استبدال TEMPLATE أو 0 بالعداد
            el.id = newId;
            const label = clone.querySelector(`label[for="${oldId}"]`);
            if (label) {
                label.setAttribute('for', newId);
            }
        });

         // جعل أسماء checkbox فريدة إذا لزم الأمر (مهم لـ PHP)
         const checkboxes = clone.querySelectorAll('input[type="checkbox"]');
         checkboxes.forEach(cb => {
             if (cb.name.includes('[]')) {
                 // إذا كان الاسم ينتهي بـ []، قد نحتاج لتضمين العداد
                 // مثال: name="present_edu[INDEX]" بدلاً من name="present_edu[]"
                 // هذا يعتمد على كيفية معالجة PHP للبيانات. الطريقة الحالية بالـ [] قد تكون كافية.
                 // لكن لضمان الربط الدقيق، يمكن فعل التالي:
                 // cb.name = cb.name.replace('[]', `[${counter}]`);
                 // أو إذا كان الاسم يحتوي على TEMPLATE
                 // cb.name = cb.name.replace('_TEMPLATE', `_${counter}`);
             }
         });


        // تفعيل الحقول وإزالة القيم
        const inputs = clone.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.disabled = false;
            if (input.type !== 'checkbox' && input.type !== 'radio') {
                input.value = '';
            }
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            }
        });

        // إظهار زر الحذف (إذا وجد)
        const removeBtn = clone.querySelector('.remove-entry-btn');
        if (removeBtn) {
            removeBtn.style.display = ''; // إظهار زر الحذف
        }
        // إظهار الخط الفاصل (إذا وجد)
        const hr = clone.querySelector('hr');
        if (hr) {
            hr.style.display = '';
        }


        container.appendChild(clone); // إضافة العنصر المستنسخ للحاوية
        return clone; // إرجاع العنصر المستنسخ لمعالجة إضافية (مثل المهام)
    }

    // --- وظيفة عامة لمعالجة الحذف ---
    function handleRemoveEntry(event, containerSelector, itemSelector) {
        if (event.target.matches && event.target.matches('.remove-entry-btn')) {
            const itemToRemove = event.target.closest(itemSelector);
            if (itemToRemove && itemToRemove.parentElement.id === containerSelector.substring(1)) {
                 // تأكيد إضافي (اختياري)
                 // if (!confirm('هل أنت متأكد من إزالة هذا الإدخال؟')) {
                 //     return;
                 // }
                itemToRemove.remove();
            }
        }
         // معالجة حذف المهام بشكل منفصل
         else if (event.target.matches && event.target.matches('.remove-task-btn')) {
            const taskToRemove = event.target.closest('.task-item');
            if (taskToRemove) {
                taskToRemove.remove();
            }
        }
    }

    // --- وظيفة عامة لمعالجة checkbox "الحالي" ---
    function handlePresentCheckbox(event, checkboxSelector, endDateSelector) {
        if (event.target.matches && event.target.matches(checkboxSelector)) {
            const checkbox = event.target;
            const entryItem = checkbox.closest('.entry-item'); // أو .education-entry-item أو .experience-entry-item
            if (entryItem) {
                const endDateInput = entryItem.querySelector(endDateSelector);
                if (endDateInput) {
                    endDateInput.disabled = checkbox.checked;
                    if (checkbox.checked) {
                        endDateInput.value = ''; // مسح القيمة عند التعطيل
                    }
                }
            }
        }
    }

    // --- إعداد قسم التعليم (الخطوة 2) ---
    const educationContainer = document.getElementById('education-entries-container');
    const addEducationBtn = document.getElementById('add-education-btn');

    if (addEducationBtn && educationContainer) {
        addEducationBtn.addEventListener('click', () => {
            cloneAndPrepareTemplate('education-template', 'education-entries-container', educationCounter++);
        });

        educationContainer.addEventListener('click', (event) => {
            handleRemoveEntry(event, '#education-entries-container', '.education-entry-item');
            handlePresentCheckbox(event, '.edu-present-checkbox', 'input[name^="end_date_edu"]');
        });
        // تطبيق منطق checkbox على العناصر الموجودة عند تحميل الصفحة (إذا كان هناك إعادة ملء)
        educationContainer.querySelectorAll('.edu-present-checkbox').forEach(cb => {
             const entryItem = cb.closest('.education-entry-item');
             if(entryItem){
                const endDateInput = entryItem.querySelector('input[name^="end_date_edu"]');
                if(endDateInput) endDateInput.disabled = cb.checked;
             }
        });
    }

    // --- إعداد قسم الخبرة (الخطوة 3) ---
    const experienceContainer = document.getElementById('experience-entries-container');
    const addExperienceBtn = document.getElementById('add-experience-btn');
    const taskTemplate = document.getElementById('task-template'); // قالب المهمة

    if (addExperienceBtn && experienceContainer && taskTemplate) {
        addExperienceBtn.addEventListener('click', () => {
            const newExpEntry = cloneAndPrepareTemplate('experience-template', 'experience-entries-container', experienceCounter);
            if (newExpEntry) {
                // إضافة data-index للعنصر الجديد لتتبع المهام
                newExpEntry.dataset.index = experienceCounter;
                // (اختياري) إضافة مهمة فارغة أولى تلقائياً
                // addTaskToExperience(newExpEntry, taskTemplate, experienceCounter);
            }
            experienceCounter++;
        });

        experienceContainer.addEventListener('click', (event) => {
            // معالجة حذف الخبرة
            handleRemoveEntry(event, '#experience-entries-container', '.experience-entry-item');
            // معالجة checkbox "الحالي" للخبرة
            handlePresentCheckbox(event, '.exp-present-checkbox', 'input[name^="end_date_exp"]');

            // معالجة زر "إضافة مهمة"
            if (event.target.matches && event.target.matches('.add-task-btn')) {
                const experienceEntry = event.target.closest('.experience-entry-item');
                const experienceIndex = experienceEntry ? experienceEntry.dataset.index : null;
                if (experienceEntry && experienceIndex !== null) {
                    addTaskToExperience(experienceEntry, taskTemplate, experienceIndex);
                } else {
                     console.error("Could not find parent experience item or index for Add Task button.");
                }
            }
        });

         // تطبيق منطق checkbox "الحالي" للخبرة عند تحميل الصفحة
         experienceContainer.querySelectorAll('.exp-present-checkbox').forEach(cb => {
             const entryItem = cb.closest('.experience-entry-item');
             if(entryItem){
                const endDateInput = entryItem.querySelector('input[name^="end_date_exp"]');
                if(endDateInput) endDateInput.disabled = cb.checked;
             }
        });
    }

    // --- وظيفة إضافة مهمة لخبرة معينة ---
    function addTaskToExperience(experienceEntry, taskTemplate, experienceIndex) {
        const taskListContainer = experienceEntry.querySelector('.task-list');
        if (!taskListContainer || !taskTemplate) return;

        const taskClone = taskTemplate.cloneNode(true);
        taskClone.classList.remove('template');
        taskClone.removeAttribute('id');
        taskClone.style.display = '';

        const textarea = taskClone.querySelector('textarea');
        if (textarea) {
            textarea.disabled = false;
            textarea.value = '';
            // تعديل الاسم ليشمل index الخبرة الأب
            textarea.name = `tasks_exp_ar[${experienceIndex}][]`;
        }

        taskListContainer.appendChild(taskClone);
    }


    // --- إعداد قسم الشهادات (الخطوة 4) ---
    const certificatesContainer = document.getElementById('certificates-container');
    const addCertificateBtn = document.getElementById('add-certificate-btn');

    if (addCertificateBtn && certificatesContainer) {
        addCertificateBtn.addEventListener('click', () => {
            cloneAndPrepareTemplate('certificate-template', 'certificates-container', certificateCounter++);
        });

        certificatesContainer.addEventListener('click', (event) => {
            handleRemoveEntry(event, '#certificates-container', '.certificate-entry-item');
        });
    }

}); // نهاية DOMContentLoaded