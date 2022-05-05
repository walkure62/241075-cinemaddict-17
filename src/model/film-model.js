import {generateFilm} from '../mock/film.js';
import { generateComment } from '../mock/comment.js';
import { generateFilmDetails } from '../mock/film-details.js';
import { getRandomInteger } from '../utils.js';

export default class FilmsModel {
  #films = Array.from({length: `${getRandomInteger(0, 25)}`}, generateFilm);
  #filmDetails = generateFilmDetails();
  #comments = Array.from({length: `${getRandomInteger(1, 10)}`}, generateComment);

  getFilmDetails = () => this.#filmDetails;
  getComments = () => this.#comments;
  getFilms = () => this.#films;
}
