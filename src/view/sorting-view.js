import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createNewSortingTemplate = (currentSortType) =>
  `<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.BY_DATE ? 'sort__button--active' : ''}" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SortType.BY_RATING ? 'sort__button--active' : ''}" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
  </ul>`;

export default class SortingView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createNewSortingTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    this.element.querySelector('.sort__button--active').classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

}
