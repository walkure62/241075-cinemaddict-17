import { remove, render, replace } from '../framework/render';
import ProfileRatingView from '../view/profile-rating-view.js';
import { FilterType } from '../const.js';
import { Filter } from '../utils/filter.js';

export default class ProfileRatingPresenter {
  #userProfileContainer = null;
  #userProfileComponent = null;
  #filmModel = null;

  constructor(userProfileContainer, filmModel) {
    this.#userProfileContainer = userProfileContainer;
    this.#filmModel = filmModel;
    this.#filmModel.addObserver(this.#handleFilmsModelChange);
  }

  get films() {
    const films = this.#filmModel.films;
    return Filter[FilterType.HISTORY](films).length;
  }

  init = () => {
    const wathedFilmsCount = this.films;
    const prevUserProfileComponent = this.#userProfileComponent;
    this.#userProfileComponent = new ProfileRatingView(wathedFilmsCount);
    if (!prevUserProfileComponent) {
      render(this.#userProfileComponent, this.#userProfileContainer);
      return;
    }
    if (this.#userProfileContainer.contains(prevUserProfileComponent.element)) {
      replace(this.#userProfileComponent, prevUserProfileComponent);
    }
    remove(prevUserProfileComponent);
  };

  destroy = () => remove(this.#userProfileComponent);

  #handleFilmsModelChange = () => this.init();
}
