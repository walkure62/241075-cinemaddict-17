import {generateFilm} from '../mock/film.js';
import { generateComment } from '../mock/comment.js';
import { getRandomInteger } from '../utils/common.js';

export default class FilmsModel {
  #films = Array.from({length: `${getRandomInteger(0, 25)}`}, generateFilm);
  #comments = Array.from({length: `${getRandomInteger(0, 5)}`}, generateComment);

  getComments = () => this.#comments;
  getFilms = () => this.#films;
}
