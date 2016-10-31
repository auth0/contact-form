import jQuery from 'jquery';
import contactForm from '../src/contact-form';

const $ = jQuery;
const ContactForm = contactForm.ContactForm;

const contactFormInstance = new ContactForm({
  email: 'alejo.fernandez@auth0.com',
  role: 'IT operations',
  message: 'Hello',
  test: true,
  source: 'oss'
});

contactFormInstance.show();

$('#show-modal').click(() => contactFormInstance.show());
