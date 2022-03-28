(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["dictionary-store"] = {}));
})(this, (function (exports) { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // Unique ID creation requires a high quality random # generator. In the browser we therefore
  // require the crypto API and do not support built-in fallback to lower quality random number
  // generators (like Math.random()).
  var getRandomValues;
  var rnds8 = new Uint8Array(16);
  function rng() {
    // lazy load so that environments that need to polyfill have a chance to do so
    if (!getRandomValues) {
      // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
      // find the complete implementation of crypto (msCrypto) on IE11.
      getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

      if (!getRandomValues) {
        throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
      }
    }

    return getRandomValues(rnds8);
  }

  var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

  function validate(uuid) {
    return typeof uuid === 'string' && REGEX.test(uuid);
  }

  /**
   * Convert array of 16 byte values to UUID string format of the form:
   * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
   */

  var byteToHex = [];

  for (var i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).substr(1));
  }

  function stringify(arr) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
    // of the following:
    // - One or more input array values don't map to a hex octet (leading to
    // "undefined" in the uuid)
    // - Invalid input values for the RFC `version` or `variant` fields

    if (!validate(uuid)) {
      throw TypeError('Stringified UUID is invalid');
    }

    return uuid;
  }

  function v4(options, buf, offset) {
    options = options || {};
    var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

    if (buf) {
      offset = offset || 0;

      for (var i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i];
      }

      return buf;
    }

    return stringify(rnds);
  }

  var setItem = function setItem(key, value) {
    var stringify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    try {
      localStorage.setItem("".concat(key), stringify ? JSON.stringify(value) : value);
    } catch (e) {
      console.warn("setItem Error: ".concat(JSON.stringify(e)));
    }

    return true;
  };
  var getItem = function getItem(key, defaultValue) {
    var parse = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var value;

    try {
      value = localStorage.getItem(key);

      if (value) {
        value = parse ? JSON.parse(value) : value;
      }
    } catch (e) {
      console.warn("getItem Error: ".concat(JSON.stringify(e)));
    }

    return value || defaultValue;
  };
  var isEqualStr = function isEqualStr(str, toCompare) {
    return str.toLowerCase() === toCompare.toLowerCase();
  };

  var StorePrefix = "dictionary-store";

  var StoreKey$1 = "".concat(StorePrefix, "--languages");
  var Languages = {
    add: function () {
      var _add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
        var userId, languages, label;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                userId = data.userId;

                if (userId) {
                  _context.next = 3;
                  break;
                }

                throw Error("Error: prop userId is missing in ".concat(JSON.stringify(data), "."));

              case 3:
                languages = getLanguages();
                label = data.label;

                if (getLanguages(userId).find(function (l) {
                  return isEqualStr(label, l.label);
                })) {
                  console.warn("Warning: language with label \"".concat(label, "\" already exists."));
                } else {
                  setLanguages(orderLanguages([].concat(_toConsumableArray(languages), [_objectSpread2(_objectSpread2({}, data), {}, {
                    id: v4(),
                    userId: userId
                  })])));
                }

                return _context.abrupt("return", getLanguages(userId));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function add(_x) {
        return _add.apply(this, arguments);
      }

      return add;
    }(),
    get: function () {
      var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref) {
        var userId, id;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                userId = _ref.userId, id = _ref.id;
                return _context2.abrupt("return", getLanguages(userId).find(function (l) {
                  return l.id === id;
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function get(_x2) {
        return _get.apply(this, arguments);
      }

      return get;
    }(),
    getAll: function () {
      var _getAll = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(userId) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", getLanguages(userId));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getAll(_x3) {
        return _getAll.apply(this, arguments);
      }

      return getAll;
    }(),
    delete: function () {
      var _delete2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref2) {
        var userId, id, languages, currentLanguage;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                userId = _ref2.userId, id = _ref2.id;
                languages = getLanguages();
                currentLanguage = languages.find(function (l) {
                  return l.id === id && l.userId === userId;
                });

                if (currentLanguage) {
                  setLanguages(languages.filter(function (l) {
                    return l.id !== id;
                  }));
                }

                return _context4.abrupt("return", getLanguages(userId));

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function _delete(_x4) {
        return _delete2.apply(this, arguments);
      }

      return _delete;
    }()
  };

  var getLanguages = function getLanguages(userId) {
    var languages = getItem(StoreKey$1, [], true);

    if (userId) {
      return languages.filter(function (l) {
        return l.userId === userId;
      });
    }

    return languages;
  };

  var setLanguages = function setLanguages(languages) {
    setItem(StoreKey$1, languages, true);
    return _toConsumableArray(languages);
  };

  var orderLanguages = function orderLanguages(languages) {
    return _toConsumableArray(languages).sort(function (a, b) {
      if (a.label > b.label) {
        return 1;
      }

      return -1;
    });
  };

  var StoreKey = "".concat(StorePrefix, "--users");
  var Users = {
    register: function () {
      var _register = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
        var toRegister, email, users, user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                toRegister = _objectSpread2(_objectSpread2({}, data), {}, {
                  id: v4(),
                  connexions: 0
                });
                email = toRegister.email;
                users = getAllUsers();
                user = getByEmail(email);

                if (user) {
                  console.warn("User already registered with email \"".concat(email, "\"."));
                  user = _objectSpread2(_objectSpread2({}, user), {}, {
                    connexions: ++user.connexions
                  });
                  users = users.map(function (u) {
                    if (u.id === user.id) {
                      return _objectSpread2({}, user);
                    }

                    return u;
                  });
                } else {
                  users = [].concat(_toConsumableArray(users), [toRegister]);
                }

                setItem(StoreKey, users, true);
                return _context.abrupt("return", user || toRegister);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function register(_x) {
        return _register.apply(this, arguments);
      }

      return register;
    }(),
    get: function () {
      var _get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref) {
        var id, email;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = _ref.id, email = _ref.email;

                if (!email) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return", getByEmail(email));

              case 3:
                return _context2.abrupt("return", getAllUsers().find(function (u) {
                  return u.id === id;
                }));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function get(_x2) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  };

  var getAllUsers = function getAllUsers() {
    return getItem(StoreKey, [], true);
  };

  var getByEmail = function getByEmail(email) {
    var u = getAllUsers().find(function (u) {
      return u.email === email;
    });
    return u || null;
  };

  var DictionaryStore = {
    languages: Languages,
    users: Users
  };

  exports.DictionaryStore = DictionaryStore;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
