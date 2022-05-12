import {getRandomInteger, counterId} from '../utils/common.js';
import {humanizeDate} from '../utils/film.js';
import dayjs from 'dayjs';
import {generateFilm} from './film.js';

const generateText = () => {
  const texts = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
  ];

  const randomIndex = getRandomInteger(0, texts.length - 1);

  return texts[randomIndex];
};


const generateEmoji = () => {
  const emojis = [
    'smile.png',
    'sleeping.png',
    'puke.png',
    'angry.png',
  ];

  const randomIndex = getRandomInteger(0, emojis.length - 1);

  return emojis[randomIndex];
};

const generateAuthor = () => {
  const authors = [
    'Andrew',
    'Alex',
    'Paul',
    'Sam',
    'Viktor',
    'Alexa',
  ];

  const randomIndex = getRandomInteger(0, authors.length - 1);

  return authors[randomIndex];
};

const generateDate = () => {
  const minDaysGap = 2000;
  const daysGap = getRandomInteger(-minDaysGap, 0);

  return dayjs().add(daysGap, 'day').toDate();
};

export const generateComment = () => ({
  id: counterId(),
  text: generateText(),
  emoji: `./images/emoji/${generateEmoji()}`,
  author: generateAuthor(),
  date: humanizeDate(generateDate()),
  numberOfComments: generateFilm().comments.length,
});
