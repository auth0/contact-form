import jQuery from 'jquery';
import contactForm from '../src/contact-form';

const $ = jQuery;

const contactFormInstance = new contactForm.ContactForm;

contactFormInstance.show();

$('#show-modal').click(contactFormInstance.show);
