// Contact Form Handler
// This script sends form data to the backend API

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
});

async function handleFormSubmit(e) {
  e.preventDefault();
  
  // Get form inputs
  const nameInput = this.querySelector('input[placeholder="Your Name"]');
  const emailInput = this.querySelector('input[placeholder="Your Email"]');
  const messageInput = this.querySelector('textarea');
  const submitButton = this.querySelector('button[type="submit"]');
  const statusBox = document.getElementById('form-status');
  
  // Get values
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  
  // Basic validation
  if (!name || !email || !message) {
    alert('Please fill out all fields');
    return;
  }
  
  // Disable button during submission
  submitButton.disabled = true;
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Sending...';
  
  try {
    // Send to backend (change URL based on your deployment)
    const backendURL = 'http://localhost:5000/api/contact/';
    // For production, use: const backendURL = 'https://your-backend-url.com/api/contact/send';
    
   const response = await fetch(backendURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            message
        })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      updateStatus('✅ Message sent! Check your inbox for confirmation.', '#10b981');
      this.reset(); // Clear form
    } else {
      updateStatus('❌ Error: ' + (data.error || 'Failed to send'), '#ef4444');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    updateStatus('❌ Connection error. Is the server running?', '#ef4444');
  } finally {
    // Re-enable button
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }

  function updateStatus(msg, color) {
    if (statusBox) {
      statusBox.style.color = color;
      statusBox.innerText = msg;
    }
  }
}
