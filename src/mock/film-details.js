import {getRandomInteger, humanizeReleaseDate} from '../utils.js';
import dayjs from 'dayjs';
import { generateFilm } from './film.js';

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

export const generateFilmDetails = () => {
  const filmCard = generateFilm();
  filmCard.originalTitle = filmCard.title;
  filmCard.director = generateName();
  filmCard.writers = generateName();
  filmCard.actors = generateName();
  filmCard.release = humanizeReleaseDate(generateReleaseDate());
  filmCard.country = generateCountry();
  filmCard.ageRating = generateAgeRating();

  return filmCard;
};

