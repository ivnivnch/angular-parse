var module = angular.mock.module;
var inject = angular.mock.inject;
var utils = require('../src/utils.js');

describe('utils', function () {
  describe('union', function () {
    it('should union', function () {
      var dst = [1, 2];
      var src1 = [2, 3];
      var src2 = [3, 4];

      var result = utils.union(dst, src1, src2);

      expect(result).toEqual([1, 2, 3, 4]);
      expect(dst).toEqual([1, 2, 3, 4]);
    });
  });
});
