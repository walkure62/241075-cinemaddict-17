import dayjs from 'dayjs';

const humanizeCommentDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

const humanizeReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
const getYearFromReleaseDate = (date) => dayjs(date).format('YYYY');

const humanizeRuntime = (time) => {
  const hours = Math.trunc(time/60);
  const minutes = time % 60;
  if(hours !== 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${time}m`;
};

const isFilmInWatchlist = (watchlist) => Object.values(watchlist).some(Boolean);
const isFilmFavorite = (favorite) => Object.values(favorite).some(Boolean);
const isFilmInHistory = (history) => Object.values(history).some(Boolean);


export {humanizeCommentDate, humanizeReleaseDate, getYearFromReleaseDate, humanizeRuntime, isFilmInWatchlist, isFilmFavorite, isFilmInHistory};
