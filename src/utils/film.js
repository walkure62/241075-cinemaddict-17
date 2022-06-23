import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';

const QUANTITY_MINUTES_IN_HOUR = 60;

dayjs.extend(RelativeTime);

const humanizeCommentDate = (date) => dayjs(date).fromNow();

const humanizeReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
const getYearFromReleaseDate = (date) => dayjs(date).format('YYYY');

const humanizeRuntime = (time) => {
  const hours = Math.trunc(time/QUANTITY_MINUTES_IN_HOUR);
  const minutes = time % QUANTITY_MINUTES_IN_HOUR;
  if(hours !== 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${time}m`;
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateRandomFilms = (films, amount) => {
  const randomFilms = [];
  while (randomFilms.length < amount) {
    const element = films[getRandomInteger(0, films.length - 1)];
    if (!randomFilms.find((el) => el.id === element.id)) {
      randomFilms.push(element);
    }
  }
  return randomFilms;
};


export {humanizeCommentDate, humanizeReleaseDate, getYearFromReleaseDate, humanizeRuntime, generateRandomFilms};
