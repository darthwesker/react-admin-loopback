'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storage = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _authProvider = require('./authProvider');

Object.keys(_authProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _authProvider[key];
    }
  });
});

var _storage = require('./storage');

Object.defineProperty(exports, 'storage', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_storage).default;
  }
});

var _queryString = require('query-string');

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _reactAdmin = require('react-admin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (apiUrl) {
  var httpClient = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _fetch2.default;

  /**
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The data request params, depending on the type
   * @returns {Object} { url, options } The HTTP request parameters
   */
  var convertDataRequestToHTTP = function convertDataRequestToHTTP(type, resource, params) {
    var url = '';
    var options = {};
    switch (type) {
      case _reactAdmin.GET_LIST:
        {
          var _params$pagination = params.pagination,
              page = _params$pagination.page,
              perPage = _params$pagination.perPage;
          var _params$sort = params.sort,
              field = _params$sort.field,
              order = _params$sort.order;

          var include = params.include;
          var query = {};
          query['where'] = _extends({}, params.filter);
          if (field) query['order'] = [field + ' ' + order];
          if (perPage > 0) {
            query['limit'] = perPage;
            if (page >= 0) query['offset'] = (page - 1) * perPage;
          }
          if (include) query['include'] = include;
          url = apiUrl + '/' + resource + '?' + (0, _queryString.stringify)({ filter: JSON.stringify(query) });
          break;
        }
      case _reactAdmin.GET_ONE:
        url = apiUrl + '/' + resource + '/' + params.id;
        break;
      case _reactAdmin.GET_MANY:
        {
          var listId = params.ids.map(function (id) {
            return { 'id': id };
          });
          var _query = {
            'where': { 'or': listId }
          };
          url = apiUrl + '/' + resource + '?' + (0, _queryString.stringify)({ filter: JSON.stringify(_query) });
          break;
        }
      case _reactAdmin.GET_MANY_REFERENCE:
        {
          var _params$pagination2 = params.pagination,
              _page = _params$pagination2.page,
              _perPage = _params$pagination2.perPage;
          var _params$sort2 = params.sort,
              _field = _params$sort2.field,
              _order = _params$sort2.order;

          var _include = params.include;
          var _query2 = {};
          _query2['where'] = _extends({}, params.filter);
          _query2['where'][params.target] = params.id;
          if (_field) _query2['order'] = [_field + ' ' + _order];
          if (_perPage > 0) {
            _query2['limit'] = _perPage;
            if (_page >= 0) _query2['skip'] = (_page - 1) * _perPage;
          }
          if (_include) _query2['include'] = _include;
          url = apiUrl + '/' + resource + '?' + (0, _queryString.stringify)({ filter: JSON.stringify(_query2) });
          break;
        }
      case _reactAdmin.UPDATE:
        url = apiUrl + '/' + resource + '/' + params.id;
        options.method = 'PATCH';
        options.body = JSON.stringify(params.data);
        break;
      case _reactAdmin.CREATE:
        url = apiUrl + '/' + resource;
        options.method = 'POST';
        options.body = JSON.stringify(params.data);
        break;
      case _reactAdmin.DELETE:
        url = apiUrl + '/' + resource + '/' + params.id;
        options.method = 'DELETE';
        break;
      default:
        throw new Error('Unsupported fetch action type ' + type);
    }
    return { url: url, options: options };
  };

  /**
   * @param {Object} response HTTP response from fetch()
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The data request params, depending on the type
   * @returns {Object} Data response
   */
  var convertHTTPResponse = function convertHTTPResponse(response, type, resource, params) {
    var headers = response.headers,
        json = response.json;

    switch (type) {
      case _reactAdmin.GET_LIST:
      case _reactAdmin.GET_MANY_REFERENCE:
        if (!headers.has('content-range')) {
          throw new Error('The Content-Range header is missing in the HTTP Response. The simple REST data provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare Content-Range in the Access-Control-Expose-Headers header?');
        }
        return {
          data: json,
          total: parseInt(headers.get('content-range').split('/').pop(), 10)
        };
      case _reactAdmin.CREATE:
        return { data: _extends({}, params.data, { id: json.id }) };
      case _reactAdmin.DELETE:
        return { data: _extends({}, json, { id: params.id }) };
      default:
        return { data: json };
    }
  };

  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resource Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a data response
   */
  return function (type, resource, params) {
    // simple-rest doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
    if (type === _reactAdmin.UPDATE_MANY) {
      return Promise.all(params.ids.map(function (id) {
        return httpClient(apiUrl + '/' + resource + '/' + id, {
          method: 'PATCH',
          body: JSON.stringify(params.data)
        });
      })).then(function (responses) {
        return {
          data: responses.map(function (response) {
            return response.json;
          })
        };
      });
    }
    // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    if (type === _reactAdmin.DELETE_MANY) {
      return Promise.all(params.ids.map(function (id) {
        return httpClient(apiUrl + '/' + resource + '/' + id, {
          method: 'DELETE'
        });
      })).then(function (responses) {
        return {
          data: responses.map(function (response) {
            return response.json;
          })
        };
      });
    }

    var _convertDataRequestTo = convertDataRequestToHTTP(type, resource, params),
        url = _convertDataRequestTo.url,
        options = _convertDataRequestTo.options;

    return httpClient(url, options).then(function (response) {
      return convertHTTPResponse(response, type, resource, params);
    });
  };
};