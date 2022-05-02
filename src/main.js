import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/film-model.js';
import filmDetailsModel from './model/film-details-model.js';
import FilmDetailsPresenter from './presenter/film-details-presenter.js';

const filmModel = new FilmsModel();
const commentModel = new filmDetailsModel();
const renderFilms = new FilmsPresenter();
const renderFilmDetails = new FilmDetailsPresenter();

renderFilms.init(filmModel);
renderFilmDetails.init(commentModel);
