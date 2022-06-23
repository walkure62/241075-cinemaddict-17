import AbstractView from '../framework/view/abstract-view.js';

const createMostCommentedFilmListTemplate = () => `
  <section class="films-list films-list--extra film-list--most-commented">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container"></div>
  </section>`;

export default class MostCommentedFilmsListView extends AbstractView {

  get template() {
    return createMostCommentedFilmListTemplate();
  }
}
