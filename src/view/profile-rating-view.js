import AbstarctView from '../framework/view/abstract-view';

const createUserProfileTemplate = (wathedFilmsCount) => {
  const userRank = (filmsCount) => {
    if (filmsCount > 0 && filmsCount <= 10) {
      return 'Novice';
    } else if (filmsCount > 10 && filmsCount <= 20) {
      return 'Fan';
    } else if (filmsCount > 20) {
      return 'Movie buff';
    }
    return '';
  };

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank(wathedFilmsCount)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`);
};

export default class ProfileRatingView extends AbstarctView {
  #wathedFilmsCount = null;

  constructor(wathedFilmsCount) {
    super();
    this.#wathedFilmsCount = wathedFilmsCount;
  }

  get template() {
    return createUserProfileTemplate(this.#wathedFilmsCount);
  }
}
