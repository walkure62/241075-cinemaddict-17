import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/films-card-view.js';
import FilmDetailsPresenter from '../presenter/film-details-presenter.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

export default class FilmPresenter {
  siteFooterElement = document.querySelector('.footer');
  #filmContainer = null;
  #changeData = null;

  #filmComponent = null;
  #filmDetailsPresenter = null;
  #filmModel = null;
  #commentModel = null;
  #commentsPresenter = null;

  #film = null;
  #mode = Mode.DEFAULT;
  #listComments = [];
  #currentComments = [];

  constructor(filmContainer, filmModel, commentModel, changeData) {
    this.#filmContainer = filmContainer;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#listComments = [...this.#commentModel.comments];
    this.#changeData = changeData;

    //this.#filmModel.addObserver(this.#handlePopupModelEvent);
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    //const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#currentComments = this.#filterCommentsFilm(this.#listComments);
    this.#filmComponent = new FilmCardView(film);
    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.siteFooterElement, this.#film, this.#currentComments, this.#changeData);

    this.#filmComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoritesClick);
    this.#filmComponent.setOpenClickHandler(() => this.#hadleCardClick(film));


    if (!prevFilmComponent) {
      render(this.#filmComponent, this.#filmContainer);
      return;
    }
    if (this.#filmContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }
    remove(prevFilmComponent);
  };

  destroy = () => {
    remove(this.#filmComponent);
  };

  #updatePopUp = (film) => {
    this.#filmDetailsPresenter.init(film);
  };


  #filterCommentsFilm = (comments) => {
    const filmComments = [];
    this.#film.comments.forEach((id) => {
      filmComments.push(comments.find((comment) => comment.id === id));
    });

    return filmComments;
  };

  #addPopup = (film) => {
    this.#filmDetailsPresenter = new FilmDetailsPresenter(this.siteFooterElement, film, this.#filmModel, this.#commentModel, this.#currentComments, this.#changeData);
    document.body.classList.toggle('hide-overflow');
    this.#filmDetailsPresenter.init(film);
  };

  /*#removePopup = () => {
    this.siteBodyElement.classList.remove('hide-overflow');
    remove(this.#filmDetailsComponent);

    this.#mode = Mode.DEFAULT;
  };*/

  #hadleCardClick = (film) => {
    if(document.querySelector('.film-details')) {
      document.querySelector('.film-details').remove();
      document.body.classList.toggle('hide-overflow');
    }
    this.#addPopup(film);
  };

  #handleWatchListClick = () => this.#handleCardControls(
    'Watchlist', {...this.#film, userDetails: {...this.#film.userDetails, isWatchlist: !this.#film.userDetails.isWatchlist}});

  #handleHistoryClick = () => this.#handleCardControls(
    'History', {...this.#film, userDetails: {...this.#film.userDetails, isHistory: !this.#film.userDetails.isHistory}});

  #handleFavoritesClick = () => this.#handleCardControls(
    'Favorites', {...this.#film, userDetails: {...this.#film.userDetails, isFavorite: !this.#film.userDetails.isFavorite}});

  #handleCardControls = (filter, updatedFilm) => {
    const currentFilter = document.querySelector('.main-navigation__item--active').dataset.filterType;
    this.#changeData(
      UserAction.UPDATE_FILM,
      (currentFilter === filter) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm,
    );
  };

  /*#handlePopupClose = () => {
    this.#removePopup();
  };*/
}
