'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactAdmin = require('react-admin');

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    options.user = {
        authenticated: true,
        token: _storage2.default.load('lbtoken').id
    };
    return _reactAdmin.fetchUtils.fetchJson(url, options);
};