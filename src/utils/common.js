const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const counter = () => {
  let count = 0;
  return () => count++;
};

const counterId = counter();

export {getRandomInteger, counterId};
