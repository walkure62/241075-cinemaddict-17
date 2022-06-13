import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeCommentDate} from '../utils/film';
import { UpdateType, UserAction } from '../const';
import { nanoid } from 'nanoid';
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

    if (evt.target.nodeName === 'IMG') {
      const emotionName = evt.target.alt;
      if(this._state.emojiSelected !== emotionName){
        const scrollPosition = this.element.scrollTop;
        this.updateElement({emojiSelected: emotionName});
        this.element.scrollTop = scrollPosition;
      }
    }
  };

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      typedComment: he.encode(evt.currentTarget.value),
    });
    this.updateElement({typedComment: he.encode(evt.currentTarget.value)});
  };

  #submitFormHandler = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter' || evt.metaKey && evt.key === 'Enter') {
      const scrollPosition = this.element.scrollTop;
      this.element.scrollTop = scrollPosition;
      const comment = this.#addNewComment();
      this._state.comments.push(comment);
      this.updateElement({emojiSelected: null, typedComment: null});
      this.element.scrollTop = scrollPosition;
      const commentsId = [];
      this._state.comments.forEach((el) => commentsId.push(el.id));
      this.#changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        {...this._state, comments: commentsId},
        comment
      );
    }
  };

  #addNewComment = () =>
    ({
      id: nanoid(),
      author: 'Mit Notrub',
      comment: he.encode(this.element.querySelector('.film-details__comment-input').value),
      date: humanizeCommentDate(new Date()),
      emotion: this._state.emojiSelected,
    });

  #handleDeleteCommentClick = (evt) => {
    evt.preventDefault();
    //console.log(evt.currentTarget.dataset.id);
    //console.log(evt.currentTarget);
    if (evt.target.nodeName === 'BUTTON') {
      const commentId = evt.currentTarget.dataset.id;
      const selectedComment = this.#comments.filter((comment) =>  commentId === comment.id);
      const updatedFilmComments = this._state.comments.filter((comment) => commentId !== comment.id);
      this._state.comments = updatedFilmComments;
      const commentsId = [];
      this._state.comments.forEach((el) => commentsId.push(el.id));
      this.#changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        {...this._state, comments: commentsId},
        selectedComment[0]
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
    //document.querySelectorAll('.film-details__comment').forEach((comment) => comment.addEventListener('click', this.#handleDeleteCommentClick));
  };

  static parseCommentToState = (film, comments) => ({...film, comments,
    emojiSelected: null,
    typedComment: null,
  });
}
