thinMonitor.factory('shortcutMethods', ['shortcutService', function (shortcutService) {

  var _matchKeyPattern = function (e, keyMap, altmodifiers) {
    var rv, key, map, isValid;
    var currentcontext = shortcutService.getCurrentContext();

    for (var i = 0; i < keyMap.length; i++) {
      isValid = true;
      map = keyMap[i];
      for (key in map.modifiers) {
        if (map.modifiers.hasOwnProperty(key)) {
          altmodifiers[key] = map.modifiers[key];
        }
      }

      for (key in altmodifiers) {
        if (!Object.prototype.hasOwnProperty.call(altmodifiers, key)) {
          continue;
        }

        if (!!e[key] !== altmodifiers[key]) {
          isValid = false;
        }
      }

      if (isValid) {
        if (!map.contextName ||
          // Possibly restrict the shortcut by context:
          (currentcontext && currentcontext[0] === map.contextName)
        ) {
          rv = map;
          break;
        }
      }
    }

    return rv;
  };

  var registerShortcut = function (options, callback) {
    var objType = Object.prototype.toString;

    if (objType.call(options) !== '[object Object]') {
      throw new Error('Options expected as literal object');
    }

    if (!options.hasOwnProperty('key')) {
      throw new Error('"key" - required parameter');
    }

    if (callback) {
      options.callback = callback;
    }

    if (objType.call(options.callback) !== '[object Function]') {
      callback = function () {
      };
    }

    if (!this._bindings.hasOwnProperty(options.key)) {
      this._bindings[options.key] = [];
    }

    if (!options.eventMethods) {
      options.eventMethods = {};
    }

    if (!options.eventMethods.preventDefault) {
      options.eventMethods.preventDefault = true;
    }

    options.modifiers = options.modifiers || {};
    options.id = options.key + Object.keys(options.modifiers).join(',');

    // No dupes: new replaces old:
    if (this._existingBindings.hasOwnProperty(options.id)) {
      this._bindings[options.key] = this._bindings[options.key].filter(function (it) {
        return it.id !== options.id;
      });
    }

    this._bindings[options.key].push(options);
    this._existingBindings[options.id] = 1;

    return this;
  };

  var getBinding = function (e) {
    var keyMap = this._findKeyMap(e);

    if (!keyMap) {
      return false;
    }

    var handler = _matchKeyPattern(e, keyMap, this._getAltmodifiers());

    if (handler) {
      if (handler.hasOwnProperty('eventMethods') && handler.eventMethods.hasOwnProperty('preventDefault')) {
        if (handler.eventMethods.preventDefault === true) {
          e.preventDefault();
        }
      }
      handler.callback(e, this._callbackRender(e), handler);
    }
  };

  return {
    _bindings: null,
    _existingBindings: null,
    registerShortcut: registerShortcut,
    getBinding: getBinding,
    _findKeyMap: function (e) {
      if (this._bindings.hasOwnProperty(e.which)) {
        return this._bindings[e.which];
      }

      return false;
    },
    _getAltmodifiers: function () {
      return {};
    },
    _callbackRender: function () {
      return {};
    }
  };
}]);
