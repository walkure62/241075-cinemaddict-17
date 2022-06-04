import { remove, render, RenderPosition, replace } from '../framework/render';
import CommentView from '../view/comment-view';

export default class CommentPresenter {
  #commentsContainer = null;
  #commentComponent = null;
  #commentModel = null;
  #changeData = null;
  #comments = null;

  constructor(commentsContainer, commentModel, changeData) {
    this.#commentModel = commentModel;
    this.#commentsContainer = commentsContainer;
    this.#changeData = changeData;
  }

  init(film) {
    const prevCommentComponent = this.#commentComponent;
    this.#comments = this.#filterCommentsFilm(this.commentModel.comments);
    this.#commentComponent = new CommentView(film, this.#comments, this.#changeData);
    // this.#commentComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (!prevCommentComponent) {
      render(this.#commentComponent, this.#commentsContainer, RenderPosition.AFTEREND);
      return;
    }
    if (this.#commentsContainer.contains(prevCommentComponent.element)) {
      replace(this.#commentComponent, prevCommentComponent);
    }
    remove(prevCommentComponent);
  }

  destroy = () => {
    remove(this.#commentComponent);
  };

  #filterCommentsFilm = (comments) => {
    const filmComments = [];
    comments.forEach((id) => {
      filmComments.push(comments.find((comment) => comment.id === id));
    });

    return filmComments;
  };

  /* #handleFormSubmit = (update) => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.PATCH,
      update,
    );
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (task) => {
    this.#changeData(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      task,
    );
    this.#replaceFormToCard();
  };
} */
}
