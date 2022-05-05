import FilmsPresenter from './presenter/films-presenter.js';
import FilmsModel from './model/film-model.js';

const filmModel = new FilmsModel();
const renderFilms = new FilmsPresenter();

renderFilms.init(filmModel);
