// --- Add this inside the DOMContentLoaded event listener ---

// --- Dashboard Specific Logic ---
const cvListContainer = document.getElementById('cv-list');
const noCvsMessage = document.getElementById('no-cvs-message');
const userNamePlaceholder = document.getElementById('user-name-placeholder');
const createNewCvButton = document.getElementById('create-new-cv-btn');
const languageModal = document.getElementById('language-selection-modal');
const closeModalButton = document.querySelector('.close-modal-btn');
const languageOptionButtons = document.querySelectorAll('.lang-option-btn');


// --- Simulate fetching user data and CVs (Replace with actual API call) ---
function loadDashboardData() {
    console.log('Loading dashboard data...');

    // --- Simulate API call ---
    const mockUserData = { name: "عبدالله" }; // Replace with actual user name
    const mockCvData = [
        { id: 1, title: "السيرة الذاتية لتخصص هندسة الحاسوب", lastModified: "28 مارس 2025", language: "ar" },
        { id: 2, title: "Marketing Specialist CV", lastModified: "25 مارس 2025", language: "en" },
        { id: 3, title: "ملف مهندس معماري (ثنائي اللغة)", lastModified: "20 مارس 2025", language: "bilingual" },
    ];
    // --- End Simulation ---

    // --- Actual API call structure ---
    /*
    fetch('/api/dashboard-data') // Your endpoint to get user name and CV list
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            // Update user name
            if (userNamePlaceholder && data.userName) {
                userNamePlaceholder.textContent = data.userName;
            }
            // Render CV list
            renderCvList(data.cvs || []); // Expect server to send cvs array
        })
        .catch(error => {
            console.error('Failed to load dashboard data:', error);
            // Show error message to user maybe?
            if(cvListContainer) cvListContainer.innerHTML = '<p>خطأ في تحميل بيانات السيرة الذاتية.</p>';
             if (noCvsMessage) noCvsMessage.style.display = 'none'; // Hide empty message on error
        });
    */
   // --- Using Mock Data for now ---
    if (userNamePlaceholder && mockUserData.name) {
        userNamePlaceholder.textContent = mockUserData.name;
    }
    renderCvList(mockCvData);
    // --- End Using Mock Data ---

}

