var Inputs = function () {
  // private:
  const
  _specialKeys = {
      '\uE000': 'Escape',        // NULL
      '\uE001': 'Cancel',        // Cancel
      '\uE002': 'F1',            // Help
      '\uE003': 'Backspace',     // Backspace
      '\uE004': 'Tab',           // Tab
      '\uE005': 'Clear',         // Clear
      '\uE006': "\n",
      '\uE007': 'Enter',
      '\uE008': 'Shift',         // Shift
      '\uE009': 'Control',       // Control
      '\uE00A': 'Alt',           // Alt
      '\uE00B': 'Pause',         // Pause
      '\uE00C': 'Escape',        // Escape
      '\uE00D': 'Space',         // Space
      '\uE00E': 'PageUp',        // PageUp
      '\uE00F': 'PageDown',      // PageDown
      '\uE010': 'End',           // End
      '\uE011': 'Home',          // Home
      '\uE012': 'Left',          // Left arrow
      '\uE013': 'Up',            // Up arrow
      '\uE014': 'Right',         // Right arrow
      '\uE015': 'Down',          // Down arrow
      '\uE016': 'Insert',        // Insert
      '\uE017': 'Delete',        // Delete
      '\uE018': ';',     // Semicolon
      '\uE019': '=',     // Equals
      '\uE01A': '0',     // Numpad 0
      '\uE01B': '1',     // Numpad 1
      '\uE01C': '2',     // Numpad 2
      '\uE01D': '3',     // Numpad 3
      '\uE01E': '4',     // Numpad 4
      '\uE01F': '5',     // Numpad 5
      '\uE020': '6',     // Numpad 6
      '\uE021': '7',     // Numpad 7
      '\uE022': '8',     // Numpad 8
      '\uE023': '9',     // Numpad 9
      '\uE024': '*',     // Multiply
      '\uE025': '+',     // Add
      '\uE026': ',',     // Separator
      '\uE027': '-',     // Subtract
      '\uE028': '.',     // Decimal
      '\uE029': '/',      // Divide
      '\uE031': 'F1',            // F1
      '\uE032': 'F2',            // F2
      '\uE033': 'F3',            // F3
      '\uE034': 'F4',            // F4
      '\uE035': 'F5',            // F5
      '\uE036': 'F6',            // F6
      '\uE037': 'F7',            // F7
      '\uE038': 'F8',            // F8
      '\uE039': 'F9',            // F9
      '\uE03A': 'F10',           // F10
      '\uE03B': 'F11',           // F11
      '\uE03C': 'F12',           // F12
      '\uE03D': 'Meta'           // Command/Meta
  },

  _implicitShiftKeys = {
      'A': 'a',
      'B': 'b',
      'C': 'c',
      'D': 'd',
      'E': 'e',
      'F': 'f',
      'G': 'g',
      'H': 'h',
      'I': 'i',
      'J': 'j',
      'K': 'k',
      'L': 'l',
      'M': 'm',
      'N': 'n',
      'O': 'o',
      'P': 'p',
      'Q': 'q',
      'R': 'r',
      'S': 's',
      'T': 't',
      'U': 'u',
      'V': 'v',
      'W': 'w',
      'X': 'x',
      'Y': 'y',
      'Z': 'z',
      '!': '1',
      '@': '2',
      '#': '3',
      '$': '4',
      '%': '5',
      '^': '6',
      '&': '7',
      '*': '8',
      '(': '9',
      ')': '0',
      '_': '-',
      '+': '=',
      '{': '[',
      '}': ']',
      '|': '\\',
      ':': ';',
      '<': ',',
      '>': '.',
      '?': '/',
      '~': '`',
      '"': "'"
  },

  _shiftKeys = {
      "a": "A",
      "b": "B",
      "c": "C",
      "d": "D",
      "e": "E",
      "f": "F",
      "g": "G",
      "h": "H",
      "i": "I",
      "j": "J",
      "k": "K",
      "l": "L",
      "m": "M",
      "n": "N",
      "o": "O",
      "p": "P",
      "q": "Q",
      "r": "R",
      "s": "S",
      "t": "T",
      "u": "U",
      "v": "V",
      "w": "W",
      "x": "X",
      "y": "Y",
      "z": "Z",
      "1": "!",
      "2": "@",
      "3": "#",
      "4": "$",
      "5": "%",
      "6": "^",
      "7": "&",
      "8": "*",
      "9": "(",
      "0": ")",
      "-": "_",
      "=": "+",
      "[": "{",
      "]": "}",
      "\\": "|",
      ";": ":",
      ",": "<",
      ".": ">",
      "/": "?",
      "`": "~",
      "'": "\""
  },

  _modifierKeyValues = {
      SHIFT: 0x02000000,   // A Shift key on the keyboard is pressed.
      CONTROL: 0x04000000, // A Ctrl key on the keyboard is pressed.
      ALT: 0x08000000,     // An Alt key on the keyboard is pressed.
      META: 0x10000000,    // A Meta key on the keyboard is pressed.
      NUMPAD: 0x20000000   // Keypad key.
  },
  _modifierKeyChars = {
    SHIFT: '\uE008',
    CONTROL: '\uE009',
    ALT: '\uE00A',
    META: '\uE03D',
    ESCAPE: '\uE000'
  };

  var
  _mousePos = { x: 0, y: 0 },
  _keyboardState = {},
  _currentModifierKeys = 0;

  function _isModifierKey(key) {
      return key === '\uE008' || // Shift
             key === '\uE009' || // Control
             key === '\uE00A' || // Alt
             key === '\uE03D'; // Meta
  }

  function _updateModifierKeys(modifierKeyValue, on) {
      if (on) {
          _currentModifierKeys = _currentModifierKeys | modifierKeyValue;
      } else {
          _currentModifierKeys = _currentModifierKeys & ~modifierKeyValue;
      }
  }

  function _normalizeSpecialChars(key) {
      switch(key) {
        case '\b':
          return '\uE003';  //< Backspace
        case '\t':
          return '\uE004';  // Tab
        case '\n':
          return '\uE007';  // Enter
        default:
          return key;
      }
    }
  }

  function _isModifierKeyPressed(key) {
      return _currentModifierKeys &
             _modifierKeyValues[_specialKeys[key].toUpperCase()];
  }


  function Inputs(window) {
    this._window = window;
    this._keys = window.event.keys;
  }

  (function prototype(inputs) {

    inputs.sendKeys = function (keys) {
      keys = keys.join(''); // for any array value
      keys = keys.replace('\r', '\n'); // \r no has effect
      keys = keys.split(''); // array now
      var actualKey,  key;
      for (var i = 0, len = keys.length; i < ; i++) {
        key       = _normalizeSpecialChars(keys[i]);
        actualKey = this._translateKey(key);
        if (key === _modifierKeyChars.ESCAPE) {
          console.log('CLEAR MODIFY');
        } else if (_isModifierKey(key)) {
          if (_isModifierKeyPressed(key)) {
              this._keyUp(actualKey);
          } else {
              this._keyDown(actualKey);
          }
        } else if (_implicitShiftKeys.hasOwnProperty(actualKey)) {
          this._window.sendEvent('keydown', _translateKey(_modifierKeyChars.SHIFT));
          this._pressKey(actualKey);
          this._window.sendEvent('keyup', _translateKey(_modifierKeyChars.SHIFT));
        } else {
            if ((_currentModifierKeys & _modifierKeyValues.SHIFT) && _shiftKeys.hasOwnProperty(actualKey)) {
                _pressKey(session, _shiftKeys[actualKey]);
            } else {
                _pressKey(session, actualKey);
            }
        }
      }
    };

    inputs._keyUp = function (key) {
        var KEY = key.toUpperCase();
        if (_modifierKeyValues.hasOwnProperty(KEY)) {
          _updateModifierKeys(_modifierKeyValues[KEY], false);
        }
        this._keyEvent('keyup', key);
    };

    inputs._keyDown = function(key) {
        this._keyEvent("keydown", key);
        var KEY = key.toUpperCase();
        if (_modifierKeyValues.hasOwnProperty(KEY)) {
          _updateModifierKeys(_modifierKeyValues[KEY], true);
        }
    };

    inputs._keyPress = function(key) {
      this._keyEvent('keypress', key);
    };

    inputs._keyEvent = function (eventType, keyCode) {
        this._window.sendEvent(eventType, keyCode, null, null, _currentModifierKeys);
    }

    inputs._translateKey = function (key) {
        var actualKey = key;
        if (_specialKeys.hasOwnProperty(key)) {
            actualKey = _specialKeys[key];
            if (this._keys.hasOwnProperty(actualKey)) {
                actualKey = this._keys[actualKey];
            }
        }
        return actualKey;

    };

  })(Inputs.prototype);


  return Inputs;

}();

module.exports = Inputs;