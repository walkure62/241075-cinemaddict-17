import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/films-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';

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
  #filmDetaisComponent = null;
  #filmModel = null;

  #film = null;
  #mode = Mode.DEFAULT;
  #listComments = [];
  #currentComments = [];

  constructor(filmContainer, filmModel, changeData, changeMode) {
    this.#filmContainer = filmContainer;
    this.#filmModel = filmModel;
    this.#listComments = [...this.#filmModel.comments];
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevFilmDetaisComponent = this.#filmDetaisComponent;

    this.#currentComments = this.#filterCommentsFilm(this.#listComments);
    this.#filmComponent = new FilmCardView(film);
    this.#filmDetaisComponent = new FilmDetailsView(film, this.#currentComments);

    this.#filmComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoritesClick);
    this.#filmComponent.setOpenClickHandler(this.#handlePopupOpen);
    this.#filmDetaisComponent.setCloseClickHandler(this.#handlePopupClose);


    render(this.#filmComponent, this.#filmContainer);

    if (prevFilmComponent === null || prevFilmDetaisComponent === null) {
      render(this.#filmComponent, this.#filmContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#mode === Mode.DETAILS) {
      replace(this.#filmDetaisComponent, prevFilmDetaisComponent);
    }

    remove(prevFilmComponent);
    remove(prevFilmDetaisComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#removePopup();
    }
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmDetaisComponent);
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
    this.siteBodyElement.appendChild(this.#filmDetaisComponent.element);
    this.#filmDetaisComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmDetaisComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmDetaisComponent.setFavoriteClickHandler(this.#handleFavoritesClick);

    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#changeMode();
    this.#mode = Mode.DETAILS;
  };

  #removePopup = () => {
    this.siteBodyElement.classList.remove('hide-overflow');
    this.siteBodyElement.removeChild(this.#filmDetaisComponent.element);
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
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, isWatchlist: !this.#film.userDetails.isWatchlist}});
  };

  #handleHistoryClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, isHistory: !this.#film.userDetails.isHistory}});
  };

  #handleFavoritesClick = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, isFavorite: !this.#film.userDetails.isFavorite}});
  };

  #handlePopupOpen = () => {
    this.#addPopup();
  };

  #handlePopupClose = () => {
    this.#removePopup();
  };
}
