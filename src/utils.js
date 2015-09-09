/**
 * Creates an array of unique values, in order,
 * from all of the provided arrays.
 * @param {Array=} dst Destination array.
 * @param {...Array=} src Source arrays.
 * @returns {Array} Destination array.
 */
function union(dst, src) {
  dst = angular.isArray(arguments[0]) && arguments[0] || [];
  src = Array.prototype.slice.call(arguments, 1);

  for (var i = 0, srcLength = src.length, arr; i < srcLength; i++) {
    arr = src[i];
    if (!angular.isArray(arr)) continue;
    for (var j = 0, arrLength = arr.length, val; j < arrLength; j++) {
      val = arr[j];
      if (dst.indexOf(val) == -1) dst.push(val);
    }
  }

  return dst;
}

module.exports.union = union;
