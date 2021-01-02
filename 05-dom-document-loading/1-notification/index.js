export default class NotificationMessage {
  static CurrentNotification = null;

  constructor(text = "This is info", {
    duration = 2,
    type = 'success'
  } = {}) {
    this.text = text;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${(this.duration / 1000)}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.text}
          </div>
        </div>
      </div>
    `;
  }

  show(targetElement) {
    if (NotificationMessage.CurrentNotification) {
      NotificationMessage.CurrentNotification.destroy();
    }

    if (!targetElement) {
      targetElement = document.body;
    }

    targetElement.append(this.element);

    NotificationMessage.CurrentNotification = this;
    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  update(data) {
    // nothing to do
  }

  remove () {
    this.element.remove();
    NotificationMessage.CurrentNotification = null;
  }

  destroy() {
    this.element = null;
    this.subElements = {};
  }
}
