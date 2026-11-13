const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  document.body.classList.toggle('menu-open', isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

document.querySelectorAll('[data-product]').forEach((link) => {
  link.addEventListener('click', () => {
    const select = document.querySelector('#product-select');
    if (select) select.value = link.dataset.product;
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

const customerForm = document.querySelector('#customer-form');
const formStatus = document.querySelector('#form-status');

customerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!customerForm.reportValidity()) return;

  const submitButton = customerForm.querySelector('.submit-button');
  const submitLabel = submitButton?.querySelector('span');
  const formData = new FormData(customerForm);

  if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
    formData.set('_url', window.location.href);
  }

  submitButton?.setAttribute('disabled', '');
  submitButton?.setAttribute('aria-busy', 'true');
  if (submitLabel) submitLabel.textContent = 'Sending enquiry…';
  formStatus?.classList.remove('success', 'error');
  if (formStatus) formStatus.textContent = '';

  try {
    const response = await fetch('https://formsubmit.co/ajax/naenterprise6935@gmail.com', {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });
    const result = await response.json();

    if (!response.ok || (result.success !== true && result.success !== 'true')) {
      throw new Error(result.message || 'The enquiry could not be sent.');
    }

    customerForm.reset();
    formStatus?.classList.add('success');
    if (formStatus) formStatus.textContent = 'Thank you — your enquiry has been sent successfully.';
  } catch (error) {
    console.error('Enquiry submission failed:', error);
    formStatus?.classList.add('error');
    if (formStatus) {
      formStatus.textContent = window.location.protocol === 'file:'
        ? 'This form cannot send from a file preview. Please open and submit it on the published website.'
        : 'We could not send your enquiry. Please call +91 99879 37133 or email naenterprise6935@gmail.com.';
    }
  } finally {
    submitButton?.removeAttribute('disabled');
    submitButton?.removeAttribute('aria-busy');
    if (submitLabel) submitLabel.textContent = 'Submit enquiry';
  }
});
