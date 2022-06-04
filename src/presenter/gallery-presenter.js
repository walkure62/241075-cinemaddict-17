import ProfileRatingView from '../view/profile-rating-view.js';
import NavigationView from '../view/navigation-view.js';
import SortingView from '../view/sorting-view.js';
import FilmsListView from '../view/films-list-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmView from '../view/no-film-view.js';
import FilmPresenter from './film-presenter.js';
//import FilterPresenter from './filter-presenter';
import {generateFilter} from '../mock/filter.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import {sortingByRating, sortingByDate, sortingMostCommented} from '../utils/sorting.js';
import {SortType, FilterType, UpdateType, UserAction} from '../const.js';
import {filter} from '../utils/filter.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class GalleryPresenter {
  siteMainElement = document.querySelector('.main');
  siteHeaderElement = document.querySelector('.header');
  #filmModel = null;
  #commentModel = null;
  #filterModel = null;
  #sortingModel = null;

  #filtersList = [];
  #listTopRatedFilms = [];
  #listMostCommentedFilms = [];
  #galleryComponent= new FilmsListView();
  #profileRatingComponent = new ProfileRatingView();
  #showMoreButtonComponent = null;
  #filterComponent = null;
  #sortComponent = null;
  #noFilmComponent = null;
  #filmPresenter = new Map();
  #topRatedPresenter = new Map();
  #mostCommentedPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(filmModel, commentModel, filterModel, sortingModel) {
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#filterModel = filterModel;
    this.#sortingModel = sortingModel;
    this.#listTopRatedFilms = this.#filmModel.films.sort(sortingByRating).slice(0, EXTRA_CARDS_COUNT);
    this.#listMostCommentedFilms = this.#filmModel.films.sort(sortingMostCommented).slice(0, EXTRA_CARDS_COUNT);
    this.#filtersList = generateFilter(this.#filmModel.films);

    this.#filmModel.addObserver(this.#handleModelEvent);
    this.#commentModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    switch (this.#currentFilterType) {
      case FilterType.WATCHLIST:
        return filter[FilterType.WATCHLIST](this.#filmModel.films);
      case FilterType.HISTORY:
        return filter[FilterType.HISTORY](this.#filmModel.films);
      case FilterType.FAVORITES:
        return filter[FilterType.FAVORITES](this.#filmModel.films);
    }

    switch (this.#currentSortType) {
      case SortType.BY_DATE:
        return [...this.#filmModel.films].sort(sortingByDate);
      case SortType.BY_RATING:
        return [...this.#filmModel.films].sort(sortingByRating);
    }

    return this.#filmModel.films;
  }

  get comments() {
    return this.#commentModel.comments;
  }

  init = () => {
    this.#renderGallery();
  };

  #renderFilm = (container, film) => {
    const filmPresenter = new FilmPresenter(container, this.#filmModel, this.#commentModel, this.#handleViewAction, this.#handleModeChange);
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

  #renderNavigation = (listFilters) => {
    this.#filterComponent = new NavigationView(listFilters);

    render(this.#filterComponent, this.siteMainElement, RenderPosition.AFTERBEGIN);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }
    this.#currentFilterType = filterType;

    this.#clearGallery({resetRenderedFilmCount: true});
    this.#renderGallery();
  };

  #renderSort = () => {
    if(this.films.length === 0) {
      return;
    }
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.siteMainElement);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearGallery({resetRenderedFilmCount: true});
    this.#renderGallery();
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update, updatedComment) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#filmModel.updateFilm(updateType, update);
        this.#commentModel.addComment(updateType, update, updatedComment);
        break;
      case UserAction.DELETE_COMMENT:
        this.#filmModel.updateFilm(updateType, update);
        this.#commentModel.deleteComment(updateType,update, updatedComment);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearGallery();
        this.#renderGallery();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearGallery({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderGallery();
        break;
    }
  };

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmView(this.#currentFilterType);
    render(this.#noFilmComponent, this.siteMainElement.querySelector('.films-list__container'));
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

    remove(this.#filterComponent);
    remove(this.#sortComponent);
    remove(this.#noFilmComponent);
    remove(this.#showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
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

    if(filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderProfile();
    this.#renderNavigation(this.#filtersList);
    this.#renderSort();
    render(this.#galleryComponent, this.siteMainElement);
    this.#renderMostCommentedFilms(this.#listMostCommentedFilms);
    this.#renderMostRatingFilms(this.#listTopRatedFilms);

    // Теперь, когда #renderBoard рендерит доску не только на старте,
    // но и по ходу работы приложения, нужно заменить
    // константу TASK_COUNT_PER_STEP на свойство #renderedTaskCount,
    // чтобы в случае перерисовки сохранить N-показанных карточек
    this.#renderFilms(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));

    if (filmsCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }
  };
}

