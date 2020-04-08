export default (size, upperAlphaOnly = false) => {
  const numeric = "0123456789";
  const lowerAlpha = "abcdefghijklmnopqrstuvwxyz";
  const upperAlpha = lowerAlpha.toUpperCase();

  const source = upperAlphaOnly
    ? upperAlpha
    : numeric + lowerAlpha + upperAlpha;

  let randomlyGeneratedString = "";

  while (randomlyGeneratedString.length < size) {
    const randomIndex = Math.floor(Math.random() * (source.length - 1));
    randomlyGeneratedString += source[randomIndex];
  }

  return randomlyGeneratedString;
};
