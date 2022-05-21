const sortingByRating = (arr) => arr.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
const sortingByDate = (arr) => arr.sort((a, b) => new Date(b.filmInfo.release.date) - new Date(a.filmInfo.release.date));
const sortingMostCommented = (arr) => arr.slice().sort((a, b) => b.comments.length - a.comments.length);

export {sortingByRating, sortingByDate, sortingMostCommented};
