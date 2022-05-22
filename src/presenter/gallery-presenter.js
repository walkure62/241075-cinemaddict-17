import ProfileRatingView from '../view/profile-rating-view.js';
import NavigationView from '../view/navigation-view.js';
import SortingView from '../view/sorting-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListTopRatedView from '../view/films-list-top-rated-view.js';
import FilmsListMostCommentedView from '../view/films-list-most-commented-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmView from '../view/no-film-view.js';
import FilmPresenter from './film-presenter.js';
import {generateFilter} from '../mock/filter.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import {updateItem} from '../utils/common.js';
import {sortingByRating, sortingByDate, sortingMostCommented} from '../utils/sorting.js';
import {SortType, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class GalleryPresenter {
  siteMainElement = document.querySelector('.main');
  siteHeaderElement = document.querySelector('.header');
  #filmModel = null;

  #listFilms = [];
  #listTopRatedFilms = [];
  #listMostCommentedFilms = [];
  #listFilters = [];
  #gallery = new FilmsListView();
  #galleryOfTopRatedFilms = new FilmsListTopRatedView();
  #galleryOfMostCommentedFilms = new FilmsListMostCommentedView();
  #showMoreButton = new ShowMoreButtonView();
  #navigation = null;
  #sorting = new SortingView();
  #noFilmComponent = new NoFilmView();
  #profileRating = new ProfileRatingView();
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #currentFilterType = FilterType.ALL;
  #sourcedGalleryFilms = [];

  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(filmModel) {
    this.#filmModel = filmModel;
  }

  init = () => {
    this.#listFilms = [...this.#filmModel.films];
    this.#listFilters = generateFilter(this.#listFilms);
    this.#sourcedGalleryFilms = [...this.#filmModel.films];
    this.#listTopRatedFilms = sortingByRating(this.#listFilms.slice()).slice(0,EXTRA_CARDS_COUNT);
    this.#listMostCommentedFilms = sortingMostCommented(this.#listFilms.slice()).slice(0,EXTRA_CARDS_COUNT);

    this.#renderGallery();
  };

  #handleShowMoreButtonClick = () => {
    this.#listFilms
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#listFilms.length) {
      remove(this.#showMoreButton);
    }
  };

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#gallery.element.querySelector('.films-list__container'), this.#filmModel, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  };

  #renderFilms = (from, to) => {
    this.#listFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film));
  };

  #renderFilmsList = () => {
    render(this.#gallery, this.siteMainElement);
    this.#renderFilms(0, Math.min(this.#listFilms.length, FILM_COUNT_PER_STEP));

    if (this.#listFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButton);
  };

  #renderProfile = () => {
    render(this.#profileRating, this.siteHeaderElement);
  };

  #renderNavigation = (listFilters) => {
    this.#navigation = new NavigationView(listFilters);

    render(this.#navigation, this.siteMainElement, RenderPosition.AFTERBEGIN);
    this.#navigation.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#currentFilterType === filterType) {
      return;
    }
    this.#listFilms = [...this.#sourcedGalleryFilms];
    this.#filterFilms(filterType);

    this.#clearFilmsList();
    this.#renderFilmsList();
  };

  #filterFilms = (filterType) => {
    switch (filterType) {
      case FilterType.WATCHLIST:
        this.#listFilms = filter[FilterType.WATCHLIST](this.#listFilms);
        break;
      case FilterType.HISTORY:
        this.#listFilms = filter[FilterType.HISTORY](this.#listFilms);
        break;
      case FilterType.FAVORITES:
        this.#listFilms = filter[FilterType.FAVORITES](this.#listFilms);
        break;
      default:
        this.#listFilms = [...this.#sourcedGalleryFilms];
    }

    this.#currentFilterType = filterType;
  };

  #renderSorting = () => {
    if(this.#listFilms.length === 0) {
      return;
    }
    render(this.#sorting, this.siteMainElement);
    this.#sorting.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);

    this.#clearFilmsList();
    this.#renderFilmsList();
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.BY_DATE:
        sortingByDate(this.#listFilms);
        break;
      case SortType.BY_RATING:
        sortingByRating(this.#listFilms);
        break;
      default:
        this.#listFilms = [...this.#sourcedGalleryFilms];
    }

    this.#currentSortType = sortType;
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#listFilms = updateItem(this.#listFilms, updatedFilm);
    this.#sourcedGalleryFilms = updateItem(this.#sourcedGalleryFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    this.#listFilters = generateFilter(this.#listFilms);
    remove(this.#navigation);
    this.#renderNavigation(this.#listFilters);
  };

  #renderNoFilms = () => {
    render(this.#noFilmComponent, this.siteMainElement.querySelector('.films-list__container'));
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButton, this.siteMainElement.querySelector('.films-list'));

    this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderGallery = () => {
    this.#renderProfile();
    this.#renderNavigation(this.#listFilters);
    this.#renderSorting();
    this.#renderFilmsList();

    if(this.#listFilms.length === 0) {
      this.#renderNoFilms();
    }
  };
}

