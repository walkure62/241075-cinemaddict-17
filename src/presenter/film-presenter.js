import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/films-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import CommentPresenter from './comment-presenter.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

export default class FilmPresenter {
  siteBodyElement = document.querySelector('body');
  #filmContainer = null;
  #changeData = null;
  #changeMode = null;

  #filmComponent = null;
  #filmDetailsComponent = null;
  #filmModel = null;
  #commentModel = null;
  #commentsPresenter = null;

  #film = null;
  #mode = Mode.DEFAULT;
  #listComments = [];
  #currentComments = [];

  constructor(filmContainer, filmModel, commentModel, changeData, changeMode) {
    this.#filmContainer = filmContainer;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#listComments = [...this.#commentModel.comments];
    this.CommentPresenter = new CommentPresenter(document.querySelector('.film-details'), this.#commentModel, this.#changeData);
    this.#changeData = changeData;
    this.#changeMode = changeMode;

    this.#filmModel.addObserver(this.#handlePopupModelEvent);
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevFilmDetailsComponent = this.#filmDetailsComponent;

    this.#currentComments = this.#filterCommentsFilm(this.#listComments);
    this.#filmComponent = new FilmCardView(film);
    this.#filmDetailsComponent = new FilmDetailsView(film, this.#currentComments);

    this.#filmComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoritesClick);
    this.#filmComponent.setOpenClickHandler(this.#handlePopupOpen);
    this.#filmDetailsComponent.setCloseClickHandler(this.#handlePopupClose);


    render(this.#filmComponent, this.#filmContainer);

    if (prevFilmComponent === null || prevFilmDetailsComponent === null) {
      render(this.#filmComponent, this.#filmContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.DETAILS) {
      replace(this.#filmDetailsComponent, prevFilmDetailsComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmDetailsComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#removePopup();
    }
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmDetailsComponent);
  };

  #handlePopupModelEvent = (updateType, updatedFilm) => {
    if (this.#filmDetailsComponent.element) {
      this.#updatePopUp(updatedFilm);
    }
  };

  #updatePopUp = (film) => {
    const scroll = this.#filmDetailsComponent.element.scrollTop;
    //const scroll = document.body.querySelector('.film-details').scrollTop;
    remove(this.#filmDetailsComponent);
    this.#filmDetailsComponent = new FilmDetailsView(film, this.#currentComments);
    render(this.#filmDetailsComponent, this.siteBodyElement);
    this.#commentsPresenter.init();
    this.#filmDetailsComponent.element.scrollTop = scroll;
    //document.body.querySelector('.film-details').scrollTop = scroll;
  };


  #filterCommentsFilm = (comments) => {
    const filmComments = [];
    this.#film.comments.forEach((id) => {
      filmComments.push(comments.find((comment) => comment.id === id));
    });

    return filmComments;
  };

  #addPopup = () => {
    if (this.siteBodyElement.classList.contains('hide-overflow')) {
      return;
    }
    this.siteBodyElement.classList.add('hide-overflow');
    this.siteBodyElement.appendChild(this.#filmDetailsComponent.element);
    this.#commentsPresenter.init();
    this.#filmDetailsComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmDetailsComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmDetailsComponent.setFavoriteClickHandler(this.#handleFavoritesClick);

    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#changeMode();
    this.#mode = Mode.DETAILS;
  };

  #removePopup = () => {
    this.siteBodyElement.classList.remove('hide-overflow');
    this.siteBodyElement.removeChild(this.#filmDetailsComponent.element);
    document.removeEventListener('keydown', this.#onEscKeyDown);

    this.#mode = Mode.DEFAULT;
  };


  #onEscKeyDown = (evt) =>{

    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#removePopup();
    }
  };

  #handleWatchListClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, isWatchlist: !this.#film.userDetails.isWatchlist}},
    );
  };

  #handleHistoryClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, isHistory: !this.#film.userDetails.isHistory}},
    );
  };

  #handleFavoritesClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#film, userDetails: {...this.#film.userDetails, isFavorite: !this.#film.userDetails.isFavorite}},
    );
  };

  #handlePopupOpen = (film) => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      film,
    );
    this.#addPopup();
  };

  #handlePopupClose = () => {
    this.#removePopup();
  };
}
