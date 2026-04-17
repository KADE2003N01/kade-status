const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('theme-toggle');
const bodyEl = document.body;

function applyTheme(theme) {
    const isLight = theme === 'light';
    bodyEl.classList.toggle('light-theme', isLight);
    if (themeToggle) {
        themeToggle.textContent = isLight ? '☀️' : '🌙';
        themeToggle.title = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    }
    localStorage.setItem('theme', theme);
}

function initTheme() {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = storedTheme ? storedTheme : (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = bodyEl.classList.contains('light-theme') ? 'light' : 'dark';
        applyTheme(current === 'light' ? 'dark' : 'light');
    });
}

initTheme();

// Set active link based on current page
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        if (href === currentPage || (!currentPage && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}
setActiveLink();

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    
    // Toggle between hamburger lines and X
    if (isOpen) {
        hamburger.innerHTML = '✕';
        hamburger.style.color = 'var(--accent)';
        document.body.style.overflow = 'hidden';
    } else {
        hamburger.innerHTML = '☰';
        hamburger.style.color = 'var(--white)';
        document.body.style.overflow = 'auto';
    }
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.innerHTML = '☰';
        hamburger.style.color = 'var(--white)';
        document.body.style.overflow = 'auto';
        setActiveLink();
    });
});

const togglePreviewBtn = document.getElementById('toggle-preview-btn');
const cvPreviewContainer = document.getElementById('cv-preview-container');
const uploadBtn = document.getElementById('upload-btn');
const fileUpload = document.getElementById('file-upload');
const fileUploadName = document.getElementById('file-upload-name');

if (togglePreviewBtn && cvPreviewContainer) {
    togglePreviewBtn.addEventListener('click', () => {
        const visible = cvPreviewContainer.style.display !== 'none';
        if (visible) {
            cvPreviewContainer.style.display = 'none';
            togglePreviewBtn.textContent = 'Show Document Preview';
        } else {
            cvPreviewContainer.style.display = 'flex';
            togglePreviewBtn.textContent = 'Hide Document Preview';
        }
    });
}

if (uploadBtn && fileUpload) {
    uploadBtn.addEventListener('click', () => {
        fileUpload.click();
    });
}

// Store all accumulated files
let accumulatedFiles = [];

