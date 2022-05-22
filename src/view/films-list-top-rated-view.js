import AbstractView from '../framework/view/abstract-view.js';

const createFilmListExtraTemplate = () => `
  <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container">
      </div>
  </section>`;

export default class FilmsListTopRatedView extends AbstractView {

  get template() {
    return createFilmListExtraTemplate();
  }
}
