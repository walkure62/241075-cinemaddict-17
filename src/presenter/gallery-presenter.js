import ProfileRatingPresenter from '../presenter/profile-rating-presenter.js';
import FilterPresenter from '../presenter/filter-presenter.js';
import SortingView from '../view/sorting-view.js';
import FilmsListView from '../view/films-list-view.js';
import TopRatedFilmsListView from '../view/top-rated-films-list.js';
import MostCommentedFilmsListView from '../view/most-commented-films-list.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import NoFilmView from '../view/no-film-view.js';
import LoadingView from '../view/loading-view.js';
import FooterView from '../view/footer-view.js';
import FilmPresenter from './film-presenter.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import {sortingByRating, sortingByDate, sortingMostCommented} from '../utils/sorting.js';
import {generateRandomFilms} from '../utils/film.js';
import {SortType, FilterType, UpdateType, UserAction, TimeLimit} from '../const.js';
import {Filter} from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const FILM_COUNT_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class GalleryPresenter {
  siteMainElement = document.querySelector('.main');
  siteHeaderElement = document.querySelector('.header');
  siteBodyElement = document.querySelector('body');
  #filmModel = null;
  #commentModel = null;
  #filterModel = null;

  #listTopRatedFilms = [];
  #listMostCommentedFilms = [];
  #galleryComponent= new FilmsListView();
  #mostCommentedComponent = new MostCommentedFilmsListView();
  #topRatedComponent = new TopRatedFilmsListView();
  #profileRatingComponent = null;
  #loadingComponent = new LoadingView();
  #showMoreButtonComponent = null;
  #sortComponent = null;
  #noFilmComponent = null;
  #filmPresenter = new Map();
  #topRatedFilmsPresenter = new Map();
  #mostCommentedFilmsPresenter = new Map();
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

    this.#filmModel.addObserver(this.#handleModelEvent);
    this.#commentModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#currentFilterType = this.#filterModel.filter;
    const films = this.#filmModel.films;
    let currentFilms = films.slice();
    currentFilms = Filter[this.#currentFilterType](currentFilms);

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

  #renderFilm = (film, container, presenter) => {
    const filmPresenter = new FilmPresenter(container, this.#filmModel, this.#commentModel, this.#handleViewAction);
    if(presenter === this.#filmPresenter) {
      this.#filmPresenter.set(film.id, filmPresenter);
    } else if (presenter === this.#topRatedFilmsPresenter) {
      this.#topRatedFilmsPresenter.set(film.id, filmPresenter);
    } else if (presenter === this.#mostCommentedFilmsPresenter) {
      this.#mostCommentedFilmsPresenter.set(film.id, filmPresenter);
    }
    filmPresenter.init(film);
  };

  #renderFilms = (films, presenter) => {
    films.forEach((film) => this.#renderFilm(film, this.#galleryComponent.element.querySelector('.films-list__container'), presenter));
  };

  #renderMostCommentedFilms = () => {
    this.#listMostCommentedFilms = this.films.slice();
    const isEqual = this.#listMostCommentedFilms
      .map((a) => a.comments.length)
      .filter((el) => el === this.#listMostCommentedFilms[0].comments).length === this.#listMostCommentedFilms.length;

    this.#listMostCommentedFilms = isEqual ?
      generateRandomFilms(this.#listMostCommentedFilms, 2) :
      this.#listMostCommentedFilms
        .sort(sortingMostCommented)
        .slice(0,EXTRA_CARDS_COUNT);

    const isEmpty = this.#listMostCommentedFilms.filter(({comments}) => comments.length === 0).length !== this.#listMostCommentedFilms.length;

    if (isEmpty) {
      render(this.#mostCommentedComponent, this.#galleryComponent.element);
      this.#mostCommentedFilmsPresenter.forEach((film) => film.destroy());
      this.#listMostCommentedFilms.forEach((film) => this.#renderFilm(film, this.#mostCommentedComponent.element.querySelector('.films-list__container'), this.#mostCommentedFilmsPresenter));
    }
  };

  #renderTopRatedFilms = () => {
    this.#listTopRatedFilms = this.#filmModel.films.slice();

    const isEqual = this.#listTopRatedFilms
      .map((a) => a.filmInfo.totalRating)
      .filter((el) => el === this.#listTopRatedFilms[0].filmInfo.totalRating).length === this.#listTopRatedFilms.length;

    this.#listTopRatedFilms = isEqual ?
      generateRandomFilms(this.#listTopRatedFilms, 2) :
      this.#listTopRatedFilms
        .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
        .slice(0,EXTRA_CARDS_COUNT);

    const isEmpty = this.#listTopRatedFilms.filter(({filmInfo}) => filmInfo.totalRating === 0).length !== this.#listTopRatedFilms.length;

    if (isEmpty) {
      render(this.#topRatedComponent, this.#galleryComponent.element);
      this.#topRatedFilmsPresenter.forEach((film) => film.destroy());
      this.#listTopRatedFilms.forEach((film) => this.#renderFilm(film, this.#topRatedComponent.element.querySelector('.films-list__container'), this.#topRatedFilmsPresenter));
    }
  };

  #renderProfile = () => {
    this.#profileRatingComponent = new ProfileRatingPresenter(this.siteHeaderElement, this.#filmModel);
    this.#profileRatingComponent.init();
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

  #handleModelEvent = (updateType, film) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#filmPresenter.get(film.id)) {
          this.#filmPresenter.get(film.id).init(film);
        }
        if (this.#topRatedFilmsPresenter.get(film.id)) {
          this.#topRatedFilmsPresenter.get(film.id).init(film);
        }
        if (this.#mostCommentedFilmsPresenter.get(film.id)) {
          this.#mostCommentedFilmsPresenter.get(film.id).init(film);
        }
        this.#filmModel.updateLocalFilm(updateType, film);
        this.#renderMostCommentedFilms();
        break;
      case UpdateType.MINOR:
        this.#clearFilmList();
        this.#renderFilmsList();
        break;
      case UpdateType.MAJOR:
        this.#clearGallery({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderGallery();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearGallery();
        this.#renderGallery();
        this.#renderTopRatedFilms();
        this.#renderMostCommentedFilms();
        this.#renderFooterFilmStatistic();
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

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmView(this.#currentFilterType);
    render(this.#noFilmComponent, this.siteMainElement.querySelector('.films-list__container'));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.siteMainElement, RenderPosition.BEFOREEND);
  };

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    render(this.#showMoreButtonComponent, this.siteMainElement.querySelector('.films-list'));
  };

  #renderFooterFilmStatistic = () => render(new FooterView(this.films.length), document.querySelector('.footer__statistics'));

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films, this.#filmPresenter);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    remove(this.#galleryComponent);
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
    if(this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }
  };

  #clearGallery = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.films.length;
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }
    remove(this.#showMoreButtonComponent);
    this.#profileRatingComponent.destroy();
    remove(this.#sortComponent);
    this.#filterPresenter.destroy();

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmsCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderFilmsList = () => {
    const filmsCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmsCount, FILM_COUNT_PER_STEP));
    if(filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }
    render(this.#galleryComponent, this.siteMainElement);
    this.#renderFilms(films, this.#filmPresenter);
    if (filmsCount > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  };

  #renderGallery = () => {
    const films = this.films;
    const filmsCount = films.length;
    this.#renderProfile();
    this.#renderSort(this.#currentSortType);
    this.#renderFilters();

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if(filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }
    this.#renderFilmsList();
  };
}


