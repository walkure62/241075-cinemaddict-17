import {getRandomInteger, counterId} from '../utils.js';

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

const generateGenre = () => {
  const genres = [
    'Comedy',
    'Drama',
    'Mystery',
    'Western',
    'Cartoon',
    'Musical',
  ];

  const randomIndex = getRandomInteger(0, genres.length - 1);

  return genres[randomIndex];
};

const generateComments = () => Array.from({length: `${getRandomInteger(1, 7)}`}, () => getRandomInteger(1, 7));

export const generateFilm = () => {
  const film = {
    id: counterId(),
    image: `./images/posters/${generateImage()}`,
    title: generateTitle(),
    rating: (getRandomInteger(200, 900) / 100).toFixed(1),
    year: getRandomInteger(1995, 2000),
    time: `${getRandomInteger(1, 3)}h ${getRandomInteger(10, 40)}m`,
    genre: generateGenre(),
    description: generateDescription(),
    comments: generateComments(),
  };

  film.numberOfComments = film.comments.length;

  return film;
};
