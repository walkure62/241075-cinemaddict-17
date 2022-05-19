import {render, replace, remove} from '../framework/render.js';
import FilmCardView from '../view/films-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import CommentsView from '../view/comments-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  DETAILS: 'DETAILS',
};

export default class FilmPresenter {
  siteBodyElement = document.querySelector('body');
  #filmListContainer = null;
  #changeData = null;
  #changeMode = null;

  #filmComponent = null;
  #filmDetaisComponent = null;
  #filmModel = null;

  #film = null;
  #mode = Mode.DEFAULT;
  #listComments = [];

  constructor(filmListContainer, filmModel, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#filmModel = filmModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;
    this.#listComments = [...this.#filmModel.getComments()];

    const prevFilmComponent = this.#filmComponent;
    const prevFilmDetaisComponent = this.#filmDetaisComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#filmDetaisComponent = new FilmDetailsView(film);

    this.#filmComponent.setClickHandler(this.#handlePopupOpen);
    this.#filmDetaisComponent.setClickHandler(this.#handlePopupClose);
    this.#filmComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoritesClick);
    this.#filmDetaisComponent.setWatchListClickHandler(this.#handleWatchListClick);
    this.#filmDetaisComponent.setHistoryClickHandler(this.#handleHistoryClick);
    this.#filmDetaisComponent.setFavoriteClickHandler(this.#handleFavoritesClick);


    render(this.#filmComponent, this.#filmListContainer);

    if (prevFilmComponent === null || prevFilmDetaisComponent === null) {
      render(this.#filmComponent, this.#filmListContainer);
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

  #renderComment = (comment) => {
    const commentComponent = new CommentsView(comment);
    render(commentComponent, this.siteBodyElement.querySelector('.film-details__comments-list'));
  };

  #addPopup = () => {
    this.siteBodyElement.classList.add('hide-overflow');
    this.siteBodyElement.appendChild(this.#filmDetaisComponent.element);
    for (let i = 0; i < this.#listComments.length; i++) {
      this.#renderComment(this.#listComments[i]);
    }

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
    evt.preventDefault();

    if (evt.key === 'Esc' || evt.key === 'Escape') {
      this.#removePopup();
    }
  };

  #handleFavoritesClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  };

  #handleHistoryClick = () => {
    this.#changeData({...this.#film, isHistory: !this.#film.isHistory});
  };

  #handleWatchListClick = () => {
    this.#changeData({...this.#film, isWatchlist: !this.#film.isWatchlist});
  };

  #handlePopupOpen = () => {
    this.#addPopup();
  };

  #handlePopupClose = () => {
    this.#removePopup();
  };
}
