import jQuery from 'jquery';
import contactForm from '../src/contact-form';

const $ = jQuery;
const ContactForm = contactForm.ContactForm;

const contactFormInstance = new ContactForm({
  email: 'alejo.fernandez@auth0.com',
  role: 'IT operations',
  message: 'Hello',
  includePhoneField: true,
  test: true,
  source: 'oss',
  modalTitle: 'Contact Sales Team'
});

const jpContactFormInstance = new ContactForm({
  email: 'alejo.fernandez@auth0.com',
  role: 'IT operations',
  message: 'Hello',
  test: true,
  source: 'oss',
  modalTitle: '弊社営業へのお問い合わせ',
  dictionary: {
    name: '名',
    email: 'Eメール',
    company: '会社',
    role: '',
    message: '',
    send: '送る'
  }
});

$('#show-modal').click(() => contactFormInstance.show());
$('#jp-modal').click(() => jpContactFormInstance.show());
