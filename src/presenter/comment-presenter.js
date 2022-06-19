import { remove, render, replace } from '../framework/render.js';
import CommentView from '../view/comment-view.js';

export default class CommentPresenter {
  #popupContainer = null;
  #commentContainer = null;
  #commentComponent = null;
  #changeData = null;
  #film = null;
  #commentsModel = null;

  constructor(popupContainer, film, commentsModel, changeData) {
    this.#film = film;
    this.#commentsModel = commentsModel;
    this.#popupContainer = popupContainer;
    this.#commentContainer = this.#popupContainer.querySelector('.film-details__inner');
    this.#changeData = changeData;

    this.#commentsModel.addObserver(this.#handleCommentModelEvent);
  }

  init = async (film, updateType) => {
    const comments = updateType ? this.#commentsModel.comments : await this.#commentsModel.init(film).then(() => this.#commentsModel.comments);
    const prevCommentComponent = this.#commentComponent;
    this.#commentComponent = new CommentView(film, comments, this.#handleCommentModelChange);

    if (!prevCommentComponent) {
      render(this.#commentComponent, this.#commentContainer);
      return;
    }
    if (this.#popupContainer.contains(prevCommentComponent.element)) {
      replace(this.#commentComponent, prevCommentComponent);
    }
    remove(prevCommentComponent);
  };

  destroy = () => remove(this.#commentComponent);

  #handleCommentModelChange = (actionType, updateType, updatedFilm, UpdatedComment) => this.#changeData(actionType, updateType, updatedFilm, UpdatedComment);

  #handleCommentModelEvent = (updateType, updatedFilm) => this.init(updatedFilm, updateType);
}
