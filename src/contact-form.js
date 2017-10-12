/* eslint-env browser */

import jQuery from 'jquery';
import { assign } from 'lodash';
import template from './contact-form.jade';
import './contact-form.styl';

// Globals apis
const $ = jQuery;

export default class ContactForm {
  // Default options
  options = {
    onModalOpen: () => {},
    onFormSuccess: () => {},
    onFormFail: () => {},
    postUrl: 'https://auth0-marketing.run.webtask.io/contact-form',
    modalTitle: 'Contact Sales Team',
    name: '',
    includePhoneField: false,
    includeRoleField: false,
    email: '',
    phone: '',
    company: '',
    role: '',
    message: '',
    roles: ['Software Developer', 'Engineering Exec / Management',
      'C-Level', 'IT operations', 'Product Management',
      'Sales', 'Marketing', 'Security & Compliance', 'Other'],
    source: 'pricing',
    dictionary: {
      name: 'Name',
      email: 'Email address',
      phone: 'Phone Number',
      company: 'Company',
      role: 'Role',
      message: 'Message',
      send: 'Send'
    }
  }

  constructor(options) {
    const dictionary = assign({}, this.options.dictionary, options.dictionary);
    this.options = assign({}, this.options, options, { dictionary });
  }

  /**
   * Show Contact Form
   */
  show(extendedOptions) {
    this.options = assign({}, this.options, extendedOptions);
    this.reset();
    const { modalRoot, elements } = this.getElements();
    const { onModalOpen, onFormSuccess, onFormFail } = this.options;

    modalRoot.on('shown.bs.modal', () => elements[0].focus());
    modalRoot.modal();

    onModalOpen();

    const success = metricsData => {
      // Close modal when animation of submit button ends
      setTimeout(() => modalRoot.modal('hide'), 4000);
      onFormSuccess(metricsData);
    };
    const fail = metricsData => {
      onFormFail(metricsData);
    };

    this.setEventHandlers(success, fail);
  }

  /**
   * Reset: unmount and mount component
   */
  reset() {
    const { modalTitle, name, email, phone, company, role, roles, message, dictionary, includePhoneField, includeRoleField } = this.options;
    const { modalRoot } = this.getElements();

    modalRoot.remove();
    $('body').append(template({ modalTitle, name, email, phone, company, role, roles, message, dictionary, includePhoneField, includeRoleField }));
  }

  /**
   * Get DOM elements
   */
  getElements() {
    const options = {
      modalRoot: $('#contact-form-modal'),
      formRoot: $('#contact-form-modal__form'),
      companyElement: $('#contact-form-modal__company'),
      elements: [
        $('#contact-form-modal__name'),
        $('#contact-form-modal__email'),
        $('#contact-form-modal__company'),
        $('#contact-form-modal__message')
      ],
      submitButton: $('#contact-form-modal__submit')
    };

    if (this.options.includePhoneField) {
      options.elements.push($('#contact-form-modal__phone'));
    }

    if (this.options.includeRoleField) {
      options.elements.push($('#contact-form-modal__role'));
    }

    return options;
  }

  /**
   * Set event handlers: form onSubmit and element onInput
   */
  setEventHandlers(onFormSuccess, onFormFail) {
    const { elements } = this.getElements();

    elements.forEach(this.onInput);
    this.onSubmit(onFormSuccess, onFormFail);
  }

  /*
   * Realtime form field validation, based on his HTML attrs. Also enables company autocomplete
   */
  onInput = element => {
    if (!element) return;

    const { companyElement } = this.getElements();

    const isRequired = !!element.attr('required');
    const isEmail = element.attr('type') === 'email';

    const validateOnInput = () => {
      const value = element.val().trim();
      const hasValue = !!value;
      const checkOther = isRequired ? hasValue : true;
      const checkEmail = isRequired || hasValue ? this.isValidEmail(value) : true;

      const isValid = (() => {
        if (isEmail) {
          return checkEmail;
        }

        return checkOther;
      })();

      if (isValid) {
        element.removeClass('has-error');
      } else {
        element.addClass('has-error');
      }

      if (isEmail && isValid) {
        const emailDomain = value.replace(/.*@/, '');

        if (!this.isFreeEmail(emailDomain)) {
          this.autocompleteCompanyElement(emailDomain);
        } else {
          companyElement.val('');
        }
      }

      return isValid;
    };

    element.on('input', validateOnInput);
    element.on('invalid', () => this.setSubmitButtonState('error'));
  };

  /*
   * Check if is a valid email
   */
  isValidEmail(email) {
    // eslint-disable-next-line max-len, no-useless-escape
    const emailRegex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i);

