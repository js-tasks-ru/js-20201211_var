export default class SortableTable {

  constructor(header, params) {
    this.header = header;
    this.data = params.data;
    this.render(this.data);
  }

  render(data) {
    const element = document.createElement('div');
    element.innerHTML = this.template(data);
    this.element = element.firstElementChild;
    this.subElements = this._getSubElements(this.element);
    return this.element;
  }

  _getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  template(data) {
    return `
      <div class="sortable-table">

    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this._createHeaders()}
    </div>

    <div data-element="body" class="sortable-table__body">
      ${this._getItems(data)}
    </div>

    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>

  </div>
    `;
  }

  _getItems(data = []) {
    let result = '';
    for (const item of data) {
      result += this.getItemRow(item);
    }
    return result;
  }

  getItemRow(item) {
    return `
    <a href="/products/${item.id}" class="sortable-table__row">
        ${this._getDataRowColumnValues(item)}
    </a>
    `;
  }

  _getDataRowColumnValues(item) {
    let result = '';
    for (const headerElement of this.header) {
      if (headerElement.template) {
        result += headerElement.template(item.images);
        continue;
      }

      result += `<div class="sortable-table__cell">${item[headerElement.id]}</div>`;
    }
    return result;
  }

  _createHeaders() {
    return this.header.reduce((previous, current) => {
      return previous += this._getColumnHeader(current);
    }, "");
  }

  _getColumnHeader({
    id = '',
    title = '',
    sortable = true,
    sortType = ''
  } = {}) {
    return `
      <div class="sortable-table__cell" data-sortable="${sortable}" data-order="desc">
        <span>${title}</span>
        ${sortable ? this.sortArrow : ''}
      </div>
    `;
  }

  get sortArrow() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  sort(field = 'title', direction = 'asc') {
    const fieldHeader = this.header.find(obj => {
      return obj.id === field;
    });
    const sortType = fieldHeader.sortType;
    const directionMultiplier = (direction === 'asc') ? 1 : -1;

    const sortedData = [...this.data].sort((item1, item2) => {
      if (sortType === 'string') {
        return directionMultiplier * this._sortStringsComparer(item1[field], item2[field]);
      }

      if (sortType === 'number') {
        return directionMultiplier * this._sortNumericComparer(item1[field], item2[field]);
      }

      throw 'not supported';
    });

    const parent = this.element.parentNode;
    if (this.element) {
      this.element.remove();
    }

    parent.append(this.render(sortedData));
  }

  _sortStringsComparer(str1, str2) {
    return str1.localeCompare(str2, ['ru', 'en'], { caseFirst: 'upper' });
  }

  _sortNumericComparer(num1, num2) {
    return num1 - num2;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}

