document.addEventListener('DOMContentLoaded', function() {
    // 1. Active Navigation Link Highlighter
    const currentURL = window.location.href;
    const currentPathname = window.location.pathname;
    const currentFilename = currentPathname.substring(currentPathname.lastIndexOf('/') + 1);

    const navLinksList = document.querySelectorAll('.nav-links a');
    
    navLinksList.forEach(link => {
        // Resolve the link's href to a full URL to correctly handle relative paths
        const linkUrl = new URL(link.href);
        const linkFilename = linkUrl.pathname.substring(linkUrl.pathname.lastIndexOf('/') + 1);

        if (currentFilename === linkFilename) {
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
            
            // Accessibility: Update ARIA states
            hamburger.setAttribute('aria-expanded', isOpen);
            hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
            hamburger.textContent = isOpen ? '✕' : '☰';
            hamburger.classList.toggle('open', isOpen);
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Open navigation menu');
                hamburger.textContent = '☰';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'Open navigation menu');
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

// ── Generic Download Handler ──
function downloadFile(path, filename) {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ── Toggle Certificate/Document View ──
function toggleCertificateView(documentId) {
    const certificateElement = document.getElementById(documentId + '-certificate');
    const toggleButton = document.getElementById(documentId + '-toggle-btn');
    
    if (certificateElement && toggleButton) {
        const isCurrentlyVisible = certificateElement.style.display !== 'none';
        const iframe = certificateElement.querySelector('iframe');
        
        if (isCurrentlyVisible) {
            // Hide the certificate
            certificateElement.style.display = 'none';
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.innerHTML = '<i class="fas fa-eye" style="margin-right: 5px;"></i>View';
            // Optional: Clear iframe src when hiding to save resources
            if (documentId === 'cv') {
                if (iframe) {
                    iframe.src = ''; // Clear src to stop loading and save resources
                    const loader = certificateElement.querySelector('.pdf-loader');
                    if (loader) loader.style.display = 'none'; // Hide loader
                }
            }
        } else {
            // Show the certificate
            certificateElement.style.display = 'block';
            toggleButton.setAttribute('aria-expanded', 'true');
            toggleButton.innerHTML = '<i class="fas fa-eye-slash" style="margin-right: 5px;"></i>Hide';
            
            if (documentId === 'cv' && iframe) {
                const loader = certificateElement.querySelector('.pdf-loader');
                const fallback = certificateElement.querySelector('.pdf-fallback');
                
                // Reset state
                if (loader) loader.style.display = 'flex'; // Show loader
                if (fallback) fallback.style.display = 'none';
                
                // Small delay to ensure the DOM has rendered the container before loading the PDF
                // This helps mobile browsers recognize it's an inline view request
                setTimeout(() => {
                    // Append #view=FitH to help mobile viewers scale the document
                    iframe.src = '../media/KWIZERA%20David%20CV.pdf#view=FitH&toolbar=0';
                }, 100);

                iframe.onload = () => {
                    if (loader) loader.style.display = 'none'; // Hide loader
                };

                iframe.onerror = () => {
                    if (loader) loader.style.display = 'none'; // Hide loader
                    if (fallback) fallback.style.display = 'flex'; // Show fallback
                };
            }
        }
    }
}