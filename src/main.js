import GalleryPresenter from './presenter/gallery-presenter.js';
import FilmsModel from './model/film-model.js';
import CommentModel from './model/comment-model.js';
import FilterModel from './model/filter-model.js';
import SortingModel from './model/sorting-model.js';

const filmModel = new FilmsModel();
const commentModel = new CommentModel();
const filterModel = new FilterModel();
const sortingModel = new SortingModel();
const renderGallery = new GalleryPresenter(filmModel, commentModel, filterModel, sortingModel);

renderGallery.init();
