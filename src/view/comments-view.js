import { createElement } from '../render.js';

const createCommentTemplate = (comment) => {
  const {text, emoji, author, date} = comment;

  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${emoji}" width="55" height="55" alt="emoji-angry">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
};

export default class CommentsView {
  #element = null;
  #comment = null;

  constructor(comment) {
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

