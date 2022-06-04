const sortingByRating = (a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating;
const sortingByDate = (a, b) => new Date(b.filmInfo.release.date) - new Date(a.filmInfo.release.date);
const sortingMostCommented = (a, b) => b.comments.length - a.comments.length;

export {sortingByRating, sortingByDate, sortingMostCommented};
