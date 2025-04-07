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
        // Close menu when a link is clicked (useful for single-page anchors)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Only close if the link is internal (starts with #) or menu is active
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


    // --- Simple Scroll Animation using Intersection Observer (Optional) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => { observer.observe(element); });
    } else {
        // Fallback for older browsers
        animatedElements.forEach(element => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        });
    }

    // --- Optional: Change Header Style on Scroll ---
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
            let isValid = validateRegistrationForm(); // Assumes function exists below
            if (isValid) {
                console.log('Register form is valid. Submitting...');
                 alert('Register form ready for submission (demonstration)!');
                // Handle actual submission (AJAX recommended for better UX)
                // Example: fetch('/api/register', { method: 'POST', body: new FormData(this) })...
            } else {
                console.log('Register form validation failed.');
                displayFormError('يرجى تصحيح الأخطاء الموضحة.');
            }
        });
    }


    // --- Login Form Validation and Submission Handling ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default page reload
            clearErrors(); // Clear previous errors

            let isValid = validateLoginForm(); // Client-side check (basic)

            if (isValid) {
                console.log('Login form client-side validation passed. Attempting submission...');

                // ***** Preferred Method: Use Fetch API (AJAX) to submit *****
                const formData = new FormData(this);

                // Display loading state (optional)
                const submitButton = this.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'جار التحميل...';

                fetch('/api/login', { // Replace with your actual login API endpoint
                    method: 'POST',
                    body: formData
                    // Add headers if needed (e.g., 'Accept': 'application/json')
                })
                .then(response => {
                    // Check if response is ok (status in the range 200-299)
                    if (!response.ok) {
                         // Try to parse error response from server (if JSON)
                         return response.json().then(errData => {
                            throw { status: response.status, data: errData };
                         }).catch(() => {
                             // Throw generic error if parsing fails
                             throw new Error(`Server responded with status: ${response.status}`);
                         });
                    }
                    return response.json(); // Parse successful JSON response
                })
                .then(data => {
                    // Assuming server responds with { success: true } or similar on success
                    if (data.success) {
                        console.log('Login successful! Redirecting to dashboard...');
                        // ***** THE REDIRECT TO DASHBOARD HAPPENS HERE *****
                        window.location.href = '/dashboard'; // Or your specific dashboard URL
                    } else {
                        // Handle server-side validation errors or incorrect login message
                        console.log('Server indicated login failure:', data.message);
                        displayFormError(data.message || 'فشل تسجيل الدخول. تحقق من بياناتك.');
                         // Optional: display specific field errors if server provides them
                         // if(data.errors) { displayFieldErrors(data.errors); }
                    }
                })
                .catch(error => {
                    // Handle network errors or exceptions during fetch/parsing
                    console.error('Login Error:', error);
                    let errorMessage = 'حدث خطأ غير متوقع أثناء تسجيل الدخول.';
                    if (error.data && error.data.message) {
                        errorMessage = error.data.message; // Use server error message if available
                    } else if (error.message) {
                         // Use generic fetch error message
                         errorMessage = `خطأ في الشبكة أو الخادم: ${error.message}`;
                    }
                    displayFormError(errorMessage);
                })
                .finally(() => {
                    // Always re-enable button and restore text
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });

                // ***** Alternative (Not Recommended for good UX): Allow default form submission *****
                // If you are NOT using Fetch/AJAX above, you might uncomment the line below.
                // In this case, the BACKEND *must* handle the redirect to /dashboard after successful login.
                // console.log('Allowing default form submission (backend handles redirect)');
                // this.submit(); // Submits the form traditionally, causing a page reload

            } else {
                console.log('Login form client-side validation failed.');
                displayFormError('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
            }
        });
    }

}); // End of DOMContentLoaded

// --- Validation Functions ---

function validateRegistrationForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('password_confirmation');
    const terms = document.getElementById('terms');

    // Basic checks - add more specifics as needed
    if (!name || name.value.trim() === '') { setError('name-error', 'حقل الاسم مطلوب.'); isValid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setError('email-error', 'بريد إلكتروني غير صحيح.'); isValid = false; }
    if (!password || password.value.length < 8) { setError('password-error', 'كلمة المرور قصيرة (8 أحرف على الأقل).'); isValid = false; }
    if (!passwordConfirm || password.value !== passwordConfirm.value) { setError('password-confirm-error', 'كلمتا المرور غير متطابقتين.'); isValid = false; }
    if (!terms || !terms.checked) { setError('terms-error', 'يجب الموافقة على الشروط.'); isValid = false; }
    return isValid;
}

function validateLoginForm() {
    let isValid = true;
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    if (!email || email.value.trim() === '') { setError('email-error', 'البريد الإلكتروني مطلوب.'); isValid = false; }
    if (!password || password.value.trim() === '') { setError('password-error', 'كلمة المرور مطلوبة.'); isValid = false; }
    return isValid;
}

// --- Helper functions for displaying errors ---
function setError(elementId, message) {
     const errorElement = document.getElementById(elementId);
     if (errorElement) { errorElement.textContent = message; errorElement.style.display = 'block'; }
     const inputField = document.getElementById(elementId.replace('-error', ''));
     if(inputField) inputField.classList.add('input-error');
}

function displayFormError(message) {
      const formErrorElement = document.getElementById('form-error-message');
     if(formErrorElement){ formErrorElement.textContent = message; formErrorElement.style.display = 'block'; }
}

function displayFieldErrors(errors) { // Use if server returns field-specific errors
    for (const field in errors) {
        // Ensure field name matches the error element id convention
        setError(`${field}-error`, errors[field]);
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(msg => { msg.textContent = ''; msg.style.display = 'none'; });
    document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
     const formErrorElement = document.getElementById('form-error-message');
     if(formErrorElement){ formErrorElement.style.display = 'none'; }
}

// Add CSS for input errors if not already present in your CSS:
/*
.input-error {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2) !important;
}
*/