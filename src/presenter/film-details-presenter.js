import { render, replace, remove, RenderPosition } from '../framework/render.js';
import FilmDetailsView from '../view/film-details-view.js';
import CommentPresenter from './comment-presenter.js';
import { UserAction, UpdateType } from '../const.js';

export default class FilmDetailsPresenter {
  #film = null;
  #changeData = null;
  #popupContainer = null;
  #comments = null;
  #filmsModel = null;
  #commentsPresenter = null;
  #popupComponent = null;
  #commentsModel = null;

  constructor(popupContainer, film, filmsModel, commentsModel, comments, changeData) {
    this.#popupContainer = popupContainer;
    this.#comments = comments;
    this.#film = film;
    this.#changeData = changeData;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = (film) => {
    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new FilmDetailsView(film, this.#changeData);
    this.#commentsPresenter = new CommentPresenter(this.#popupComponent.element, film, this.#commentsModel, this.#comments, this.#changeData);
    this.#commentsPresenter.init(film);
    this.#popupComponent.setCloseClickHandler(this.#onCloseButtonClick);
    this.#popupComponent.setFavoriteClickHandler(this.#onFavoriteClick);
    this.#popupComponent.setHistoryClickHandler(this.#onHistoryClick);
    this.#popupComponent.setWatchListClickHandler(this.#onWatchlistClick);
    document.body.addEventListener('keydown', this.#onEscKeydown);
    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#popupContainer, RenderPosition.AFTEREND);
      return;
    }

    replace(this.#popupComponent, prevPopupComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#popupComponent);
    document.body.removeEventListener('keydown', this.#onEscKeydown);
  };

  #onWatchlistClick = () => this.#handlePopupButtonsModelEvent(
    'Watchlist', {...this.#film, userDetails: {...this.#film.userDetails, isWatchlist: !this.#film.userDetails.isWatchlist}});

  #onHistoryClick = () => this.#handlePopupButtonsModelEvent(
    'History', {...this.#film, userDetails: {...this.#film.userDetails, isHistory: !this.#film.userDetails.isHistory}});

  #onFavoriteClick = () => this.#handlePopupButtonsModelEvent(
    'Favorites', {...this.#film, userDetails: {...this.#film.userDetails, isFavorite: !this.#film.userDetails.isFavorite}});

  #handlePopupButtonsModelEvent = (filter, updatedFilm) => {
    const currentFilter = document.querySelector('.main-navigation__item--active').dataset.filterType;
    this.#changeData(
      UserAction.UPDATE_FILM,
      (currentFilter === filter) ? UpdateType.MINOR : UpdateType.PATCH,
      updatedFilm,
    );
  };

  #onEscKeydown = (evt) =>{

    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#closePopUp();
    }
  };

  #onCloseButtonClick = () => {
    this.#closePopUp();
  };

  #closePopUp = () => {
    document.body.classList.toggle('hide-overflow', false);
    document.body.removeEventListener('keydown', this.#onEscKeydown);
    this.destroy();
  };
}
