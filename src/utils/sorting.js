const sortingByRating = (arr) => arr.sort((a, b) => b.rating - a.rating );
const sortingByDate = (arr) => arr.sort((a, b) => new Date(b.release) - new Date(a.release));

export {sortingByRating, sortingByDate};
