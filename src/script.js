document.addEventListener('DOMContentLoaded', function() {
    // 1. Active Navigation Link Highlighter
    const currentURL = window.location.href;
    const navLinksList = document.querySelectorAll('.nav-links a');
    
    navLinksList.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Handle cases like '../index.html' or 'about.html'
        if (currentURL.includes(linkHref.replace('../', ''))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Hamburger Menu Logic
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            hamburger.textContent = isOpen ? '✕' : '☰';
            hamburger.classList.toggle('open', isOpen);
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.textContent = '☰';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.textContent = '☰';
            }
        });
    }

    // 3. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    if (themeToggle) {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            htmlElement.classList.add('light-theme');
            themeToggle.textContent = '☀️';
        }
        
        themeToggle.addEventListener('click', function() {
            htmlElement.classList.toggle('light-theme');
            const isLight = htmlElement.classList.contains('light-theme');
            themeToggle.textContent = isLight ? '☀️' : '🌙';
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }
});

// ── Download CV ──
function downloadCV() {
    // Create a link element to trigger download
    const link = document.createElement('a');
    link.href = '../media/KWIZERA David CV.pdf'; // Path to CV file
    link.download = 'KWIZERA-David-CV.pdf'; // File name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log for tracking (optional)
    console.log('CV download initiated:', new Date().toLocaleString());
}

// ── Toggle Certificate/Document View ──
function toggleCertificateView(documentId) {
    const certificateElement = document.getElementById(documentId + '-certificate');
    const toggleButton = document.getElementById(documentId + '-toggle-btn');
    
    if (certificateElement && toggleButton) {
        const isCurrentlyVisible = certificateElement.style.display !== 'none';
        
        if (isCurrentlyVisible) {
            // Hide the certificate
            certificateElement.style.display = 'none';
            toggleButton.innerHTML = '<i class="fas fa-eye" style="margin-right: 5px;"></i>View';
        } else {
            // Show the certificate
            certificateElement.style.display = 'block';
            toggleButton.innerHTML = '<i class="fas fa-eye-slash" style="margin-right: 5px;"></i>Hide';
        }
    }
}