// --- Add/Update this inside the DOMContentLoaded event listener ---

// --- CV Builder Step 5 (Style Selection) - Immediate Redirect Logic ---
const cvStep5FormStyle = document.getElementById('cv-step5-form'); // Get the form
const styleRadioButtons = cvStep5FormStyle?.querySelectorAll('input[name="style_choice"]'); // Get radio buttons

if (cvStep5FormStyle && styleRadioButtons && styleRadioButtons.length > 0) {
    console.log('Step 5 JS Initialized: Found form and radio buttons.'); // For debugging

    styleRadioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
             console.log(`Radio button ${this.id} changed.`); // For debugging
            if (this.checked) {
                const selectedStyle = this.value;
                console.log(`Style selected: ${selectedStyle}. Redirecting...`);

                 // Optional: Visual feedback - Add 'selected' class to label
                 const groupContainer = this.closest('.options-container');
                 if (groupContainer) {
                     groupContainer.querySelectorAll('.option-label').forEach(lbl => lbl.classList.remove('selected'));
                     const currentLabel = this.nextElementSibling;
                     if (currentLabel && currentLabel.tagName === 'LABEL') {
                         currentLabel.classList.add('selected');
                     }
                 }
                 clearErrors(); // Clear any previous validation errors

                // --- Redirect immediately ---
                window.location.href = `cv-builder-ar-step6-output.php?style=${selectedStyle}`;

            }
        });

         // --- Optional: Apply 'selected' class on initial load if needed ---
         // (Useful if user navigates back and browser remembers selection)
        const initialLabel = radio.nextElementSibling;
         if (radio.checked && initialLabel && initialLabel.tagName === 'LABEL') {
             initialLabel.classList.add('selected');
         }

    }); // End forEach radio

} else if (cvStep5FormStyle) {
     console.warn('Step 5 JS: Form found, but no style radio buttons found inside.'); // Warning
}


// --- Helper Functions (Make sure they exist) ---
function setError(elementId, message) {
     const errorElement = document.getElementById(elementId);
     const inputField = document.getElementById(elementId.replace('-error', ''));
     if (errorElement) { errorElement.textContent = message; errorElement.style.display = 'block'; }
     if(inputField) inputField.classList.add('input-error'); else console.warn(`Input not found for error ${elementId}`);
}

function displayFormError(message) {
      const formErrorElement = document.getElementById('form-error-message');
     if(formErrorElement){ formErrorElement.textContent = message; formErrorElement.style.display = 'block'; }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(msg => { msg.textContent = ''; msg.style.display = 'none'; });
    document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
     const formErrorElement = document.getElementById('form-error-message');
     if(formErrorElement){ formErrorElement.style.display = 'none'; }
}

// --- Include other JS code here (Menu Toggle, Other Validations etc.) ---


// --- Add this inside the DOMContentLoaded event listener ---

// --- CV Builder Step 4 (Skills) Validation (Minimal / Optional) ---
const cvStep4Form = document.getElementById('cv-step4-form');

if (cvStep4Form) {
    cvStep4Form.addEventListener('submit', function(event) {
        // No complex validation needed here usually as it's optional free text
        // You could add a max length check if desired
        let isValid = true; // Assume valid as field is optional
        const skillsTextarea = document.getElementById('skills_ar');

        // Example: Max length check (optional)
        /*
        const MAX_SKILLS_LENGTH = 1500;
        if (skillsTextarea && skillsTextarea.value.length > MAX_SKILLS_LENGTH) {
            clearErrors(); // Clear previous errors first
            setError('skills_ar-error', `المهارات يجب أن لا تتجاوز ${MAX_SKILLS_LENGTH} حرفًا.`);
            isValid = false;
            event.preventDefault(); // Prevent submission if invalid
            displayFormError('يرجى تصحيح الخطأ.');
        }
        */

        // If basic checks pass (or no checks), allow submission
        if (isValid) {
             console.log('CV Step 4 form submitted (no client-side errors).');
            // No preventDefault() needed here if we just want it to submit
            // Or keep preventDefault() and call this.submit() if needed after checks
        } else {
             event.preventDefault(); // Ensure submission is stopped if validation fails
             console.log('CV Step 4 form validation failed (client-side).');
        }

    });
}

