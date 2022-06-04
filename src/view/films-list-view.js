import AbstractView from '../framework/view/abstract-view.js';

const createFilmListTemplate = () => `
  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
    </section>
  <section class="films-list films-list--extra film-list--top-rated">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container films-list__container--top-rated"></div>
    </section>
    <section class="films-list films-list--extra film-list--most-commented">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container films-list__container--most-commented"></div>
    </section>
    </section>`;

export default class FilmsListView extends AbstractView {

  get template() {
    return createFilmListTemplate();
  }
}
