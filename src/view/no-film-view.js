import {createElement} from '../render.js';

const createNoFilmTemplate = () => (
  '<h2 class="films-list__title">There are no movies in our database</h2>'
);

export default class NoFilmView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoFilmTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
