import {FilterType} from '../const';

const Filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.isHistory),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.isFavorite),
};

const generateFilter = (films) => Object.entries(Filter).map(
  ([filterName, filterFilms]) => ({
    name: filterName,
    count: filterFilms(films).length,
  }),
);

export {Filter, generateFilter};
