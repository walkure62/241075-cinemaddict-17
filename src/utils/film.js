import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(RelativeTime);

const humanizeCommentDate = (date) => dayjs(date).fromNow();

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


export {humanizeCommentDate, humanizeReleaseDate, getYearFromReleaseDate, humanizeRuntime};
