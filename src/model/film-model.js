import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';


export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  init = async () => {
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }
    this._notify(UpdateType.INIT);
  };

  get films () {
    return this.#films;
  }

  updateFilm = async (updateType, update) => {

    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film...');
    }

    try {
      const response = await this.#filmsApiService.updateFilm(update);
      const updatedTask = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedTask,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedTask);
    } catch(err) {
      throw new Error('Can\'t update this film...');
    }
  };

  updateLocalFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);
    if(index === -1) {
      throw new Error('Can\'t update unexisting film...');
    }
    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];
  };


  #adaptToClient = (film) => {
    const adaptedFilm = {...film,
      filmInfo: {
        ...film.film_info,
        alternativeTitle: film.film_info.alternative_title,
        totalRating: film.film_info.total_rating,
        ageRating: film.film_info.age_rating,
        release: {
          date: film.film_info.release.date,
          country: film.film_info.release.release_country
        }
      },
      userDetails: {...film.user_details,
        isWatchlist: film.user_details.watchlist,
        isHistory: film.user_details.already_watched,
        watchingDate: film.user_details.watching_date,
        isFavorite: film.user_details.favorite,
      }
    };

    // Удаляем ненужные ключи
    delete adaptedFilm.film_info;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.release.release_country;
    delete adaptedFilm.user_details;
    delete adaptedFilm.userDetails.watchlist;
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;
    delete adaptedFilm.userDetails.favorite;

    return adaptedFilm;
  };
}

