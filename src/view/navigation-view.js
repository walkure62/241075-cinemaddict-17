import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  return `
    <a href="#${name.toLowerCase()}" data-filter-type="${name}"
      class="main-navigation__item main-navigation__item--active"}>${name}
      <span class="main-navigation__item-count">${count}</span></a>`;
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">${filterItemsTemplate}</nav>`;
};

export default class NavigationView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {

    return createFilterTemplate(this.#filters);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };


}
