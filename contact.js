/* =====================================================
   CONTACT.JS — Form validation, FAQ accordion
   ===================================================== */

// ── Contact Form ──
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const successBox = document.getElementById('formSuccess');
  const textarea = document.getElementById('message');
  const charCount = document.getElementById('charCount');

  // Character counter
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      charCount.textContent = len;
      charCount.style.color = len > 450 ? '#e53e3e' : 'var(--gray-light)';
      if (len > 500) textarea.value = textarea.value.slice(0, 500);
    });
  }

  // Input focus micro-animation
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('focus', () => {
      el.parentElement.classList.add('focused');
    });
    el.addEventListener('blur', () => {
      el.parentElement.classList.remove('focused');
      validateField(el);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(el);
    });
  });

  function validateField(el) {
    const id = el.id;
    const errorEl = document.getElementById(id + 'Error');
    let msg = '';

    if (el.required && !el.value.trim()) {
      msg = 'This field is required.';
    } else if (id === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
      msg = 'Please enter a valid email address.';
    }

    if (errorEl) errorEl.textContent = msg;
    el.classList.toggle('error', !!msg);
    return !msg;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) return;

    // Simulate form loading then redirect to WhatsApp
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');

    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline';

    setTimeout(() => {
      const firstName = document.getElementById('firstName').value.trim() || '';
      const lastName = document.getElementById('lastName').value.trim() || '';
      const email = document.getElementById('email').value.trim() || '';
      const phone = document.getElementById('phone').value.trim() || '';
      const subj = document.getElementById('subject').value || 'Inquiry';
      const msg = document.getElementById('message').value.trim() || '';

      // Send form data via FormSubmit AJAX API
      fetch('https://formsubmit.co/ajax/1da53a7abca7c40ed0d412ffe24fef89', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Name: `${firstName} ${lastName}`.trim(),
          Email: email,
          Phone: phone,
          Subject: subj,
          Message: msg,
          _template: 'table'
        })
      })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        submitBtn.style.display = 'none';
        successBox.style.display = 'flex';
        form.reset();
        if (charCount) charCount.textContent = '0';
        
        // Revert button state after 5s
        setTimeout(() => {
            submitBtn.style.display = 'inline-flex';
            successBox.style.display = 'none';
            submitBtn.disabled = false;
            submitText.style.display = 'inline';
            submitLoading.style.display = 'none';
        }, 5000);
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert("Sorry, there was an error submitting the form. Please check your connection or try again later.");
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
      });
    }, 1200);
  });
})();

// ── FAQ Accordion ──
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.faq-q');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      // Open this one if it was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
