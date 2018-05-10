export const EventEmitter = function () {
  this.subscribe = (event, cb) => {
    this.triggerElement = document.createElement('div');
    this.triggerElement.addEventListener(event, cb);
  };

  this.dispatch = (event = '', payload = {}) => {
    this.triggerElement.dispatchEvent(new CustomEvent(event, {
      detail: payload
    }));
  };
};

export default {
  EventEmitter
};
