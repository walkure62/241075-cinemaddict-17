import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeCommentDate} from '../utils/film';
import { UpdateType, UserAction } from '../const';
import he from 'he';

const createCommentTemplate = (commentData) => {
  const {emotion, comment, author, date, id} = commentData;

  return `<li class="film-details__comment" data-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
      </li>`;
};

const generateComments = (arr) => arr.map((elem) => createCommentTemplate(elem));
const showTypedComment = (comment) => comment ? `<textarea class='film-details__comment-input' name='comment'>${comment}</textarea>` : '<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>';
const showSelectedEmoji = (emoji) => emoji ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji">` : '';

const createNewCommentTemplate = (state) => `
  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
    ${showSelectedEmoji(state.emojiSelected)}
    </div>
    <label class="film-details__comment-label">
    ${showTypedComment(state.typedComment)}
    </label>

  <div class="film-details__emoji-list">
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${state.emojiSelected === 'smile' ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-smile">
      <img src="./images/emoji/smile.png" width="30" height="30" alt="smile">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${state.emojiSelected === 'sleeping' ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-sleeping">
      <img src="./images/emoji/sleeping.png" width="30" height="30" alt="sleeping">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${state.emojiSelected === 'puke' ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="puke">
      </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${state.emojiSelected === 'angry' ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="angry">
      </label>
  </div>
  </div>`;

const createCommentsTemplate = (commentsData, state) => (`
     <div class="film-details__bottom-container">
       <section class="film-details__comments-wrap">
         <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsData.length}</span></h3>
         <ul class="film-details__comments-list">
           ${generateComments(commentsData).join('')}
         </ul>
         ${createNewCommentTemplate(state)}
         </div>
       </section>
     </div>
   `);

export default class CommentView extends AbstractStatefulView {
  #film = null;
  #comments = null;
  #changeData = null;

  constructor(film, comments, changeData) {
    super();
    this.#film = film;
    this.#comments = comments;
    this.#changeData = changeData;
    this._state = CommentView.parseCommentToState(this.#film, this.#comments);
    this.element.querySelectorAll('.film-details__comment').forEach((comment) => comment.addEventListener('click', this.#handleDeleteCommentClick));
    this.#setInnerHandlers();
  }

  get template() {
    return createCommentsTemplate(this.#comments, this._state);
  }

  #changeReactionHandler = (evt) => {
    const commentText = this.element.querySelector('.film-details__comment-input').value;
    if (evt.target.nodeName === 'INPUT') {
      const emotionName = evt.target.value;
      if(this._state.emojiSelected !== emotionName){
        const scrollPosition = this.element.scrollTop;
        this.updateElement({emojiSelected: emotionName, typedComment: he.encode(commentText)});
        this.element.scrollTop = scrollPosition;
      }
    }
  };

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      typedComment: he.encode(evt.currentTarget.value),
    });
  };

  #submitFormHandler = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter' || evt.metaKey && evt.key === 'Enter') {
      const newCommentContainer = evt.currentTarget;
      const newCommentTextArea = newCommentContainer.querySelector('textarea');
      newCommentTextArea.disabled = true;
      const scrollPosition = this.element.scrollTop;
      const newComment = this.#addNewComment();
      const filteredFilmCommentIds = this._state.comments.map((comment) => comment.id);
      const updatedFilm = {...this._state, comments: filteredFilmCommentIds};
      delete updatedFilm.emojiSelected;
      delete updatedFilm.typedComment;
      this.element.scrollTop = scrollPosition;

      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        updatedFilm,
        [newComment, newCommentContainer]
      );
    }
  };


  #addNewComment = () =>
    ({
      comment: he.encode(this.element.querySelector('.film-details__comment-input').value),
      emotion: this.element.querySelector('.film-details__emoji-item:checked').value,
    });

  #handleDeleteCommentClick = (evt) => {
    const commentContainer = evt.currentTarget;
    if (evt.target.nodeName === 'BUTTON') {
      evt.preventDefault();
      const commentId = commentContainer.dataset.id;
      const filteredFilmCommentIds = this._state.comments.filter((comment) => comment.id !== commentId).map((comment) => comment.id);
      const updatedFilm = {...this._state, comments: filteredFilmCommentIds};
      const deletedComment = this._state.comments.find((comment) => comment.id.toString() === commentId);
      evt.target.disabled = true;
      evt.target.textContent = 'Deleting...';

      delete updatedFilm.emojiSelected;
      delete updatedFilm.typedComment;

      this.#changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        updatedFilm,
        [deletedComment, commentContainer]
      );
    }
  };


  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #setInnerHandlers = () => {
    document.addEventListener('keypress', this.#submitFormHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#changeReactionHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#descriptionInputHandler);
  };

  static parseCommentToState = (film, comments) => ({...film, comments,
    emojiSelected: null,
    typedComment: null,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });
}
