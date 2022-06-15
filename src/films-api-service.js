import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const {filmInfo, userDetails} = film;
    const adaptedFilm = {...film,
      'film_info': {
        ...filmInfo,
        'alternative_title': filmInfo.alternativeTitle,
        'total_rating': filmInfo.totalRating,
        'age_rating': filmInfo.ageRating,
        'release': {
          'date': filmInfo.release.date,
          'release_country': filmInfo.release.country
        },
      },
      'user_details': {...userDetails,
        'watchlist': userDetails.isWatchlist,
        'already_watched': userDetails.isHistory,
        'watching_date': userDetails.watchingDate,
        'favorite': userDetails.isFavorite,
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.film_info.alternativeTitle;
    delete adaptedFilm.film_info.totalRating;
    delete adaptedFilm.film_info.ageRating;
    delete adaptedFilm.film_info.release.country;
    delete adaptedFilm.userDetails;
    delete adaptedFilm.user_details.isWatchlist;
    delete adaptedFilm.user_details.isHistory;
    delete adaptedFilm.user_details.watchingDate;
    delete adaptedFilm.user_details.isFavorite;

    return adaptedFilm;
  };
}
