import ProfileRatingView from '../view/profile-rating-view.js';
import NavigationView from '../view/navigation-view.js';
import SortingView from '../view/sorting-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCardView from '../view/films-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmDetailsView from '../view/film-details-view.js';
import CommentsView from '../view/comments-view.js';

import {render} from '../render.js';

export default class FilmsPresenter {
  siteBodyElement = document.querySelector('body');
  siteMainElement = document.querySelector('.main');
  siteHeaderElement = document.querySelector('.header');
  #filmModel = null;
  #listFilms = [];
  #filmDetails = null;
  #listComments = [];


  init (filmModel) {
    this.#filmModel = filmModel;
    this.#listFilms = [...this.#filmModel.getFilms()];
    this.#filmDetails = this.#filmModel.getFilmDetails();
    this.#listComments = [...this.#filmModel.getComments()];

    render(new ProfileRatingView(), this.siteHeaderElement);
    render(new NavigationView(), this.siteMainElement);
    render(new SortingView(), this.siteMainElement);
    render(new FilmsListView(), this.siteMainElement);

    for (let i = 0; i < this.#listFilms.length; i++) {
      this.#renderFilm(this.#listFilms[i]);
    }

    render(new ShowMoreButtonView(), this.siteMainElement.querySelector('.films-list'));
  }

  #renderFilm = (film) => {
    const filmComponent = new FilmCardView(film);
    const filmDetaisComponent = new FilmDetailsView(film);

    render(filmComponent, this.siteMainElement.querySelector('.films-list__container'));

    const addPopup = () => {
      this.siteBodyElement.classList.add('hide-overflow');
      this.siteBodyElement.appendChild(filmDetaisComponent.element);
      for (let i = 0; i < this.#listComments.length; i++) {
        this.#renderComment(this.#listComments[i]);
      }
      // eslint-disable-next-line no-use-before-define
      document.addEventListener('keydown', onEscKeyDown);
    };

    const removePopup = () => {
      this.siteBodyElement.classList.remove('hide-overflow');
      this.siteBodyElement.removeChild(filmDetaisComponent.element);
      // eslint-disable-next-line no-use-before-define
      document.removeEventListener('keydown', onEscKeyDown);
    };

    filmComponent.element.addEventListener('click', () => {
      addPopup();
    });

    filmDetaisComponent.element.querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      removePopup();
    });

    const onEscKeyDown = (evt) =>{
      if (evt.key === 'Esc' || evt.key === 'Escape') {
        removePopup();
      }
      evt.preventDefault();
    };
  };

  #renderComment = (comment) => {
    const commentComponent = new CommentsView(comment);
    render(commentComponent, this.siteBodyElement.querySelector('.film-details__comments-list'));
  };
}

