import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {name, count} = filter;
  const type = currentFilterType;

  return `
    <a href="#${name.toLowerCase()}" data-filter-type="${name}"
      class="main-navigation__item ${type === name ? 'main-navigation__item--active' : ''}">${name}
      <span class="main-navigation__item-count">${count}</span></a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, currentFilterType, index === 0))
    .join('');

  return `<nav class="main-navigation">${filterItemsTemplate}</nav>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    this.element.querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');
    evt.target.classList.add('main-navigation__item--active');
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };


}
