// --- Add this inside the DOMContentLoaded event listener ---

const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
        // Prevent default form submission
        event.preventDefault();

        // Clear previous errors
        clearErrors();

        // Perform validation
        let isValid = validateRegistrationForm();

        if (isValid) {
            // If valid, you would typically submit the form data via AJAX (Fetch API)
            // For now, we'll just log a message and allow submission (or block it)
            console.log('Form is valid. Submitting...');
            // Uncomment the line below to actually submit after validation (if not using AJAX)
            // this.submit();

            // OR: If using AJAX (Fetch API) - Example structure:
            /*
            const formData = new FormData(this);
            fetch('/api/register', { // Your actual API endpoint
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to login or dashboard
                    window.location.href = 'login.html'; // Or dashboard if auto-login
                } else {
                    // Show server-side errors
                    displayFormError(data.message || 'An error occurred.');
                    if (data.errors) {
                        displayFieldErrors(data.errors);
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayFormError('Could not connect to server.');
            });
            */

           // For demonstration, prevent actual submission here if using AJAX above
           // If not using AJAX, comment the line below and uncomment this.submit()
           alert('النموذج جاهز للإرسال (للخادم)!');


        } else {
            console.log('Form validation failed.');
            // Optionally display a general error message
            displayFormError('يرجى تصحيح الأخطاء الموضحة.');
        }
    });
}

function validateRegistrationForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('password_confirmation');
    const terms = document.getElementById('terms');

    // Name validation (basic check)
    if (name.value.trim() === '') {
        setError('name-error', 'حقل الاسم مطلوب.');
        isValid = false;
    }

    // Email validation (basic format check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        setError('email-error', 'يرجى إدخال بريد إلكتروني صحيح.');
        isValid = false;
    }

    // Password validation
    if (password.value.length < 8) {
        setError('password-error', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.');
        isValid = false;
    }

    // Password confirmation validation
    if (password.value !== passwordConfirm.value) {
        setError('password-confirm-error', 'كلمتا المرور غير متطابقتين.');
        isValid = false;
    } else if (passwordConfirm.value === '') {
         setError('password-confirm-error', 'يرجى تأكيد كلمة المرور.');
        isValid = false;
    }

    // Terms validation
    if (!terms.checked) {
        setError('terms-error', 'يجب الموافقة على الشروط والأحكام.');
        isValid = false;
    }

    return isValid;
}

// --- Helper functions for displaying errors ---
function setError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block'; // Make sure it's visible
    }
     // Optional: Add error class to input field for styling
    const inputField = document.getElementById(elementId.replace('-error', ''));
    if(inputField) inputField.classList.add('input-error');
}

function displayFormError(message) {
     const formErrorElement = document.getElementById('form-error-message');
     if(formErrorElement){
        formErrorElement.textContent = message;
        formErrorElement.style.display = 'block';
     }
}

function displayFieldErrors(errors) { // errors should be an object like {name: 'Error msg', email: '...'}
    for (const field in errors) {
        setError(`${field}-error`, errors[field]);
    }
}


function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.textContent = '';
        msg.style.display = 'none'; // Hide the element
    });
    // Optional: Remove error class from input fields
    const errorInputs = document.querySelectorAll('.input-error');
    errorInputs.forEach(input => input.classList.remove('input-error'));

     const formErrorElement = document.getElementById('form-error-message');
     if(formErrorElement){
         formErrorElement.style.display = 'none';
     }
}

// Add this CSS class for input error styling (optional)
/*
.input-error {
    border-color: #dc3545 !important; // Use !important cautiously
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2) !important;
}
*/