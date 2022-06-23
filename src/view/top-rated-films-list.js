import AbstractView from '../framework/view/abstract-view.js';

const createTopRatedFilmListTemplate = () => `
  <section class="films-list films-list--extra film-list--top-rated">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container"></div>
  </section>`;

export default class TopRatedFilmsListView extends AbstractView {

  get template() {
    return createTopRatedFilmListTemplate();
  }
}
