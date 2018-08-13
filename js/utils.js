export const getRandomElem = (array) =>  {
  return array[Math.floor(Math.random() * array.length)];
};

export const getRandom = (min, maxNumber) => {
  const random = Math.floor(Math.random() * maxNumber);
  return random < min ? min : random;
}
