import AbstractView from '../framework/view/abstract-view.js';
import {humanizeRuntime, getYearFromReleaseDate} from '../utils/film.js';


const MAX_DESCRIPTION_LENGTH = 140;
const MIN_DESCRIPTION_LENGTH = 0;

const createFilmCardTemplate = (film) => {
  const {filmInfo, comments, id, userDetails} = film;

  const generateDescription = (description) => {
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      description = description.slice(MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH).concat('...');
    }
    return description;
  };

  const watchlistClassName = userDetails.isWatchlist
    ? 'film-card__controls-item--active'
    : '';

  const historyClassName = userDetails.isHistory
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClassName = userDetails.isFavorite
    ? 'film-card__controls-item--active'
    : '';

  return `<article class="film-card" id="${id}">
    <a class="film-card__link">
      <h3 class="film-card__title">${filmInfo.title}</h3>
      <p class="film-card__rating">${filmInfo.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getYearFromReleaseDate(filmInfo.release.date)}</span>
        <span class="film-card__duration">${humanizeRuntime(filmInfo.runtime)}</span>
        <span class="film-card__genre">${filmInfo.genre[0]}</span>
      </p>
      <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${generateDescription(filmInfo.description)}</p>
      <span class="film-card__comments">${comments.length} comments</span>
    </a>
    <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button" ${film.isDisabled ? 'disabled' : ''}>Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${historyClassName}" type="button" ${film.isDisabled ? 'disabled' : ''}>Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button" ${film.isDisabled ? 'disabled' : ''}>Mark as favorite</button>
    </div>
  </article>`;

};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film, isDisabled) {
    super();
    this._state = FilmCardView.parseFilmToState(film);
    this._state.isDisabled = isDisabled;
    this._restoreHandlers();
  }

  get template() {
    return createFilmCardTemplate(this._state);
  }

  setOpenClickHandler(callback) {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#clickFavorite);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#clickHistory);
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#clickWatchList);
  }

  _restoreHandlers = () => this.#setInnerHandlers();

  #setInnerHandlers = () => {
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#clickWatchList);
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#clickHistory);
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#clickFavorite);
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();

    if(evt.target.classList.contains('film-card__controls-item')) {
      return;
    }
    this._callback.click();
  };

  #clickFavorite = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-card__controls-item--active');
    this._callback.favoriteClick();
  };

  #clickHistory = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-card__controls-item--active');
    this._callback.historyClick();
  };

  #clickWatchList = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-card__controls-item--active');
    this._callback.watchListClick();
  };

  static parseFilmToState = (film) => ({...film});

  static parseStateToFilm = (state) => {
    const film = {...state};
    delete film.isDisabled;
    return film;
  };
}