function renderFileList() {
    const selectedFiles = document.getElementById('selected-files');
    const fileUploadName = document.getElementById('file-upload-name');
    
    if (accumulatedFiles.length === 0) {
        fileUploadName.textContent = '';
        selectedFiles.innerHTML = '';
        const togglePreviewBtn = document.getElementById('toggle-preview-btn');
        if (togglePreviewBtn) togglePreviewBtn.style.display = 'none';
        return;
    }
    
    fileUploadName.textContent = `${accumulatedFiles.length} file(s) total`;
    const togglePreviewBtn = document.getElementById('toggle-preview-btn');
    if (togglePreviewBtn) togglePreviewBtn.style.display = 'inline-block';
    
    selectedFiles.innerHTML = `<div style="color: var(--accent); font-weight:700; margin-bottom:16px; font-size:1.1rem;">📁 Uploaded Files (${accumulatedFiles.length}):</div>` + accumulatedFiles
        .map((file, index) => {
            const isPreviewable = file.type.startsWith('application/pdf') || file.type.startsWith('image/') || file.type.startsWith('text/');
            let fileIcon = '📎'; // Default icon
            
            // Set appropriate icon based on file type
            if (file.type.startsWith('image/')) fileIcon = '🖼️';
            else if (file.type === 'application/pdf') fileIcon = '📄';
            else if (file.type.startsWith('text/')) fileIcon = '📝';
            else if (file.type.startsWith('video/')) fileIcon = '🎥';
            else if (file.type.startsWith('audio/')) fileIcon = '🎵';
            else if (file.type.includes('word') || file.type.includes('document')) fileIcon = '📄';
            else if (file.type.includes('excel') || file.type.includes('spreadsheet')) fileIcon = '📊';
            else if (file.type.includes('powerpoint') || file.type.includes('presentation')) fileIcon = '📽️';
            else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('archive')) fileIcon = '🗜️';
            
            return `<div style="display:grid; grid-template-columns:1fr auto; gap:12px; align-items:center; margin-bottom:12px; padding:14px; background:var(--card-bg); border-radius:10px; border:1px solid var(--accent-dim); transition:all 0.2s;">
                <div style="display:flex; align-items:center; gap:10px; min-width:0;">
                    <span style="font-size:1.3rem;">${fileIcon}</span>
                    <button type="button" data-index="${index}" class="file-link-btn" style="flex:1; text-align:left; color:var(--accent); cursor:pointer; text-decoration:underline; background:none; border:none; font-size:0.95rem; word-break:break-word; padding:0; font-weight:500; transition:0.2s;" onmouseover="this.style.color='#4f46e5'" onmouseout="this.style.color='var(--accent)'">${file.name}</button>
                </div>
                <div style="display:flex; gap:8px; flex-shrink:0;">
                    ${isPreviewable ? `<button type="button" data-index="${index}" class="preview-btn" style="padding:8px 14px; font-size:0.8rem; cursor:pointer; background:var(--accent); color:white; border:none; border-radius:6px; font-weight:600; transition:0.2s;" onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='var(--accent)'">Preview</button>` : ''}
                    <button type="button" data-index="${index}" class="download-btn" style="padding:8px 14px; font-size:0.8rem; cursor:pointer; background:var(--accent-dim); color:var(--white); border:1px solid var(--accent); border-radius:6px; font-weight:600; transition:0.2s;" onmouseover="this.style.background='var(--accent)'" onmouseout="this.style.background='var(--accent-dim)'">Download</button>
                    <button type="button" data-index="${index}" class="remove-btn" style="padding:8px 14px; font-size:0.8rem; cursor:pointer; background:#dc2626; color:white; border:none; border-radius:6px; font-weight:600; transition:0.2s;" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">Remove</button>
                </div>
            </div>`;
        })
        .join('');
    
    // Attach event listeners
    attachFileListeners();
}

function attachFileListeners() {
    const selectedFiles = document.getElementById('selected-files');
    const togglePreviewBtn = document.getElementById('toggle-preview-btn');
    const previewIframe = document.getElementById('cv-preview');
    const imagePreview = document.getElementById('image-preview');
    const cvPreviewContainer = document.getElementById('cv-preview-container');
    
    // File name link click handlers
    selectedFiles.querySelectorAll('.file-link-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.getAttribute('data-index'));
            const file = accumulatedFiles[index];
            const blobUrl = URL.createObjectURL(file);
            
            if (file.type.startsWith('image/') || file.type.startsWith('application/pdf') || file.type.startsWith('text/')) {
                // Open in new tab for previewable files
                window.open(blobUrl, '_blank');
            } else {
                // Download other file types
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }
        });
    });
    
    selectedFiles.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.getAttribute('data-index'));
            const file = accumulatedFiles[index];
            
            if (file.type.startsWith('image/')) {
                const blobUrl = URL.createObjectURL(file);
                if (imagePreview) {
                    imagePreview.innerHTML = `<img src="${blobUrl}" style="max-width:95%; max-height:95%; width:auto; height:auto;" />`;
                    imagePreview.style.display = 'flex';
                }
                if (previewIframe) previewIframe.style.display = 'none';
                if (cvPreviewContainer) cvPreviewContainer.style.display = 'flex';
                if (togglePreviewBtn) togglePreviewBtn.textContent = 'Hide Document Preview';
            } else if (file.type.startsWith('application/pdf')) {
                const blobUrl = URL.createObjectURL(file);
                if (previewIframe) {
                    previewIframe.src = blobUrl;
                    previewIframe.style.display = 'block';
                }
                if (imagePreview) imagePreview.style.display = 'none';
                if (cvPreviewContainer) cvPreviewContainer.style.display = 'flex';
                if (togglePreviewBtn) togglePreviewBtn.textContent = 'Hide Document Preview';
            } else if (file.type.startsWith('text/')) {
                // Handle text files
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (imagePreview) {
                        imagePreview.innerHTML = `<pre style="max-width:95%; max-height:95%; overflow:auto; background:var(--card-bg); padding:20px; border-radius:8px; color:var(--white); font-family:monospace; white-space:pre-wrap;">${e.target.result}</pre>`;
                        imagePreview.style.display = 'flex';
                    }
                    if (previewIframe) previewIframe.style.display = 'none';
                    if (cvPreviewContainer) cvPreviewContainer.style.display = 'flex';
                    if (togglePreviewBtn) togglePreviewBtn.textContent = 'Hide Document Preview';
                };
                reader.readAsText(file);
            }
        });
    });
    
    selectedFiles.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.getAttribute('data-index'));
            const file = accumulatedFiles[index];
            const blobUrl = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        });
    });

    selectedFiles.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = Number(btn.getAttribute('data-index'));
            accumulatedFiles.splice(index, 1);
            renderFileList();
        });
    });
}

if (fileUpload && fileUploadName) {
    fileUpload.addEventListener('change', (event) => {
        const newFiles = Array.from(event.target.files);
        if (newFiles.length > 0) {
            // Add new files to accumulated list
            accumulatedFiles = [...accumulatedFiles, ...newFiles];
            renderFileList();
            
            // Reset file input
            fileUpload.value = '';
        }
    });
}

// Dynamic title changer
const titles = [
    "Frontend Developer",
    "Fullstack Developer", 
    "Social Media Specialist",
    "UI/UX Designer",
    "Web Developer"
];

let titleIndex = 0;
const dynamicTitle = document.getElementById('dynamic-title');

if (dynamicTitle) {
    setInterval(() => {
        titleIndex = (titleIndex + 1) % titles.length;
        const newTitle = "I'm a " + titles[titleIndex];
        dynamicTitle.textContent = newTitle;
        dynamicTitle.setAttribute('data-text', newTitle);
    }, 3000); // Change every 3 seconds
}

// Certificate view toggle functionality
function toggleCertificateView(certificateType) {
    const certificateContainer = document.getElementById(`${certificateType}-certificate`);
    const toggleBtn = document.getElementById(`${certificateType}-toggle-btn`);
    
    if (certificateContainer && toggleBtn) {
        const isVisible = certificateContainer.style.display !== 'none';
        
        if (isVisible) {
            // Hide certificate
            certificateContainer.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-eye" style="margin-right: 5px;"></i>View';
        } else {
            // Show certificate
            certificateContainer.style.display = 'block';
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash" style="margin-right: 5px;"></i>Hide';
        }
    }
}

// Document download functions
function downloadCV() {
    const link = document.createElement('a');
    link.href = '../media/KWIZERA David CV.pdf';
    link.download = 'KWIZERA David CV.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadDocument(filename) {
    const link = document.createElement('a');
    // Handle AIMS certificate specifically
    if (filename === 'AIMS-Certificate.pdf') {
        // You can add the actual AIMS certificate file to the media folder
        // For now, using a placeholder - replace with actual filename when available
        link.href = `../media/${filename}`;
        link.download = filename;
    } else {
        link.href = `../media/${filename}`;
        link.download = filename;
    }
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add click feedback for document cards
document.addEventListener('DOMContentLoaded', function() {
    const cvCard = document.querySelector('.cv-download-card');
    const documentItems = document.querySelectorAll('.document-item');
    
    if (cvCard) {
        cvCard.addEventListener('click', function() {
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
        });
    }
    
    documentItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
        });
    });
});

