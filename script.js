document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Optional: Change icon class for better UX (e.g., bars to times)
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when a link is clicked (useful for single-page anchors)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
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


    // --- Simple Scroll Animation using Intersection Observer ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Unobserve after animation to save resources
                    // observer.unobserve(entry.target);
                }
                // Optional: Remove 'visible' class if element scrolls out of view
                // else {
                //     entry.target.classList.remove('visible');
                // }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
            // rootMargin: "0px 0px -50px 0px" // Optional: Adjust trigger point
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers (simply make elements visible)
        animatedElements.forEach(element => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
        });
    }


    // --- Optional: Change Header Style on Scroll ---
    const header = document.getElementById('main-header');
    if(header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Add class after scrolling 50px
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

});

// Add this corresponding CSS for the scrolled header effect (optional)
/*
#main-header.scrolled {
    padding: 5px 0; // Reduce padding
    box-shadow: 0 3px 8px rgba(0,0,0,0.1); // Slightly stronger shadow
}
#main-header.scrolled .logo {
    font-size: 1.6rem; // Slightly smaller logo
}
*/

