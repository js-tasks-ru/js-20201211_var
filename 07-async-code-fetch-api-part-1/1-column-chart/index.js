import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {
  subElements = {};
  chartHeight = 50;
  baseUrl = 'https://course-js.javascript.ru';

  constructor({
    label = '',
    link = '',
    path = '',
    range = {
      from: new Date(),
      to: new Date()
    }
  } = {}) {
    this.label = label;
    this.link = link;
    this.range = range;
    this.path = path;
    this.data = [];
    this.value = 0;

    this.render();
    this.update(range.from, range.to);
  }

  getColumnBody(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
      .map(item => {
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
           <div data-element="header" class="column-chart__header">
             ${this.value}
           </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  async update(start, end) {
    this.range = {
      from: start,
      to: end
    };
    this.element.classList.add('column-chart_loading');

    const fullUrl = new URL(this.baseUrl);
    fullUrl.pathname = this.path;
    fullUrl.searchParams.set('from', start);
    fullUrl.searchParams.set('to', end);
    const data = await fetchJson(fullUrl);
    this.data = Object.values(data);
    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
      this.subElements.body.innerHTML = this.getColumnBody(this.data);
    }
    this.value = this.data.reduce((a, b) => a + b, 0);
    this.subElements.header.innerHTML = this.value;
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
