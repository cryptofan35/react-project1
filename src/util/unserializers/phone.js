export default value => {
  if (value === '0') return '';
  return (value && value.length) ? value.split('+').join('') : value;
}
