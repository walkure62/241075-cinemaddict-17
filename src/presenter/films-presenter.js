import ProfileView from '../view/profile-rating-view.js';
import FitersView from '../view/navigation-view.js';
import SortingView from '../view/sorting-view.js';
import FilmListView from '../view/films-list-view.js';
import FilmCardView from '../view/films-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmDetailsView from '../view/film-details-view.js';

import {render} from '../render.js';

export default class FilmsPresenter {
  siteBodyElement = document.querySelector('body');
  siteMainElement = document.querySelector('.main');
  siteHeaderElement = document.querySelector('.header');

  init () {
    render(new ProfileView(), this.siteHeaderElement);
    render(new FitersView(), this.siteMainElement);
    render(new SortingView(), this.siteMainElement);
    render(new FilmListView(), this.siteMainElement);

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.siteMainElement.querySelector('.films-list__container'));
    }

    render(new ShowMoreButtonView(), this.siteMainElement.querySelector('.films-list'));
    render(new FilmDetailsView(), this.siteBodyElement);
  }
}
