export default value => {
  if (value.indexOf('https://') !== 0 && value.indexOf('http://') !== 0) {
    value = 'http://' + value;
  }
  if (value.charAt(value.length - 1) === '/') {
    value = value.substring(0, value.length - 1);
  }
  return value;
}