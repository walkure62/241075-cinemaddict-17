const sortingByRating = (arr) => arr.slice().sort((a, b) => b.rating - a.rating );
const sortingByDate = (arr) => arr.slice().sort((a, b) => new Date(b.release) - new Date(a.release));

export {sortingByRating, sortingByDate};
