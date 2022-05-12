import dayjs from 'dayjs';

const humanizeDate = (date) => dayjs(date).format('YYYY/MM/D HH:MM');

const humanizeReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');

const isFilmInWatchlist = (watchlist) => Object.values(watchlist).some(Boolean);
const isFilmFavorite = (favorite) => Object.values(favorite).some(Boolean);
const isFilmInHistory = (history) => Object.values(history).some(Boolean);


export {humanizeDate, humanizeReleaseDate, isFilmInWatchlist, isFilmFavorite, isFilmInHistory};
