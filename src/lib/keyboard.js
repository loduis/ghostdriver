function Keyboard(window) {
  this._event = window.event;
  this._keys = window.event.key;
}

(function (keyboard) {
  // private:

  var
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

  //================== PUBLIC API ==================//

  keyboard.modifiers = 0;

  keyboard.sendKeys = function (keys, clearModifiers) {
    if (clearModifiers) {
      this._clearModifiers();
    }
    if (keys instanceof Array) {
      keys = keys.join(''); // for any array value
    }
    keys = keys.replace('\r', '\n'); // \r no has effect
    keys = keys.split(''); // array now
    var actualKey,  key, i;
    for (i = 0, len = keys.length; i < len; i++) {
      key       = _normalizeSpecialChars(keys[i]);
      actualKey = this._translateKey(key);
      if (key === _modifierKeyChars.ESCAPE) {
        this._clearModifiers();
      } else if (this._isModifier(key)) {
        if (this._isModifierPressed(key)) {
            this._keyUp(key);
        } else {
            this._keyDown(key);
        }
      } else if (_implicitShiftKeys.hasOwnProperty(actualKey)) {
        this._event.send(
          'keydown',
          this._translateKey(_modifierKeyChars.SHIFT)
        );
        this._keyPress(actualKey);
        this._event.send(
          'keyup',
          this._translateKey(_modifierKeyChars.SHIFT)
        );
      } else if (this._isModifierPressed(_modifierKeyChars.SHIFT) &&
                                        _shiftKeys.hasOwnProperty(actualKey)) {
        this._keyPress(_shiftKeys[actualKey]);
      } else {
          this._keyPress(actualKey);
      }
    }
    if (clearModifiers) {
      this._clearModifiers();
    }
  };

  keyboard._clearModifiers = function () {
    if(this.modifiers && _modifierKeyValues.SHIFT) {
      this._keyUp(_modifierKeyChars.SHIFT);
    }
    if (this.modifiers & _modifierKeyValues.CONTROL) {
        this._keyUp(_modifierKeyChars.CONTROL);
    }
    if (this.modifiers & _modifierKeyValues.ALT) {
      this._keyUp(_modifierKeyChars.ALT);
    }
  };


  //================== PRIVATE API ==================//

  keyboard._updateModifiers = function (key, on) {
    key = _specialKeys[key];
    var KEY = key.toUpperCase();
    if (_modifierKeyValues.hasOwnProperty(KEY) &&
      (KEY !== 'META' && KEY !== 'NUMPAD')) {
      var value = _modifierKeyValues[KEY];
      if (on) {
        this.modifiers = this.modifiers | value;
      } else {
        this.modifiers = this.modifiers & ~value;
      }
    }
  };

  keyboard._isModifierPressed = function (key) {
    var modifier = _specialKeys[key].toUpperCase();
    return this.modifiers & _modifierKeyValues[modifier];
  };

  keyboard._isModifier = function (key) {
      return key === _modifierKeyChars.SHIFT || // Shift
             key === _modifierKeyChars.CONTROL || // Control
             key === _modifierKeyChars.ALT || // Alt
             key === _modifierKeyChars.META; // Meta
  };

  keyboard._translateKey = function (key) {
      var actualKey = key;
      if (_specialKeys.hasOwnProperty(key)) {
          actualKey = _specialKeys[key];
          if (this._keys.hasOwnProperty(actualKey)) {
              actualKey = this._keys[actualKey];
          }
      }
      return actualKey;
  };

  keyboard._keyDown = function(key) {
      this._keyEvent('keydown', this._translateKey(key));
      this._updateModifiers(key, true);
  };

  keyboard._keyUp = function (key) {
    this._updateModifiers(key, false);
    this._keyEvent('keyup', this._translateKey(key));
  };

  keyboard._keyPress = function(key) {
    this._keyEvent('keypress', key);
  };

  keyboard._keyEvent = function (eventType, keyCode) {
    this._event.send(eventType, keyCode, null, null, this.modifiers);
  };

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


})(Keyboard.prototype);

module.exports = Keyboard;