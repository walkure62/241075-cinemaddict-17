import ProfileRatingView from '../view/profile-rating-view.js';
import FilterPresenter from '../presenter/filter-presenter.js';
import SortingView from '../view/sorting-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmView from '../view/no-film-view.js';
import LoadingView from '../view/loading-view.js';
import FilmPresenter from './film-presenter.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import {sortingByRating, sortingByDate, sortingMostCommented} from '../utils/sorting.js';
import {SortType, FilterType, UpdateType, UserAction, TimeLimit} from '../const.js';
import {filter} from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class GalleryPresenter {
  siteMainElement = document.querySelector('.main');
  siteHeaderElement = document.querySelector('.header');
  #filmModel = null;
  #commentModel = null;
  #filterModel = null;

  #listTopRatedFilms = [];
  #listMostCommentedFilms = [];
  #galleryComponent= new FilmsListView();
  #profileRatingComponent = new ProfileRatingView();
  #loadingComponent = new LoadingView();
  #showMoreButtonComponent = null;
  #sortComponent = null;
  #noFilmComponent = null;
  #filmPresenter = new Map();
  #filterPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(filmModel, commentModel, filterModel) {
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#filterModel = filterModel;
    this.#listTopRatedFilms = this.#filmModel.films.slice().sort(sortingByRating).slice(0, EXTRA_CARDS_COUNT);
    this.#listMostCommentedFilms = this.#filmModel.films.slice().sort(sortingMostCommented).slice(0, EXTRA_CARDS_COUNT);

    this.#filmModel.addObserver(this.#handleModelEvent);
    this.#commentModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#currentFilterType = this.#filterModel.filter;
    const films = this.#filmModel.films;
    let currentFilms = films.slice();
    currentFilms = filter[this.#currentFilterType](currentFilms);

    switch(this.#currentSortType) {
      case SortType.BY_DATE:
        return currentFilms.sort(sortingByDate);
      case SortType.BY_RATING:
        return currentFilms.sort(sortingByRating);
    }
    return currentFilms;
  }

  get comments() {
    return this.#commentModel.comments;
  }

  init = () => {
    this.#renderGallery();
  };

  #renderFilm = (container, film) => {
    const filmPresenter = new FilmPresenter(container, this.#filmModel, this.#commentModel, this.#handleViewAction);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(this.#galleryComponent.element.querySelector('.films-list__container'), film));
  };

  #renderMostCommentedFilms = (films) => {
    films.forEach((film) => this.#renderFilm(this.#galleryComponent.element.querySelector('.films-list__container--most-commented'), film));
  };

  #renderMostRatingFilms = (films) => {
    films.forEach((film) => this.#renderFilm(this.#galleryComponent.element.querySelector('.films-list__container--top-rated'), film));
  };

  #renderProfile = () => {
    render(this.#profileRatingComponent, this.siteHeaderElement);
  };

  #renderFilters= () => {
    this.#filterPresenter = new FilterPresenter(this.siteMainElement, this.#filterModel, this.#filmModel);
    this.#filterPresenter.init();
  };

  #renderSort = (sortType) => {
    if(this.films.length === 0) {
      return;
    }
    this.#sortComponent = new SortingView(sortType);

    render(this.#sortComponent, this.siteMainElement, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#clearGallery();
    this.#renderGallery();
  };

  #handleViewAction = async (actionType, updateType, updatedFilm, updatedComment) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#uiBlocker.block();
        try {
          await this.#filmModel.updateFilm(updateType, updatedFilm);
        } catch (err) {
          this.#uiBlocker.unblock();
          this.#filmPresenter.get(updatedFilm.id).setAborting();
        }
        this.#uiBlocker.unblock();
        break;
      case UserAction.ADD_COMMENT:
        this.#uiBlocker.block();
        try {
          await this.#commentModel.addComment(updateType, updatedFilm, updatedComment[0]);
        } catch (err) {
          this.#uiBlocker.unblock();
          this.#handleNewCommentError(updatedComment[1]);
        }
        this.#uiBlocker.unblock();
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#commentModel.deleteComment(updateType, updatedFilm, updatedComment[0]);
        } catch (err) {
          this.#handleCommentError(updatedComment[1]);
        }
        break;
    }
  };

  #handleCommentError = (commentContainer) => {
    const deleteCommentButton = commentContainer.querySelector('button');
    commentContainer.classList.add('shake');
    deleteCommentButton.textContent = 'Delete';
    deleteCommentButton.disabled = false;
    setTimeout(() => commentContainer.classList.remove('shake'), 500);
  };

  #handleNewCommentError = (commentContainer) => {
    commentContainer.classList.add('shake');
    commentContainer.querySelector('textarea').disabled = false;
    setTimeout(() => commentContainer.classList.remove('shake'), 500);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список фильмов
        this.#clearGallery();
        this.#renderGallery();
        break;
      case UpdateType.MAJOR:
        // - обновить всю галлерею (например, при переключении фильтра)
        this.#clearGallery({resetRenderedFilmCount: true, resetSortType: true, resetFilterType: true});
        this.#renderGallery();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderGallery();
        break;
    }
  };

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmView(this.#currentFilterType);
    render(this.#noFilmComponent, this.siteMainElement.querySelector('.films-list__container'));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#galleryComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    render(this.#showMoreButtonComponent, this.siteMainElement.querySelector('.films-list'));
  };

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #clearGallery = ({resetRenderedFilmCount = false, resetSortType = false, resetFilterType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    this.#filterPresenter.destroy();
    remove(this.#sortComponent);
    remove(this.#noFilmComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#galleryComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (resetFilterType) {
      this.#currentFilterType = FilterType.ALL;
    }
  };

  #renderGallery = () => {
    const films = this.films;
    const filmsCount = films.length;
    this.#listTopRatedFilms = films.slice().sort(sortingByRating).slice(0, EXTRA_CARDS_COUNT);
    this.#listMostCommentedFilms = films.slice().sort(sortingMostCommented).slice(0, EXTRA_CARDS_COUNT);

    render(this.#galleryComponent, this.siteMainElement);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if(filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderProfile();
    this.#renderSort(this.#currentSortType);
    this.#renderFilters();
    this.#renderMostCommentedFilms(this.#listMostCommentedFilms);
    this.#renderMostRatingFilms(this.#listTopRatedFilms);

    // Теперь, когда #renderGallery рендерит доску не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу FILM_COUNT_PER_STEP на свойство #renderedFilmCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));

    if (filmsCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  };
}

