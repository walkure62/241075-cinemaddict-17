import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeReleaseDate, humanizeRuntime } from '../utils/film.js';

const createDetailedInformationTemplate = (film) => {
  const {filmInfo, userDetails} = film;

  const showGenres = (genres) => {
    let template = '';
    genres.forEach((el) => {
      template += `<span class="film-details__genre">${el}</span>`;
    });
    return template;
  };

  return `
<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

        <p class="film-details__age">${filmInfo.ageRating}</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${filmInfo.title}</h3>
            <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${filmInfo.totalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${filmInfo.director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${filmInfo.writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${filmInfo.actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${humanizeReleaseDate(filmInfo.release.date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${humanizeRuntime(filmInfo.runtime)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${filmInfo.release.country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
              ${showGenres(filmInfo.genre)}
          </tr>
        </table>

        <p class="film-details__film-description">${filmInfo.description}</p>
      </div>
    </div>

    <section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.isWatchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.isHistory ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.isFavorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
    </section>
  </div>`;
};

export default class FilmDetailsView extends AbstractStatefulView {
  #film = null;
  #changeFilm = null;

  constructor(film, changeFilm) {
    super();
    this._state = FilmDetailsView.parseFilmToState(film);
    this.#changeFilm = changeFilm;
    this.#film = film;
    this.#setInnerHandlers();
  }

  get template() {
    return createDetailedInformationTemplate(this._state);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
  }

  #clickCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
    //this.element.remove();
  };

  #clickFavorite = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.favoriteClick();
  };

  #clickHistory = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.historyClick();
  };

  #clickWatchList = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.watchListClick();
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickCloseHandler);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#clickFavorite);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#clickHistory);
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#clickWatchList);

  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  static parseCommentToState = (comment) => this._state.comments.push(comment);

  static parseFilmToState = (film) => ({...film, emojiSelected: null, typedComment: null});
}