// --- Make sure helper functions (setError, clearErrors, displayFormError) are defined ---

// --- تأكد أن هذا الكود داخل مستمعDOMContentLoaded الرئيسي ---

// --- CV Builder Step 3 (Experience ONLY + Tasks) ---

const addExperienceButton = document.getElementById('add-experience-btn');
const experienceEntriesContainer = document.getElementById('experience-entries-container');
const experienceTemplate = document.getElementById('experience-template');
let experienceEntryIndex = 0;

function addExperienceEntry() {
    if (!experienceTemplate || !experienceEntriesContainer) return;
    experienceEntryIndex++;
    const newEntry = experienceTemplate.cloneNode(true);
    newEntry.style.display = 'block';
    newEntry.removeAttribute('id');
    newEntry.classList.add('experience-entry-item');
    const currentExpIndex = experienceEntryIndex; // Capture index for listeners
    newEntry.setAttribute('data-index', currentExpIndex);

    // Update IDs/names/fors for main fields
    newEntry.querySelectorAll('input:not([name^="tasks"]), textarea:not([name^="tasks"]), label:not([for^="task"])').forEach(el => {
        const oldId = el.id;
        const oldFor = el.getAttribute('for');
        if (oldId) el.id = oldId.replace('_0', `_${currentExpIndex}`);
        if (oldFor) el.setAttribute('for', oldFor.replace('_0', `_${currentExpIndex}`));
        if (el.tagName === 'INPUT' && el.type !== 'checkbox') el.value = '';
        if (el.tagName === 'TEXTAREA') el.value = '';
        if (el.tagName === 'INPUT' && el.type === 'checkbox') el.checked = false;
        if(el.classList.contains('exp-present-checkbox')) {
            const endDateInput = newEntry.querySelector(`input[name="end_date_exp[]"]`);
            if(endDateInput) endDateInput.disabled = false;
        }
         const errorDiv = newEntry.querySelector(`#${oldId}-error`);
         if(errorDiv) errorDiv.id = el.id + '-error';
    });

     // Find and setup task-related elements for this specific entry
     const taskListDiv = newEntry.querySelector('.task-list');
     const addTaskBtn = newEntry.querySelector('.add-task-btn');
     if (addTaskBtn && taskListDiv) {
        addTaskBtn.addEventListener('click', () => {
            addTaskInput(taskListDiv, currentExpIndex); // Pass the correct index
        });
     }

    const removeExpButton = newEntry.querySelector('.exp-remove-btn');
    if (removeExpButton) {
        removeExpButton.addEventListener('click', function() { newEntry.remove(); });
    }

    experienceEntriesContainer.appendChild(newEntry);
    // Add one initial task field for convenience? Optional.
    // if (taskListDiv) addTaskInput(taskListDiv, currentExpIndex);
}

// Function to add a task input field
function addTaskInput(taskListContainer, expIndex) {
     if (!taskListContainer) return;
      const taskItem = document.createElement('div');
      taskItem.classList.add('task-item');
      const taskInput = document.createElement('input');
      taskInput.type = 'text';
      taskInput.name = `tasks_exp_ar[${expIndex}][]`; // Use the correct index
      taskInput.placeholder = 'أدخل مهمة منجزة...';
      const removeTaskBtn = document.createElement('button');
      removeTaskBtn.type = 'button';
      removeTaskBtn.className = 'remove-task-btn';
      removeTaskBtn.title = 'إزالة المهمة';
      removeTaskBtn.innerHTML = '&times;';
      removeTaskBtn.addEventListener('click', () => { taskItem.remove(); });
      taskItem.appendChild(taskInput);
      taskItem.appendChild(removeTaskBtn);
      taskListContainer.appendChild(taskItem);
      taskInput.focus();
}

