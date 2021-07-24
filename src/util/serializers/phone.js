// export default value => (value.indexOf('+') === 0) ? value.slice(1) : value;
export default value => value.split('+').join('');
