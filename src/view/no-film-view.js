import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoFilmTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.FAVORITES]: 'There are no favorite movies in you list. Try to add something',
  [FilterType.HISTORY]: 'There are no movies in your history list. Let\'s choose and watch something',
  [FilterType.WATCHLIST]: 'There are no movies in your watchlist. Let\'s add some movies to your watchlist',
};

const createNoFilmTemplate = (filterType) => (
  `<h2 class="films-list__title">${NoFilmTextType[filterType]}</h2>`
);

export default class NoFilmView extends AbstractView {
  #filterType = null;

  constructor (filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoFilmTemplate(this.#filterType);
  }

}