// Add first experience entry on page load
if (experienceEntriesContainer) {
     addExperienceEntry();
}
// Add more experience entries
if (addExperienceButton) {
    addExperienceButton.addEventListener('click', addExperienceEntry);
}

// --- Form Validation for Step 3 (Experience - Optional Fields) ---
const cvStep3Form = document.getElementById('cv-step3-form');
if (cvStep3Form) {
     cvStep3Form.addEventListener('submit', function(event) {
         event.preventDefault();
         clearErrors();
         let isValid = true; // Assume valid initially

         const allExpEntries = experienceEntriesContainer.querySelectorAll('.experience-entry-item:not(#experience-template)');
         allExpEntries.forEach((entry, index) => {
            const startDateInput = entry.querySelector('input[name^="start_date_exp"]');
            const endDateInput = entry.querySelector('input[name^="end_date_exp"]');
            const presentCheckbox = entry.querySelector('input[name^="present_exp"]');

             if (!presentCheckbox?.checked && startDateInput?.value && endDateInput?.value && endDateInput.value < startDateInput.value) {
                 let errorDivId = endDateInput.id ? endDateInput.id + '-error' : `exp_end_date_${index}_error`;
                 setError(errorDivId, 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.');
                 isValid = false;
             }
             // No other mandatory checks
         });

         // --- Skills validation removed from this step ---

         if (isValid) {
             console.log('CV Step 3 form is valid (client-side). Submitting...');
             this.submit(); // Submit to cv-builder-ar-step4-skills.php
         } else {
             console.log('CV Step 3 form validation failed (client-side).');
             displayFormError('يرجى تصحيح أخطاء الصيغة في إدخالات الخبرة.');
         }
     });
}

// Event delegation for 'Present' checkbox change in Experience
document.addEventListener('change', function(event) {
    if (event.target.classList.contains('exp-present-checkbox')) {
        const entryItem = event.target.closest('.experience-entry-item');
        if (entryItem) {
            const endDateInput = entryItem.querySelector('input[name^="end_date_exp[]"]');
            if (endDateInput) {
                endDateInput.disabled = event.target.checked;
                 if (event.target.checked) endDateInput.value = '';
            }
        }
    }
});

// --- Make sure helper functions (setError, clearErrors, displayFormError) are defined ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
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
                if (navLinks.classList.contains('active') && (link.getAttribute('href').startsWith('#') || !link.getAttribute('href').includes('.'))) {
                    navLinks.classList.remove('active');
                     const icon = menuToggle.querySelector('i');
                     if (icon) {
                         icon.classList.remove('fa-times');
                         icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }


    // --- Simple Scroll Animation ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // observer.unobserve(entry.target); // Optional: Unobserve after animation
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => { observer.observe(element); });
    } else {
        animatedElements.forEach(element => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        });
    }

    // --- Optional: Header Scroll Effect ---
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


    // --- Registration Form Validation ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
         registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearErrors();
            let isValid = validateRegistrationForm();
            if (isValid) {
                console.log('Register form is valid. Submitting to server...');
                 // Uncomment the line below ONLY if you are NOT using AJAX and want PHP to handle it
                 // this.submit();
                 alert('محاكاة: نموذج التسجيل جاهز للإرسال للخادم (التحقق الفعلي وإعادة التوجيه يجب أن يتم بواسطة PHP).'); // Placeholder if not submitting
            } else {
                console.log('Register form validation failed.');
                displayFormError('يرجى تصحيح الأخطاء الموضحة.');
            }
        });
    }


    // --- Login Form Validation ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearErrors();
            let isValid = validateLoginForm();
            if (isValid) {
                console.log('Login form valid. Submitting to server...');
                // Uncomment the line below ONLY if you are NOT using AJAX and want PHP to handle it
                // this.submit();
                alert('محاكاة: نموذج الدخول جاهز للإرسال للخادم (التحقق وإعادة التوجيه يجب أن يتم بواسطة PHP).'); // Placeholder if not submitting
            } else {
                console.log('Login form validation failed.');
                displayFormError('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
            }
        });
    }

    // --- Dashboard Logic ---
    const cvListContainer = document.getElementById('cv-list');
    const noCvsMessage = document.getElementById('no-cvs-message');
    const userNamePlaceholder = document.getElementById('user-name-placeholder'); // Note: Dashboard PHP now echoes name directly
    const createNewCvButton = document.getElementById('create-new-cv-btn');
    const languageModal = document.getElementById('language-selection-modal');
    const closeModalButton = document.querySelector('.close-modal-btn');
    const languageOptionButtons = document.querySelectorAll('.lang-option-btn');

    function loadDashboardData() {
        console.log('Loading dashboard data (simulation)...');
        const mockUserData = { name: "عبدالله" }; // Should come from session in PHP
        const mockCvData = [
            { id: 1, title: "السيرة الذاتية لتخصص هندسة الحاسوب", lastModified: "28 مارس 2025", language: "ar" },
            { id: 2, title: "Marketing Specialist CV", lastModified: "25 مارس 2025", language: "en" },
            { id: 3, title: "ملف مهندس معماري (ثنائي اللغة)", lastModified: "20 مارس 2025", language: "bilingual" },
        ];
        // PHP now handles displaying the name directly from session
        // if (userNamePlaceholder && mockUserData.name) {
        //     userNamePlaceholder.textContent = mockUserData.name;
        // }
        renderCvList(mockCvData); // Use mock data for now
        // Replace above with actual fetch('/api/cvs') call later
    }

    function renderCvList(cvs) {
        if (!cvListContainer || !noCvsMessage) return;
        cvListContainer.innerHTML = '';
        if (!cvs || cvs.length === 0) {
            noCvsMessage.style.display = 'block';
            cvListContainer.style.display = 'none';
        } else {
            noCvsMessage.style.display = 'none';
            cvListContainer.style.display = 'grid';
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
                cvItem.innerHTML = `
                    <div class="cv-item-info">
                        ${badgeText ? `<span class="cv-language-badge ${badgeClass}">${badgeText}</span>` : ''}
                        <h3 class="cv-title">${cv.title || 'بدون عنوان'}</h3>
                        <p class="cv-last-modified">آخر تعديل: ${cv.lastModified || 'غير معروف'}</p>
                    </div>
                    <div class="cv-item-actions">
                        <a href="/cv/builder/${cv.language}/edit/${cv.id}" class="action-btn edit-btn" title="تعديل"><i class="fas fa-edit"></i></a>
                        <a href="/cv/preview/${cv.id}" class="action-btn preview-btn" title="معاينة" target="_blank"><i class="fas fa-eye"></i></a>
                        <a href="/api/cv/download/${cv.id}" class="action-btn download-btn" title="تحميل PDF"><i class="fas fa-download"></i></a>
                        <button class="action-btn delete-btn" title="حذف"><i class="fas fa-trash-alt"></i></button>
                    </div>`;
                cvListContainer.appendChild(cvItem);
            });
        }
    }

    if (document.querySelector('.dashboard-container')) {
        loadDashboardData(); // Load data only if on dashboard page
    }

    if (createNewCvButton && languageModal && closeModalButton) {
        createNewCvButton.addEventListener('click', () => languageModal.style.display = 'flex');
        closeModalButton.addEventListener('click', () => languageModal.style.display = 'none');
        window.addEventListener('click', (event) => { if (event.target == languageModal) languageModal.style.display = 'none'; });
    }

    if (languageOptionButtons.length > 0) {
        languageOptionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedLang = button.getAttribute('data-lang');
                console.log(`Language selected: ${selectedLang}`);
                // Assuming separate files for each step start
                window.location.href = `cv-builder-${selectedLang}-step1.php`; // Redirect to first step of chosen language
                if(languageModal) languageModal.style.display = 'none';
            });
        });
    }

    if (cvListContainer) {
        cvListContainer.addEventListener('click', function(event) {
            const targetButton = event.target.closest('button.delete-btn'); // Only handle delete here for demo
            if (!targetButton) return;
            const cvItem = targetButton.closest('.cv-item');
            const cvId = cvItem ? cvItem.getAttribute('data-cv-id') : null;
            if (!cvId) return;

            console.log(`Delete button clicked for CV ID: ${cvId}`);
            if (confirm(`هل أنت متأكد من حذف هذه السيرة الذاتية (ID: ${cvId})؟`)) {
                console.log('Confirmed deletion (simulation).');
                // Simulate deletion: Replace with fetch DELETE request later
                cvItem.remove();
                if (cvListContainer.children.length === 0 && noCvsMessage) {
                    noCvsMessage.style.display = 'block';
                    cvListContainer.style.display = 'none';
                }
                alert(`محاكاة: تم حذف السيرة الذاتية ${cvId}`);
            }
        });
    }

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Logout requested (simulation)...');
            // Simulate logout: Replace with fetch POST to /api/logout later
            alert('تم تسجيل الخروج (محاكاة)!');
            window.location.href = 'login.php';
        });
    }


    // --- CV Builder Step 1 (Personal Info) Validation ---
    const cvStep1Form = document.getElementById('cv-step1-form');
    if (cvStep1Form) {
        cvStep1Form.addEventListener('submit', function(event) {
            event.preventDefault();
            clearErrors();
            let isValid = validateCvStep1Form(); // Use updated validation function
            if (isValid) {
                console.log('CV Step 1 form is valid (client-side). Submitting to next step...');
                this.submit(); // Submit to PHP handler (cv-builder-ar-step2.php)
            } else {
                console.log('CV Step 1 form validation failed (client-side).');
                displayFormError('يرجى تصحيح أخطاء الصيغة (إن وجدت).'); // Update message
            }
        });
    }


    // --- CV Builder Step 2 (Education) - Add/Remove/Validate Logic ---
    const addEducationButton = document.getElementById('add-education-btn');
    const educationEntriesContainer = document.getElementById('education-entries-container');
    const educationTemplate = document.getElementById('education-template');
    let educationEntryIndex = 0;

    function addEducationEntry() {
        if (!educationTemplate || !educationEntriesContainer) return;
        educationEntryIndex++;
        const newEntry = educationTemplate.cloneNode(true);
        newEntry.style.display = 'block';
        newEntry.removeAttribute('id');
        newEntry.classList.add('education-entry-item');

        newEntry.querySelectorAll('input, textarea, label').forEach(el => {
            const oldId = el.id;
            const oldName = el.getAttribute('name');
            const oldFor = el.getAttribute('for');
            if (oldId) el.id = oldId.replace('_0', `_${educationEntryIndex}`);
             // Keep name="degree_ar[]" format for PHP array handling
            // if (oldName) el.setAttribute('name', oldName.replace('[]', `[${educationEntryIndex}]`));
            if (oldFor) el.setAttribute('for', oldFor.replace('_0', `_${educationEntryIndex}`));
            if (el.tagName === 'INPUT' && el.type !== 'checkbox') el.value = '';
            if (el.tagName === 'TEXTAREA') el.value = '';
            if (el.tagName === 'INPUT' && el.type === 'checkbox') el.checked = false;
             // Reset end date disabled state
             if(el.classList.contains('edu-present-checkbox')) {
                const endDateInput = newEntry.querySelector(`input[name="end_date_edu[]"]`); // Find by name now
                if(endDateInput) endDateInput.disabled = false;
            }
            // Associate error divs correctly if needed (maybe using data attributes)
            const errorDiv = newEntry.querySelector(`#${oldId}-error`);
             if(errorDiv) errorDiv.id = el.id + '-error'; // Update error div ID
        });

        const removeButton = newEntry.querySelector('.remove-entry-btn');
        if (removeButton) {
            removeButton.addEventListener('click', function() { newEntry.remove(); });
        }
        // 'Present' checkbox listener added via delegation below

        educationEntriesContainer.appendChild(newEntry);
    }

    // Add the first entry on page load only if the container is present
    if (educationEntriesContainer) {
         addEducationEntry();
    }

    if (addEducationButton) {
        addEducationButton.addEventListener('click', addEducationEntry);
    }

    const cvStep2Form = document.getElementById('cv-step2-form');
    if (cvStep2Form) {
         cvStep2Form.addEventListener('submit', function(event) {
             event.preventDefault();
             clearErrors();
             let isValid = validateCvStep2Form(); // Use updated validation function
             if (isValid) {
                 console.log('CV Step 2 form is valid (client-side). Submitting...');
                 this.submit();
             } else {
                 console.log('CV Step 2 form validation failed (client-side).');
                 displayFormError('يرجى تصحيح أخطاء الصيغة في إدخالات التعليم.');
             }
         });
    }

    // Event delegation for 'Present' checkbox change
    document.addEventListener('change', function(event) {
        if (event.target.classList.contains('edu-present-checkbox')) {
            const entryItem = event.target.closest('.education-entry-item');
            if (entryItem) {
                const endDateInput = entryItem.querySelector('input[name^="end_date_edu"]');
                if (endDateInput) {
                    endDateInput.disabled = event.target.checked;
                     if (event.target.checked) endDateInput.value = '';
                }
            }
        }
    });


}); // End of DOMContentLoaded


