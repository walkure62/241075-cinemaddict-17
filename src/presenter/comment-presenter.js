import { remove, render, replace } from '../framework/render.js';
import CommentView from '../view/comment-view.js';

export default class CommentPresenter {
  #popupContainer = null;
  #commentContainer = null;
  #commentComponent = null;
  #changeData = null;
  #comments = [];
  #film = null;
  #commentsModel = null;

  constructor(popupContainer, film, commentsModel, comments, changeData) {
    this.#comments = comments;
    this.#film = film;
    this.#commentsModel = commentsModel;
    this.#popupContainer = popupContainer;
    this.#commentContainer = this.#popupContainer.querySelector('.film-details__inner');
    this.#changeData = changeData;

    this.#commentsModel.addObserver(this.#handleCommentModelChange);
  }

  init(film) {
    this.#commentComponent = new CommentView(film, this.#comments, this.#changeData);
    const prevCommentComponent = this.#commentComponent;

    if (prevCommentComponent) {
      render(this.#commentComponent, this.#commentContainer);
      return;
    }
    if (this.#popupContainer.contains(prevCommentComponent.element)) {
      replace(this.#commentComponent, prevCommentComponent);
    }
    remove(prevCommentComponent);
  }

  destroy = () => {
    remove(this.#commentComponent);
  };

  /* #handleAddComment = (update) => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      update,
    );
  };
  */

  #handleCommentModelChange = (updateType, updatedFilm) => {
    this.init(updatedFilm);
  };
}
