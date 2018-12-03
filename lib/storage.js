"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  save: function save(key, value, expirationSec) {
    if (typeof Storage === "undefined") {
      return false;
    }
    var expirationMS = expirationSec * 1000;
    var record = { value: value, timestamp: new Date().getTime() + expirationMS };
    localStorage.setItem(key, JSON.stringify(record));

    return value;
  },
  load: function load(key) {
    if (typeof Storage === "undefined") {
      return false;
    }
    try {
      var record = JSON.parse(localStorage.getItem(key));
      if (!record) {
        return false;
      }
      return new Date().getTime() < record.timestamp && record.value;
    } catch (e) {
      return false;
    }
  },
  remove: function remove(key) {
    if (typeof Storage === "undefined") {
      return false;
    }
    localStorage.removeItem(key);
  },
  update: function update(key, value) {
    if (typeof Storage === "undefined") {
      return false;
    }
    try {
      var record = JSON.parse(localStorage.getItem(key));
      if (!record) {
        return false;
      }
      var updatedRecord = { value: value, timestamp: record.timestamp };
      localStorage.setItem(key, JSON.stringify(updatedRecord));
      return updatedRecord;
    } catch (e) {
      return false;
    }
  }
};