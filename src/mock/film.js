import {getRandomInteger} from '../utils/common.js';
import dayjs from 'dayjs';
import { nanoid }from 'nanoid';

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
    'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateImage = () => {
  const images = [
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
  ];

  const randomIndex = getRandomInteger(0, images.length - 1);

  return images[randomIndex];
};

const generateTitle = () => {
  const titles = [
    'Made for Each Other',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'Sagebrush Trail',
    'Santa Claus Conquers the Martians',
    'The Dance of Life',
    'The Great Flamarion',
    'The Man with the Golden Arm',
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generateGenre = (count) => {
  const genresList = [];
  const genres = [
    'Comedy',
    'Drama',
    'Mystery',
    'Western',
    'Cartoon',
    'Musical',
  ];
  for (let i = 0; i <= count; i++) {
    const randomIndex = getRandomInteger(0, genres.length - 1);

    genresList.push(genres[randomIndex]);
  }

  return genresList;
};

const generateName = () => {
  const names = [
    'Andrew Hokking',
    'Alex Fox',
    'Paul Digros',
    'Sam Pollis',
    'Viktor Gaash',
    'Alexa Qwergy',
  ];
  const randomIndex = getRandomInteger(0, names.length - 1);

  return names[randomIndex];
};

const generateCountry = () => {
  const countries = [
    'Italy',
    'USA',
    'Turkey',
    'Canada',
    'Spain',
    'Finland',
  ];
  const randomIndex = getRandomInteger(0, countries.length - 1);

  return countries[randomIndex];
};

const generateReleaseDate = () => {
  const minDaysGap = 2000;
  const daysGap = getRandomInteger(-minDaysGap, 0);

  return dayjs().add(daysGap, 'day').toDate();
};

const generateAgeRating = () => {
  const ages = [
    '18+',
    '16+',
    '14+',
    '0+',
    '7+',
  ];
  const randomIndex = getRandomInteger(0, ages.length - 1);

  return ages[randomIndex];
};

const generateComments = () => Array.from({length: `${getRandomInteger(1, 5)}`}, () => getRandomInteger(0, 9));

export const generateFilm = () => {
  const film = {
    id: nanoid(),
    comments: generateComments(),
    filmInfo: {
      title: generateTitle(),
      alternativeTitle: generateTitle(),
      totalRating: (getRandomInteger(200, 900) / 100).toFixed(1),
      poster: `./images/posters/${generateImage()}`,
      ageRating: generateAgeRating(),
      director: generateName(),
      writers: generateName(),
      actors: generateName(),
      release: {
        date: generateReleaseDate(),
        country: generateCountry(),
      },
      runtime: `${getRandomInteger(10, 90)}`,
      genre: generateGenre(getRandomInteger(0, 3)),
      description: generateDescription(),
    },
    userDetails: {
      isWatchlist: Boolean(getRandomInteger(0, 1)),
      isHistory: Boolean(getRandomInteger(0, 1)),
      watchingDate: '2019-04-12T16:12:32.554Z',
      isFavorite: Boolean(getRandomInteger(0, 1)),
    }
  };

  return film;
};