// --- Validation Functions ---

function validateRegistrationForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('password_confirmation');
    const terms = document.getElementById('terms');
    if (!name || name.value.trim() === '') { setError('name-error', '...'); isValid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError('email-error', '...'); isValid = false; }
    if (!password || password.value.length < 8) { setError('password-error', '...'); isValid = false; }
    if (!passwordConfirm || password.value !== passwordConfirm.value) { setError('password-confirm-error', '...'); isValid = false; }
    if (!terms || !terms.checked) { setError('terms-error', '...'); isValid = false; }
    return isValid;
}

function validateLoginForm() {
    let isValid = true;
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if (!email || email.value.trim() === '') { setError('email-error', '...'); isValid = false; }
    if (!password || password.value.trim() === '') { setError('password-error', '...'); isValid = false; }
    return isValid;
}

// Updated for Step 1 (All Optional except format checks)
function validateCvStep1Form() {
    let isValid = true;
    const email = document.getElementById('email');
    const linkedinUrl = document.getElementById('linkedin_url');
    const portfolioUrl = document.getElementById('portfolio_url');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && email.value.trim() !== '' && !emailRegex.test(email.value)) {
        setError('email-error', 'صيغة البريد الإلكتروني غير صحيحة.');
        isValid = false;
    }
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (linkedinUrl && linkedinUrl.value.trim() !== '' && !urlRegex.test(linkedinUrl.value)) {
         setError('linkedin_url-error', 'صيغة رابط LinkedIn غير صحيحة.');
         isValid = false;
    }
     if (portfolioUrl && portfolioUrl.value.trim() !== '' && !urlRegex.test(portfolioUrl.value)) {
         setError('portfolio_url-error', 'صيغة رابط معرض الأعمال غير صحيحة.');
         isValid = false;
    }
    return isValid;
}

