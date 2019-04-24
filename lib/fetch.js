'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

var _reactAdmin = require('react-admin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchJson = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var requestHeaders, response, text, o, status, statusText, headers, body, json;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            requestHeaders = options.headers || new Headers({ Accept: 'application/json' });

            if (!requestHeaders.has('Content-Type') && !(options && options.body && options.body instanceof FormData)) {
              requestHeaders.set('Content-Type', 'application/json');
            }
            if (options.user && options.user.authenticated && options.user.token) {
              requestHeaders.set('Authorization', options.user.token);
            }
            _context.next = 5;
            return fetch(url, _extends({}, options, { headers: requestHeaders }));

          case 5:
            response = _context.sent;
            _context.next = 8;
            return response.text();

          case 8:
            text = _context.sent;
            o = {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              body: text
            };
            status = o.status, statusText = o.statusText, headers = o.headers, body = o.body;
            json = void 0;

            try {
              json = JSON.parse(body);
            } catch (e) {
              // not json, no big deal
            }

            if (!(status < 200 || status >= 300)) {
              _context.next = 15;
              break;
            }

            return _context.abrupt('return', Promise.reject(new _reactAdmin.HttpError(json && json.error && json.error.message || statusText, status, json)));

          case 15:
            return _context.abrupt('return', Promise.resolve({ status: status, headers: headers, body: body, json: json }));

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function fetchJson(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = function (url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options.user = {
    authenticated: true,
    token: _storage2.default.load('lbtoken').id
  };
  return fetchJson(url, options);
};