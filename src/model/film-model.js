import Observable from '../framework/observable.js';
import {generateFilm} from '../mock/film.js';
import { getRandomInteger } from '../utils/common.js';

const QUANTITY_FILMS = getRandomInteger(0, 25);

export default class FilmsModel extends Observable {
  #films = Array.from({length: `${QUANTITY_FILMS}`}, generateFilm);

  get films () {
    return this.#films;
  }

  updateFilm = (updateType, update) => {

    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update this film...');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}

