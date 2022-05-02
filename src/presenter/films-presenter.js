import ProfileRatingView from '../view/profile-rating-view.js';
import NavigationView from '../view/navigation-view.js';
import SortingView from '../view/sorting-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmCardView from '../view/films-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

import {render} from '../render.js';

export default class FilmsPresenter {
  siteBodyElement = document.querySelector('body');
  siteMainElement = document.querySelector('.main');
  siteHeaderElement = document.querySelector('.header');

  init (filmModel) {
    this.filmModel = filmModel;
    this.listFilms = [...this.filmModel.getFilms()];

    render(new ProfileRatingView(), this.siteHeaderElement);
    render(new NavigationView(), this.siteMainElement);
    render(new SortingView(), this.siteMainElement);
    render(new FilmsListView(), this.siteMainElement);

    for (let i = 0; i < this.listFilms.length; i++) {
      render(new FilmCardView(this.listFilms[i]), this.siteMainElement.querySelector('.films-list__container'));
    }

    render(new ShowMoreButtonView(), this.siteMainElement.querySelector('.films-list'));
  }
}
