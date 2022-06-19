import Observable from '../framework/observable.js';

export default class CommentModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get comments () {
    return this.#comments;
  }

  init = async (film) => {
    try {
      const comments = await this.#filmsApiService.getComments(film);
      this.#comments = comments;
    } catch (err) {
      this.#comments = [];
    }
  };

  addComment = async (updateType, update, updatedComment) => {
    try {
      const updatedFilm = await this.#filmsApiService.addComment(updatedComment, update).then((movie) => movie);
      this.#comments = [...updatedFilm.comments];
      this._notify(updateType, this.#adaptToClient(updatedFilm.movie));
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };


  deleteComment = async (updateType, updatedFilm, updatedComment) => {
    const index = this.#comments.findIndex((comment) => comment.id === updatedComment.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment...');
    }
    try {
      await this.#filmsApiService.deleteComment(updatedComment);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t delete comment...');
    }
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

    // Ненужные ключи мы удаляем
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
