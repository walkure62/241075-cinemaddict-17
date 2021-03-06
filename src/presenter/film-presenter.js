import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsPresenter from '../presenter/film-details-presenter.js';
import {UserAction, UpdateType} from '../const.js';

export default class FilmPresenter {
  siteFooterElement = document.querySelector('.footer');
  #filmContainer = null;
  #changeData = null;

  #filmComponent = null;
  #filmDetailsPresenter = null;
  #filmModel = null;
  #commentModel = null;

  #film = null;
  #listComments = [];
  #currentComments = [];
  #isDisabled = null;

  constructor(filmContainer, filmModel, commentModel, changeData) {
    this.#filmContainer = filmContainer;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#listComments = [...this.#commentModel.comments];
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#isDisabled = false;
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#currentComments = this.#filterCommentsFilm(this.#listComments);
    this.#filmComponent = new FilmCardView(film, this.#isDisabled);
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

  updatePopUp = (film) => {
    this.#filmDetailsPresenter.init(film);
  };

  setDisabled = () => this.#filmComponent.updateElement({isDisabled: true,});

  setAborting = () => {
    const resetButtons = () => {
      this.#filmComponent.updateElement({isDisabled: false,});
    };
    if (document.querySelector('.film-details')) {
      return this.#filmDetailsPresenter.setAborting();
    }
    this.#filmComponent.shake(resetButtons);
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
}
