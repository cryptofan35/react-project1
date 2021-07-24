export const isDecimal = (val = '') => {
  if (val.length > 1 && val[0] === '0' && val[1] !== '.') {
    return false;
  }
  
  if (val.length && val[0] === '-') {
    return false;
  }
  
  return !val || (!isNaN(Number(val)));
};

export const isIntegerString = (val = '') => {
  const parsedToNumber = Number(val);

  return (Number.isInteger(parsedToNumber) && val[val.length - 1] !== '.' && parsedToNumber >= 0) || !val;
}

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
