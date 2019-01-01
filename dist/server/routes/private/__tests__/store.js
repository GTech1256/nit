"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var request = require('supertest');

var authorizedApp = require('authorized_app');

describe("Test if api-private/store.js", function () {
  it("should joi reject",
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", authorizedApp.post('/api/private/store/planets/id/00007_0001p4_000001-000wps').send({
              lou: 1 // lou should be string

            }).expect(400));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  it("should return an error due to a bad planet ID",
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", authorizedApp.post('/api/private/store/planets/id/INVALID').send({
              lou: '0'
            }).expect(400));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
  it("should return 403 due to planet owner changed",
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", authorizedApp.post('/api/private/store/planets/id/00007_0001p4_000001-000wps').send({
              lou: '55'
            }).expect(403));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));
  it("should buy planet",
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", authorizedApp.post('/api/private/store/planets/id/00007_0001p4_000001-000wps').send({
              lou: '0'
            }).expect(200));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
});