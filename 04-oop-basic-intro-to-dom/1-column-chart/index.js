export default class ColumnChart {
  constructor({
    data = [],
    label = '',
    link = '',
    value = 0
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;

    this.chartHeight = 50;

    this._render();
  }



  destroy() {
    this.remove();
    this.element = null;
  }

  remove() {
    this.element.remove();
  }

  update(newData) {
    this.data = newData;
  }

  _render() {
    // root
    this.element = document.createElement('div');
    this.element.className = 'column-chart';
    if (this.data.length === 0) {
      this.element.classList.add('column-chart_loading');
    }
    this.element.style.cssText = `--chart-height: ${this.chartHeight}`;

    // title row
    const title = document.createElement('div');
    title.className = 'column-chart__title';
    title.innerHTML = `Total ${this.label}`;

    // View All link
    if (this.link) {
      const viewAllLink = document.createElement('a');
      viewAllLink.setAttribute('href', this.link);
      viewAllLink.className = 'column-chart__link';
      viewAllLink.innerText = 'View all';
      title.append(viewAllLink);
    }

    this.element.append(title);
    // end of title

    // chart container

    const chartContainer = document.createElement('div');
    chartContainer.className = 'column-chart__container';

    // total value
    const chartHeader = document.createElement('div');
    chartHeader.className = 'column-chart__header';
    chartHeader.dataset.element = 'header';
    chartHeader.innerText = this.value;
    chartContainer.append(chartHeader);

    // chart
    const chart = document.createElement('div');
    chart.className = 'column-chart__chart';
    chart.dataset.element = 'body';

    // fill data
    if (this.data.length) {
      const normalizedData = this._getNormalizedData(this.data, this.chartHeight);
      for (const dataRow of normalizedData) {
        const column = this._getColumn(dataRow.value, dataRow.percent);
        chart.append(column);
      }
      chartContainer.append(chart);
    }

    this.element.append(chartContainer);
  }

  _getColumn(value, percent) {
    const column = document.createElement('div');
    column.style.cssText = `--value: ${value}`;
    column.dataset.tooltip = `${percent}%`;
    return column;
  }

  _getNormalizedData(data, maxHeight) {
    if (!data || data.length === 0) {return;}

    const max = Math.max.apply(null, data);
    return data.map((value) => {
      return {
        value: Math.floor((maxHeight / max) * value),
        percent: (value / max * 100).toFixed(0)
      };
    }
    );
  }
}
