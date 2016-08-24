# Auth0 Contact Form

<img width="581" alt="screen shot 2016-07-18 at 2 32 33 pm" src="https://cloud.githubusercontent.com/assets/7464663/16926231/36bc613c-4cfe-11e6-9cdb-698949e8a413.png">

## Install
```javascript
npm i --save auth0-contact-form jquery@2
```

## Usage

Needs jQuery, because is a peer dependency.

### Example

`index.js`
```javascript
import jQuery from 'jquery';
import { ContactForm } from 'auth0-contact-form';

const metricsLib = window.metricsLib;
const $ = jQuery;
const options = {
  onFormSuccess(metricsData) {
    metricsLib.track('contact-form-success', metricsData);
  }
};

const contactForm = new ContactForm(options);

$('.btn').click(contactForm.show);
```

`index.styl`
```stylus
@import '../node_modules/auth0-contact-form/dist/contact-form.css'
```

### Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
onModalOpen | function | () => {} | On modal open callback, has `metricsData` arg with metrics data.
onFormSuccess | function | () => {} | On form success callback, has `metricsData` arg with metrics data.
onFormFail | function | () => {} | On form fail callback, has `metricsData` arg with metrics data.
postUrl | string | 'https://webtask.it.auth0.com/api/run/auth0-generic/contact-form-mandrill' | Url to send post data of form.
modalTitle | string | 'Contact Sales Team' | Modal title.

### Methods

Method | Argument | Description
------ | -------- | -----------
show |  | Shows contact form modal

### Handle query string

Also this package exports a function `handleQueryString` that triggers the contact form if `?contact=true` is on the url.

Example:
```javascript
import jQuery from 'jquery';
import { handleQueryString } from 'auth0-contact-form';

const options = {
  postUrl: 'https://myserver.com/contact'
};

handleQueryString(options);
```

## Development

Run:
```shell
git clone git@github.com:auth0/contact-form.git
cd contact-form
npm install
npm start
```
And point your browser at `http://localhost:3001`.

### Release

Make sure you have [bump](https://github.com/ianstormtaylor/bump) and [git-extras](https://github.com/tj/git-extras)
Follow the next steps:

```shell
  # Once finished your changes and commit them, run:
  bump {patch,minor,major,VERSION}

  # Then create the changelog for the release, using
  # the retrieved version by last command:
  git changelog --tag <version>

  # Then, just run:
  git add . && git release <version>

  # Publish to npm
  npm publish

  # Done!
```

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## License

Auth0 Web Header is [MIT licensed](./LICENSE.md).
