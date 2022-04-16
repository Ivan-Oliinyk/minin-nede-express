module.exports = function (a, b) {
  if (a !== null && b !== null) {
    return a.toString() === b.toString();
  }

  return false;
};
