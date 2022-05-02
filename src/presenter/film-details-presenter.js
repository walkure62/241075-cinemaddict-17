import FilmDetailsView from '../view/film-details-view.js';
import CommentsView from '../view/comments-view.js';

import {render} from '../render.js';

export default class FilmDetailsPresenter {
  siteBodyElement = document.querySelector('body');

  init (commentsModel) {
    this.commentsModel = commentsModel;
    this.filmDetails = this.commentsModel.getFilmDetails();
    this.listComments = [...this.commentsModel.getComments()];

    render(new FilmDetailsView(this.filmDetails), this.siteBodyElement);

    for (let i = 0; i < this.listComments; i++) {
      render(new CommentsView(this.listComments[i]), this.siteBodyElement.querySelector('.film-details__comments-list'));
    }
  }
}
