import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeReleaseDate, humanizeDate } from '../utils/film.js';
import { nanoid }from 'nanoid';

const BLANK_FILM = {
  filmInfo: {
    title: 'RandomTitle',
    alternativeTitle: 'RandomTitle',
    totalRating: 5.0,
    poster: 'images/posters/the-man-with-the-golden-arm.jpg',
    ageRating: 18,
    director: 'Tim Burton',
    writers: 'Tim Burton',
    actors: 'Tim Burton',
    release: {
      date: 2022,
      releaseCountry: 'USA',
    },
    runtime: 80,
    genre: 'Horror',
    description: 'Arthur Fleck works as a clown and is an aspiring stand-up comic. He has mental health issues, part of which involves uncontrollable laughter. Times are tough and, due to his issues and occupation, Arthur has an even worse time than most. Over time these issues bear down on him, shaping his actions, making him ultimately take on the persona he is more known as...Joker.'
  },
  userDetails: {
    watchlist: true,
    alreadyWatched: false,
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: false
  },
};

const createDetailedInformationTemplate = (film = BLANK_FILM, comments, emojiSelected, typedComment) => {
  const {filmInfo, userDetails, numberOfComments} = film;

  const showGenres = (genres) => {
    let template = '';
    genres.forEach((el) => {
      template += `<span class="film-details__genre">${el}</span>`;
    });
    return template;
  };

  const createCommentTemplate = (message) => {
    const {emotion, comment, author, date} = message;

    return `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${date}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
        </li>
      `;
  };

  const generateComments = (arr) => arr.reduce((acc, elem) => `${acc} ${createCommentTemplate(elem)}`, '');
  const showTypedComment = (comment) => comment ? `<textarea class='film-details__comment-input' name='comment'>${comment}</textarea>` : '<textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>';

  const createNewCommentTemplate = () => `
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label">
      ${emojiSelected ? `<img src="./images/emoji/${emojiSelected}.png" width="55" height="55" alt="${emojiSelected}">` : ''}
      </div>
      <label class="film-details__comment-label">
      ${showTypedComment(typedComment)}
      </label>

    <div class="film-details__emoji-list">
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
      <label class="film-details__emoji-label" for="emoji-smile">
        <img src="./images/emoji/smile.png" width="30" height="30" alt="smile">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
      <label class="film-details__emoji-label" for="emoji-sleeping">
        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="sleeping">
      </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
        <label class="film-details__emoji-label" for="emoji-puke">
          <img src="./images/emoji/puke.png" width="30" height="30" alt="puke">
        </label>

      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/angry.png" width="30" height="30" alt="angry">
        </label>
    </div>
    </div>`;

  return `
<section class="film-details">
<form class="film-details__inner" action="" method="get">
  <div class="film-details__top-container">
    <div class="film-details__close">
      <button class="film-details__close-btn" type="button">close</button>
    </div>
    <div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

        <p class="film-details__age">${filmInfo.ageRating}</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${filmInfo.title}</h3>
            <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${filmInfo.totalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${filmInfo.director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${filmInfo.writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${filmInfo.actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${humanizeReleaseDate(filmInfo.release.date)}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${filmInfo.runtime}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${filmInfo.release.country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Genres</td>
            <td class="film-details__cell">
              ${showGenres(filmInfo.genre)}
          </tr>
        </table>

        <p class="film-details__film-description">${filmInfo.description}</p>
      </div>
    </div>

    <section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.isWatchlist ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.isHistory ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.isFavorite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
    </section>
  </div>
  <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${numberOfComments}</span></h3>
        <ul class="film-details__comments-list">${generateComments(comments)}</ul>
        ${createNewCommentTemplate()}
      </section>
    </div>
    </form>
  </section>`;
};

export default class FilmDetailsView extends AbstractStatefulView {

  constructor(film, comments) {
    super();
    this._state = FilmDetailsView.parseFilmToState(film, comments);
    this.#setInnerHandlers();
    console.log(this._state.comments);
  }

  get template() {
    return createDetailedInformationTemplate(this._state, this._state.comments, this._state.emojiSelected, this._state.typedComment);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#clickCloseHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#clickFavorite);
  }

  setHistoryClickHandler(callback) {
    this._callback.historyClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#clickHistory);
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#clickWatchList);
  }

  #clickCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
    this.element.remove();
  };

  #clickFavorite = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.favoriteClick();
  };

  #clickHistory = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.historyClick();
  };

  #clickWatchList = (evt) => {
    evt.preventDefault();
    evt.target.classList.toggle('film-details__control-button--active');
    this._callback.watchListClick();
  };

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
      this._state.comments.push(this.#addNewComment());
      this.updateElement({emojiSelected: null, typedComment: null});
      this.element.scrollTop = scrollPosition;
    }
  };

  #addNewComment = () =>
    ({
      id: nanoid(),
      author: 'Mit Notrub',
      comment: this.element.querySelector('.film-details__comment-input').value,
      date: humanizeDate(new Date()),
      emotion: this.element.querySelector('.film-details__emoji-item:checked').value
    });

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      typedComment: evt.currentTarget.value,
    });
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

  static parseCommentToState = (comment) => this._state.comments.push(comment);

  static parseFilmToState = (film, comments) => ({...film, comments, emojiSelected: null, typedComment: null});
}
