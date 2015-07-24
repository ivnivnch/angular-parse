/**
 * Parse Mock.
 * https://github.com/dziamid/parse-mock
 * */

var Parse = require('parse');
var _ = require('lodash');
var sinon = global.sinon || require('sinon');

if (typeof Parse.Parse != 'undefined') {
  Parse = Parse.Parse;
}

var lastObjectId = 1,
  registeredStubs = [];

var stubMethods = createStubMethods({
  stubRequest: [Parse, '_request'],
  stubCollectionFetch: [Parse.Collection.prototype, 'fetch'],
  stubConfigGet: [Parse.Config, 'get'],
  stubQueryFind: [Parse.Query.prototype, 'find'],
  stubQueryFirst: [Parse.Query.prototype, 'first'],
  stubQueryGet: [Parse.Query.prototype, 'get'],
  stubQueryCount: [Parse.Query.prototype, 'count'],
  stubObjectSave: [Parse.Object.prototype, 'save'],
  stubObjectFetch: [Parse.Object.prototype, 'fetch'],
  stubObjectDestroy: [Parse.Object.prototype, 'destroy'],
  stubFacebookUtilsLink: [Parse.FacebookUtils, 'link']
});

module.exports = _.extend(stubMethods, {
  clearStubs: clearStubs
});

function createStubMethods(stubMethods) {
  Object.keys(stubMethods).forEach(function (key) {
    var object = stubMethods[key][0],
      methodName = stubMethods[key][1];

    stubMethods[key] = function (cb) {
      return registerStub(sinon.stub(object, methodName, function (options) {
        var promise = new Parse.Promise()._thenRunCallbacks(options),
          data = cb.call(this, queryToJSON(this));

        if (data) {
          data = addDefaultFields(data);
        }

        promise.resolve(data);

        return promise;
      }));
    };
  });

  return stubMethods;
}

function registerStub(stub) {
  registeredStubs.push(stub);

  return stub;
}

function clearStubs() {
  registeredStubs.forEach(function (stub) {
    stub.restore();
  })

}

function queryToJSON(query) {
  return _.extend(query.toJSON(), {
    className: query.className
  });
}

/**
 * Extends object tree with server-genereated fields
 *
 * @param data Array|Parse.Object
 * @returns {*}
 */

function addDefaultFields(data) {
  if (Array.isArray(data)) {
    return data.map(function (d) {
      return addDefaultFields(d);
    });
  }

  //todo: walk model recursively

  if (data && typeof data == 'object') {
    if (data.id === undefined || data.id === null) data.id = lastObjectId++;
    if (data.createdAt === undefined || data.createdAt === null) data.createdAt = new Date();
    if (data.updatedAt === undefined || data.updatedAt === null) data.updatedAt = new Date();
  }

  return data;
}
