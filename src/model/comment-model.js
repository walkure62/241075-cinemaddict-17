import Observable from '../framework/observable.js';
import { generateComment } from '../mock/comment.js';

const QUANTITY_COMMENTS = 10;

export default class CommentModel extends Observable {
  #comments = Array.from({length: QUANTITY_COMMENTS}, generateComment);

  get comments () {
    return this.#comments;
  }

  addComment = (updateType, update, updatedComment) => {
    this.#comments = [
      updatedComment,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update, updatedComment) => {
    const index = this.#comments.findIndex((comment) => comment.id === updatedComment.id);

    if (index === -1) {
      throw new Error('Can\'t delete this comment...');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}
