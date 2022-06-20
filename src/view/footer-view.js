import AbstarctView from '../framework/view/abstract-view';

const createFooterTemplate = (filmsCount) => `<p>${filmsCount} movies inside</p>`;

export default class FooterView extends AbstarctView {
  #filmsCount = null;

  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFooterTemplate(this.#filmsCount);
  }
}
