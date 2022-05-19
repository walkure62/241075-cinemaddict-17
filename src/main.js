import GalleryPresenter from './presenter/gallery-presenter.js';
import FilmsModel from './model/film-model.js';

const filmModel = new FilmsModel();
const renderGallery = new GalleryPresenter(filmModel);

renderGallery.init();