// --- Function to render the list of CVs ---
function renderCvList(cvs) {
    if (!cvListContainer || !noCvsMessage) return;

    cvListContainer.innerHTML = ''; // Clear previous list

    if (!cvs || cvs.length === 0) {
        noCvsMessage.style.display = 'block'; // Show the 'no CVs' message
        cvListContainer.style.display = 'none'; // Hide the list container
    } else {
        noCvsMessage.style.display = 'none'; // Hide the 'no CVs' message
        cvListContainer.style.display = 'grid'; // Show the list container (or default display)

        cvs.forEach(cv => {
            const cvItem = document.createElement('div');
            cvItem.classList.add('cv-item');
            cvItem.setAttribute('data-cv-id', cv.id); // Store ID for actions

            // Basic language badge logic
            let badgeClass = '';
            let badgeText = '';
            switch(cv.language) {
                case 'ar': badgeClass = 'ar'; badgeText = 'عربي'; break;
                case 'en': badgeClass = 'en'; badgeText = 'English'; break;
                case 'bilingual': badgeClass = 'bilingual'; badgeText = 'ثنائي اللغة'; break;
                default: badgeClass = ''; badgeText = cv.language; // Fallback
            }

            cvItem.innerHTML = `
                <div class="cv-item-info">
                    ${badgeText ? `<span class="cv-language-badge ${badgeClass}">${badgeText}</span>` : ''}
                    <h3 class="cv-title">${cv.title || 'بدون عنوان'}</h3>
                    <p class="cv-last-modified">آخر تعديل: ${cv.lastModified || 'غير معروف'}</p>
                </div>
                <div class="cv-item-actions">
                     {/* Adjust href based on language and ID */}
                    <a href="/cv/builder/${cv.language}/edit/${cv.id}" class="action-btn edit-btn" title="تعديل"><i class="fas fa-edit"></i></a>
                    <a href="/cv/preview/${cv.id}" class="action-btn preview-btn" title="معاينة" target="_blank"><i class="fas fa-eye"></i></a> {/* Example preview link */}
                    <a href="/api/cv/download/${cv.id}" class="action-btn download-btn" title="تحميل PDF"><i class="fas fa-download"></i></a> {/* Example download link */}
                    <button class="action-btn delete-btn" title="حذف"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            cvListContainer.appendChild(cvItem);
        });
    }
}

// --- Event Listeners for Dashboard Actions ---

// Load data when the dashboard page loads (if on dashboard page)
if (document.querySelector('.dashboard-container')) {
    loadDashboardData();
}

// Show Language Modal when "Create New CV" is clicked
if (createNewCvButton && languageModal && closeModalButton) {
    createNewCvButton.addEventListener('click', () => {
        languageModal.style.display = 'flex'; // Show modal
    });

    // Hide Modal when close button is clicked
    closeModalButton.addEventListener('click', () => {
        languageModal.style.display = 'none';
    });

    // Hide Modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target == languageModal) {
            languageModal.style.display = 'none';
        }
    });
}

// Handle Language Selection Button Clicks
if (languageOptionButtons.length > 0) {
    languageOptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.getAttribute('data-lang');
            console.log(`Language selected: ${selectedLang}`);
            // Redirect to the correct builder path
            window.location.href = `/cv/builder/${selectedLang}/step/personal-info`; // Or just /cv/builder/{lang}/create
            // Close the modal if needed
             if(languageModal) languageModal.style.display = 'none';
        });
    });
}


// --- Handle CV Action Buttons (Edit, Delete etc.) using Event Delegation ---
if (cvListContainer) {
    cvListContainer.addEventListener('click', function(event) {
        const targetButton = event.target.closest('button.action-btn, a.action-btn'); // Find closest button/link

        if (!targetButton) return; // Exit if click wasn't on an action button

        const cvItem = targetButton.closest('.cv-item');
        const cvId = cvItem ? cvItem.getAttribute('data-cv-id') : null;

        if (!cvId) return; // Exit if couldn't find CV ID

        if (targetButton.classList.contains('delete-btn')) {
            // --- Handle Delete Action ---
            console.log(`Delete button clicked for CV ID: ${cvId}`);
            // Show confirmation dialog
            if (confirm(`هل أنت متأكد من حذف هذه السيرة الذاتية (ID: ${cvId})؟ لا يمكن التراجع عن هذا الإجراء.`)) {
                console.log('Confirmed deletion.');
                // --- Simulate API Call for Delete ---
                 // Replace with actual fetch DELETE request to /api/cv/{cvId}
                 fetch(`/api/cv/${cvId}`, { method: 'DELETE' })
                    .then(response => {
                         if (!response.ok) { throw new Error('Failed to delete'); }
                         return response.json(); // Or response.text() if no body
                     })
                    .then(data => {
                         console.log('Delete successful:', data);
                         // Remove the item from the UI
                         cvItem.remove();
                         // Check if the list is now empty
                         if (cvListContainer.children.length === 0 && noCvsMessage) {
                            noCvsMessage.style.display = 'block';
                             cvListContainer.style.display = 'none';
                         }
                    })
                    .catch(error => {
                        console.error('Error deleting CV:', error);
                        alert('حدث خطأ أثناء محاولة حذف السيرة الذاتية.');
                    });
                // --- End Simulation ---
            } else {
                console.log('Deletion cancelled.');
            }
        }
        // Add handling for other buttons if they don't use href directly
        // else if (targetButton.classList.contains('edit-btn')) { ... }
        // else if (targetButton.classList.contains('preview-btn')) { ... }
        // else if (targetButton.classList.contains('download-btn')) { ... }
    });
}


// --- Logout Button Functionality (Placeholder) ---
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
    logoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        console.log('Logout requested...');
        // --- Simulate API call for logout ---
        // fetch('/api/logout', { method: 'POST' })...
        alert('تم تسجيل الخروج (محاكاة)!'); // Placeholder message
        // Redirect to login page after successful logout
        window.location.href = 'login.html';
        // --- End Simulation ---
    });
}