// Updated for Step 2 (All Optional except format checks)
function validateCvStep2Form() {
    let isValid = true;
    const allEntries = document.querySelectorAll('#education-entries-container .education-entry-item:not(#education-template)');
    allEntries.forEach((entry, index) => {
        const startDateInput = entry.querySelector('input[name^="start_date_edu"]');
        const endDateInput = entry.querySelector('input[name^="end_date_edu"]');
        const presentCheckbox = entry.querySelector('input[name^="present_edu"]');

        // Only validate end date relative to start date if both are present and "present" isn't checked
        if (!presentCheckbox?.checked && startDateInput?.value && endDateInput?.value && endDateInput.value < startDateInput.value) {
             let errorDivId = endDateInput.id ? endDateInput.id + '-error' : `edu_end_date_${index}_error`; // Construct error ID
             setError(errorDivId, 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.');
             isValid = false;
         }
    });
    return isValid;
}


// --- Helper functions for displaying errors ---
function setError(elementId, message) {
     const errorElement = document.getElementById(elementId);
     const inputField = document.getElementById(elementId.replace('-error', '')); // Find input based on error ID convention
     if (errorElement) {
         errorElement.textContent = message;
         errorElement.style.display = 'block';
         // Add error class to the specific input field if found
         if(inputField) inputField.classList.add('input-error');
     } else {
         console.warn(`Error element not found for ID: ${elementId}`); // Warning if error div is missing
         // Add error class to the input field even if error div is missing
          if(inputField) inputField.classList.add('input-error');
     }
}

function displayFormError(message) {
      const formErrorElement = document.getElementById('form-error-message');
     if(formErrorElement){ formErrorElement.textContent = message; formErrorElement.style.display = 'block'; }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(msg => { msg.textContent = ''; msg.style.display = 'none'; });
    document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
     const formErrorElement = document.getElementById('form-error-message');
     if(formErrorElement){ formErrorElement.style.display = 'none'; }
}
// --- Validation function specific to Step 1 (MODIFIED to make fields optional) ---
function validateCvStep1Form() {
    let isValid = true;
    // Get references to elements (no changes here)
    const nameAr = document.getElementById('name_ar');
    const jobTitleAr = document.getElementById('job_title_ar');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const linkedinUrl = document.getElementById('linkedin_url');
    const portfolioUrl = document.getElementById('portfolio_url');

    // --- REMOVED: Checks for empty Name, Job Title, Email ---
    // We no longer check if nameAr, jobTitleAr, or email are empty

    // --- Keep format validation ONLY IF fields are NOT empty ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && email.value.trim() !== '' && !emailRegex.test(email.value)) {
        setError('email-error', 'صيغة البريد الإلكتروني غير صحيحة.'); // Error only if filled incorrectly
        isValid = false;
    }

    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/; // Simple URL regex
    if (linkedinUrl && linkedinUrl.value.trim() !== '' && !urlRegex.test(linkedinUrl.value)) {
         setError('linkedin_url-error', 'صيغة رابط LinkedIn غير صحيحة.');
         isValid = false;
    }
     if (portfolioUrl && portfolioUrl.value.trim() !== '' && !urlRegex.test(portfolioUrl.value)) {
         setError('portfolio_url-error', 'صيغة رابط معرض الأعمال غير صحيحة.');
         isValid = false;
    }

    // No validation needed for phone or address being empty

    return isValid; // Will return true unless an OPTIONAL field has an INVALID FORMAT
}

// Make sure the rest of the script.js file (event listener for the form,
// helper functions like setError, clearErrors, displayFormError) remains the same.
// The submit listener will now call this modified validation function.

// js/script.js (أو js/dashboard.js)

document.addEventListener('DOMContentLoaded', function() {

    // --- تأكيد حذف السيرة الذاتية ---
    const deleteButtons = document.querySelectorAll('.delete-cv-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // منع الانتقال الفوري للرابط
            event.preventDefault();

            // إظهار رسالة التأكيد
            const userConfirmed = confirm('هل أنت متأكد من حذف هذه السيرة الذاتية؟ لا يمكن التراجع عن هذا الإجراء.');

            // إذا أكد المستخدم الحذف، انتقل إلى رابط الحذف
            if (userConfirmed) {
                window.location.href = this.href; // this.href يحتوي على رابط الحذف (مثل delete_cv.php?id=...)
            }
            // إذا لم يؤكد، لا تفعل شيئاً
        });
    });

    // --- يمكنك إضافة أكواد جافاسكريبت أخرى هنا ---
    // مثل التعامل مع القائمة الجانبية في الشاشات الصغيرة
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active'); // يفترض وجود تنسيق .active للقائمة في style.css
        });
    }

});