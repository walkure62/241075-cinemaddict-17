import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeCommentDate} from '../utils/film';
import { UpdateType, UserAction } from '../const';
import { nanoid } from 'nanoid';
//import he from 'he';

const createCommentTemplate = (commentData) => {
  const {emotion, comment, author, date} = commentData;

  return `<li class="film-details__comment">
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

const createNewCommentTemplate = (state) => {
  const isSmile = state.emojiSelected === 'smile' ? 'checked' : '';

  const isSleeping = state.emojiSelected === 'sleeping' ? 'checked' : '';

  const isPuke = state.emojiSelected === 'puke' ? 'checked' : '';

  const isAngry = state.emojiSelected === 'angry' ? 'checked' : '';
  return `
  <div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
    ${showSelectedEmoji(state.emojiSelected)}
    </div>
    <label class="film-details__comment-label">
    ${showTypedComment(state.typedComment)}
    </label>

  <div class="film-details__emoji-list">
    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isSmile()}>
    <label class="film-details__emoji-label" for="emoji-smile">
      <img src="./images/emoji/smile.png" width="30" height="30" alt="smile">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isSleeping()}>
    <label class="film-details__emoji-label" for="emoji-sleeping">
      <img src="./images/emoji/sleeping.png" width="30" height="30" alt="sleeping">
    </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isPuke()}>
      <label class="film-details__emoji-label" for="emoji-puke">
        <img src="./images/emoji/puke.png" width="30" height="30" alt="puke">
      </label>

    <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isAngry()}>
      <label class="film-details__emoji-label" for="emoji-angry">
        <img src="./images/emoji/angry.png" width="30" height="30" alt="angry">
      </label>
  </div>
  </div>`;
};

const createCommentsTemplate = (commentsData, state) => (`
     <div class="film-details__bottom-container">
       <section class="film-details__comments-wrap">
         <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsData.length}</span></h3>
         <ul class="film-details__comments-list">
           ${generateComments(commentsData)}
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
    this._state = CommentView.parseFilmToState(this.#film, this.#comments);
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

  #submitFormHandler = (evt) => {
    if (evt.ctrlKey && evt.key === 'Enter' || evt.metaKey && evt.key === 'Enter') {
      const scrollPosition = this.element.scrollTop;
      this.element.scrollTop = scrollPosition;
      this.#addNewComment();
      this.updateElement({emojiSelected: null, typedComment: null});
    }
  };

  #addNewComment = () =>
    this._state.comments.push({
      id: nanoid(),
      author: 'Mit Notrub',
      comment: this.element.querySelector('.film-details__comment-input').value,
      date: humanizeCommentDate(new Date()),
      emotion: this._state.emojiSelected,
    });

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      typedComment: evt.currentTarget.value,
    });
  };

  #handleDeleteClick = (film) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      film,
    );
  };


  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setWatchListClickHandler(this._callback.watchListClick);
    this.setHistoryClickHandler(this._callback.historyClick);
  };

  #setInnerHandlers = () => {
    document.addEventListener('keypress', this.#submitFormHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#changeReactionHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#descriptionInputHandler);
  };

  static parseCommentToState = (film, comments) => ({...film, comments,
    emojiSelected: null,
    typedComment: null,
  });

  static parseStateToComment = (state) => {
    const film = {...state};

    delete film.emojiSelected;
    delete film.typedComment;

    return film;
  };
}
