import GalleryPresenter from './presenter/gallery-presenter.js';
import FilmsModel from './model/film-model.js';
import CommentModel from './model/comment-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';

const AUTHORIZATION = 'Basic hG8fJl5f90hghRT7';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const filmModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const commentModel = new CommentModel();
const filterModel = new FilterModel();
const renderGallery = new GalleryPresenter(filmModel, commentModel, filterModel);

renderGallery.init();
filmModel.init();
