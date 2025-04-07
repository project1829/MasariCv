// js/modal.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Modal JS: DOMContentLoaded"); // تحقق من أن الملف يُحمّل

    const modal = document.getElementById("language-select-modal");
    const openModalBtn = document.getElementById("create-cv-btn");
    const closeModalBtn = modal ? modal.querySelector(".close-modal-btn") : null;

    // تحقق من وجود العناصر
    if (!modal) {
        console.error("Modal JS: Modal element (#language-select-modal) not found!");
        return; // أوقف التنفيذ إذا لم يتم العثور على النافذة
    }
    if (!openModalBtn) {
        console.error("Modal JS: Open button (#create-cv-btn) not found!");
        // قد لا نوقف التنفيذ هنا، لكن الزر لن يعمل
    }
     if (!closeModalBtn) {
        console.error("Modal JS: Close button (.close-modal-btn) not found inside modal!");
        // قد لا نوقف التنفيذ، لكن زر الإغلاق لن يعمل
    }

    console.log("Modal JS: Elements found:", { modal, openModalBtn, closeModalBtn });

    function openModal() {
        console.log("Modal JS: Opening modal...");
        modal.style.display = "flex"; // استخدام flex للإظهار والتوسيط
        // أو يمكنك إضافة فئة CSS للإظهار
        // modal.classList.add('show');
    }

    function closeModal() {
        console.log("Modal JS: Closing modal...");
        modal.style.display = "none";
         // أو إزالة فئة CSS
        // modal.classList.remove('show');
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
        console.log("Modal JS: Event listener added to open button.");
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
         console.log("Modal JS: Event listener added to close button.");
    }

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            console.log("Modal JS: Click outside modal detected.");
            closeModal();
        }
    });

    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') { // أو تحقق من الفئة .show
            console.log("Modal JS: Escape key pressed.");
            closeModal();
        }
    });

});