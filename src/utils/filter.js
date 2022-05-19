import {FilterType} from '../const';

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isHistory),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

export {filter};