    return emailRegex.test(email);
  }

  /*
   * Check if is an stock email domain
   */
  isFreeEmail(value) {
    const freeEmails = [
      'gmail.com',
      'live.com', 'hotmail.com', 'outlook.com',
      'yahoo.com',
      'aol.com',
      'icloud.com',
      'gmx.com', 'gmx.us',
      'lycos.com',
      'mail.com',
      'inbox.com'
    ];

    return freeEmails.indexOf(value) > -1;
  }

  /*
   * Autocomplete company field with Clearbit Company Autocomplete API
   */
  autocompleteCompanyElement(companyDomain) {
    const { companyElement } = this.getElements();
    const callback = data => {
      if (!data.length) return;

      companyElement.val(data[0].name);
    };

    $.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${companyDomain}`, callback);
  }

  /*
   * Handle form submit
   */
  onSubmit(successCallback, failCallback) {
    const { postUrl } = this.options;
    const { elements, formRoot } = this.getElements();
    const ChiliPiper = window.ChiliPiper;

    formRoot.submit(e => {
      e.preventDefault();

      this.setSubmitButtonState('process');

      if (!this.checkElementsValidation()) return this.setSubmitButtonState('error');

      const { data, metricsData } = this.getData(elements);

      return $.ajax({ type: 'POST', url: postUrl, data })
        .done((response) => {
          this.setSubmitButtonState('success');
          this.cleanElementsValue();
          successCallback(metricsData);
          if (response.showAssistant && ChiliPiper) {
            ChiliPiper.submit(
              'auth0',
              'dev-contact-form-router', {
                title: 'Thanks! What time works best for a quick call?',
                titleStyle: 'Roboto 22px #EA5938',
                lead: response.fields
              });
          }
        })
        .fail(() => {
          this.setSubmitButtonState('error');
          failCallback(metricsData);
        });
    });
  }

  /*
   * Cleans elements value
   */
  cleanElementsValue() {
    const { elements } = this.getElements();

    elements
      .filter(element => !element.is('select'))
      .forEach(element => element.val(''));
  }

  /*
   * Change state of submit button
   */
  setSubmitButtonState(state) {
    const { submitButton } = this.getElements();

    switch (state) {
      case 'success':
        submitButton
          .removeClass('btn-danger shake btn-loading')
          .addClass('btn-success success tada')
          .html('<span aria-hidden="true" class="btn-icon icon-budicon-390"></span> Sent');
        setTimeout(() => this.setSubmitButtonState('initial'), 3000);
        break;

      case 'error':
        submitButton
          .removeClass('btn-success success btn-loading tada')
          .addClass('btn-danger shake')
          .html('<span aria-hidden="true" class="btn-icon icon-budicon-389"></span> Error');
        setTimeout(() => this.setSubmitButtonState('initial'), 2000);
        break;

      case 'process':
        submitButton
          .removeClass('success btn-danger')
          .addClass('btn-loading')
          .html('<span aria-hidden="true" class="icon-rotating icon-budicon-330"></span>');
        break;

      default:
        submitButton
          .removeClass('success btn-danger btn-loading tada shake')
          .addClass('btn-success')
          .html('Send');
    }
  }

  /*
   * Check elements validation
   */
  checkElementsValidation() {
    const { elements } = this.getElements();

    const result = elements.map(this.checkElementValidation);
    const isValid = result.every(valid => !!valid);

    return isValid;
  }

  /*
   * Check element validation
   */
  checkElementValidation(element) {
    const hasError = element.hasClass('has-error');
    const isRequired = !!element.attr('required');
    const hasValue = !!element.val().trim();
    const isValid = !hasError && isRequired && hasValue;

    return isValid;
  }

  /*
   * Get form and metrics data
   */
  getData() {
    const { elements } = this.getElements();
    const { scheduling } = this.options;

    const data = { scheduling };

    const metricsData = {
      path: window.location.pathname,
      url: window.location.toString(),
      title: document.title,
      referrer: document.referrer
    };

    elements.forEach(element => {
      const key = element.attr('name');
      metricsData[key] = data[key] = element.val();
    });

    data.subject = this.options.source || `New contact from: ${window.location.pathname}`;
    data.source = this.options.source;
    data.referrer = window.location.pathname;
    if (window.metricsLib && window.metricsLib.dwh) {
      data.anonId = window.metricsLib.dwh.anonymousId();
    }

    if (this.options.test) {
      data.test = true;
    }

    metricsData.trackData = metricsData.email;
    metricsData.track_data2 = metricsData.message;
    metricsData.track_data3 = metricsData.name;
    metricsData.track_data4 = metricsData.company;
    metricsData.track_data5 = metricsData.role;
    metricsData.track_data6 = metricsData.phone;

    return { data, metricsData };
  }
}

/**
 * Handle query string to detect `?contact=true` and show contact form
 */
export function handleQueryString(options, showOpts) {
  const { href, search } = window.location;

  // Check if actual url has a query string
  const queryStringHas = query => search.indexOf(query) > -1;

  if (!queryStringHas('contact=true')) return;

  // auto display modal if requested
  const form = new ContactForm(options);
  form.show(showOpts);

  const { modalRoot } = form.getElements();

  // Remove contact=true from the query string on modal close without browser reload
  modalRoot.on('hidden.bs.modal', () => {
    const newurl1 = href.replace('?contact=true', '');
    const newurl2 = href.replace('contact=true', '');
    const definitiveNewUrl = href !== newurl1 ? newurl1 : newurl2;

    window.history.pushState({ path: definitiveNewUrl }, '', definitiveNewUrl);
  });
}
