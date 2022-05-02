import {generateFilm} from '../mock/film.js';
import { getRandomInteger } from '../utils.js';

export default class FilmsModel {
  films = Array.from({length: `${getRandomInteger(5, 30)}`}, generateFilm);

  getFilms = () => this.films;
}
