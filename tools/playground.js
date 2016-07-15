import jQuery from 'jquery';
import ContactForm from '../src/contact-form';

const $ = jQuery;

const contactForm = new ContactForm;

contactForm.show();

$('#show-modal').click(contactForm.show);
