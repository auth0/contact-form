import jQuery from 'jquery';
import ContactForm from '../src/contact-form';

const $ = jQuery;

const contactFormInstance = new ContactForm({
  email: 'alejo.fernandez@auth0.com',
  role: 'IT operations',
  message: 'Hello',
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

$('#show-modal').click(() => contactFormInstance.show({ includePhoneField: true }));
$('#jp-modal').click(() => jpContactFormInstance.show());
