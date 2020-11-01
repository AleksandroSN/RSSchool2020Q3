"use strict";

var Keyboard = {
  elements: {
    mainContainer: document.querySelector("main"),
    textArea: document.querySelectorAll(".keyboard-textarea"),
    main: null,
    tempArr: [],
    keysContainer: null,
    keys: [],
    keysCode: ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace", "Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash", "CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter", "ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ArrowUp", "ShiftRight", "ControlLeft", "", "", "", "AltLeft", "Space", "AltRight", "ControlRight", "ArrowLeft", "ArrowDown", "ArrowRight", ""],
    keysEn: ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace", "tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter", "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "arrow-up", "right-shift", "ctrl", "close", "micro", "lang", "alt", "spacebar", "alt", "ctrl", "arrow-left", "arrow-down", "arrow-right", "mute"],
    keysRu: ["ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace", "tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\", "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter", "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "arrow-up", "right-shift", "ctrl", "close", "micro", "lang", "alt", "spacebar", "alt", "ctrl", "arrow-left", "arrow-down", "arrow-right", "mute"]
  },
  eventHandlers: {
    oninput: false,
    onclose: false
  },
  select: {
    center: 0
  },
  properties: {
    value: "",
    del: false,
    capsLock: false,
    shiftKey: false,
    lang: true,
    voice: false,
    mute: true
  },
  cursor: {
    position: 0
  },
  init: function init() {
    var _this = this;

    this.keydown();
    this.keyup(); //Create main elements

    this.elements.main = document.createElement("section");
    this.elements.keysContainer = document.createElement("div"); //Setup main elements

    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
    this.elements.keys.forEach(function (code, index) {
      code.setAttribute("data", _this.elements.keysCode[index]);
    }); //Add to DOM

    this.elements.main.appendChild(this.elements.keysContainer);
    this.elements.mainContainer.appendChild(this.elements.main); //Listeners

    this.elements.textArea.forEach(function (elem) {
      elem.addEventListener("click", function () {
        _this.open(elem.value, function (currentValue) {
          elem.focus();
          elem.value = currentValue;
        });
      });
    });
    this.elements.textArea.forEach(function (elem) {
      elem.addEventListener("blur", function () {
        if (!Keyboard.elements.main.classList.contains("keyboard--hidden")) {
          elem.focus();
        }
      });
    }); //SpeechRecognition

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  },
  _createKeys: function _createKeys() {
    var _this2 = this;

    var fragment = document.createDocumentFragment();

    var createIconHTML = function createIconHTML(icon_name) {
      return "<i class=\"material-icons\">".concat(icon_name, "</i>");
    };

    var keysLayout;
    this.properties.lang ? keysLayout = this.elements.keysEn : keysLayout = this.elements.keysRu;
    keysLayout.forEach(function (key) {
      var keyElement = document.createElement("button");
      var delimeterStr = ["backspace", "\\", "enter", "right-shift"].indexOf(key) !== -1;
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
          keyElement.addEventListener("click", function () {
            _this2.cursor.position = _this2.elements.textArea[0].selectionStart;

            if (_this2.elements.textArea[0].selectionStart === _this2.elements.textArea[0].selectionEnd) {
              _this2.properties.value = _this2.properties.value.substring(0, _this2.cursor.position - 1) + _this2.properties.value.substring(_this2.cursor.position);
              _this2.properties.del = false;
            } else {
              _this2.properties.value = _this2.properties.value.substring(0, _this2.elements.textArea[0].selectionStart) + _this2.properties.value.substring(_this2.elements.textArea[0].selectionEnd);
              _this2.properties.del = true;
            }

            _this2._triggerEvent("oninput");

            if (_this2.cursor.position > 0 && !_this2.properties.del) {
              _this2.elements.textArea[0].selectionStart = _this2.cursor.position - 1;
              _this2.elements.textArea[0].selectionEnd = _this2.cursor.position - 1;
            } else if (_this2.cursor.position > 0 && _this2.properties.del) {
              _this2.elements.textArea[0].selectionStart = _this2.cursor.position;
              _this2.elements.textArea[0].selectionEnd = _this2.cursor.position;
            } else if (_this2.cursor.position === 0 && _this2.properties.del) {
              _this2.elements.textArea[0].selectionStart = 0;
              _this2.elements.textArea[0].selectionEnd = 0;
            }

            _this2.keySound(keyElement);
          });
          break;

        case "tab":
          keyElement.innerHTML = createIconHTML("keyboard_tab");
          keyElement.addEventListener("click", function () {
            _this2.cursor.position = _this2.elements.textArea[0].selectionStart;

            if (_this2.elements.textArea[0].selectionStart === _this2.elements.textArea[0].selectionEnd) {
              _this2.properties.value = _this2.properties.value.substring(0, _this2.cursor.position) + "    " + _this2.properties.value.substring(_this2.cursor.position);
            } else {
              _this2.properties.value = _this2.properties.value.substring(0, _this2.elements.textArea[0].selectionStart) + "    " + _this2.properties.value.substring(_this2.elements.textArea[0].selectionEnd);
            }

            _this2._triggerEvent("oninput");

            _this2.elements.textArea[0].selectionStart = _this2.cursor.position + 4;
            _this2.elements.textArea[0].selectionEnd = _this2.cursor.position + 4;

            _this2.keySound(keyElement);
          });
          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide-l", "keyboard__key--activable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          keyElement.addEventListener("click", function () {
            _this2._toggleCapsLock();

            _this2.keySound(keyElement);

            keyElement.classList.toggle("keyboard__key--active", _this2.properties.capsLock);
          });
          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide-l");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          keyElement.addEventListener("click", function () {
            _this2.properties.value += "\n";

            _this2._triggerEvent("oninput");

            _this2.keySound(keyElement);
          });
          break;

        case "ctrl":
          keyElement.textContent = "Ctrl";
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);
          });
          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide-l", "keyboard__key--activable");
          keyElement.textContent = "Shift";
          keyElement.addEventListener("click", function () {
            _this2._toggleShiftKey();

            _this2.keySound(keyElement);

            keyElement.classList.toggle("keyboard__key--active", _this2.properties.shiftKey);
          });
          break;

        case "right-shift":
          keyElement.classList.add("keyboard__key--wide-l");
          keyElement.textContent = "R-Shift";
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);
          });
          break;

        case "close":
          keyElement.classList.add("keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);

            _this2.close();

            _this2._triggerEvent("onclose");
          });
          break;

        case "micro":
          keyElement.classList.add("keyboard__key--dark", "keyboard__key--activable");
          keyElement.innerHTML = createIconHTML("keyboard_voice");
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);

            keyElement.classList.toggle("keyboard__key--active");

            _this2.voice();
          });
          break;

        case "lang":
          keyElement.textContent = "EN";
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);

            if (_this2.properties.lang) {
              keyElement.textContent = "RU";

              _this2._langKey();
            } else if (!_this2.properties.lang) {
              keyElement.textContent = "EN";

              _this2._langKey();
            }
          });
          break;

        case "alt":
          keyElement.textContent = "Alt";
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);
          });
          break;

        case "spacebar":
          keyElement.classList.add("keyboard__key--wide-xl");
          keyElement.innerHTML = createIconHTML("space_bar");
          keyElement.addEventListener("click", function () {
            _this2.cursor.position = _this2.elements.textArea[0].selectionStart;

            if (_this2.elements.textArea[0].selectionStart === _this2.elements.textArea[0].selectionEnd) {
              _this2.properties.value = _this2.properties.value.substring(0, _this2.cursor.position) + " " + _this2.properties.value.substring(_this2.cursor.position);
            } else {
              _this2.properties.value = _this2.properties.value.substring(0, _this2.elements.textArea[0].selectionStart) + " " + _this2.properties.value.substring(_this2.elements.textArea[0].selectionEnd);
            }

            _this2._triggerEvent("oninput");

            _this2.elements.textArea[0].selectionStart = _this2.cursor.position + 1;
            _this2.elements.textArea[0].selectionEnd = _this2.cursor.position + 1;

            _this2.keySound(keyElement);
          });
          break;

        case "arrow-left":
          keyElement.innerHTML = createIconHTML("keyboard_arrow_left");
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);

            _this2.cursor.position = _this2.elements.textArea[0].selectionStart;

            if (_this2.properties.shift && (_this2.select.center === 0 || _this2.elements.textArea[0].selectionStart === _this2.elements.textArea[0].selectionEnd)) {
              _this2.select.center = _this2.elements.textArea[0].selectionEnd;
            }

            if (!_this2.properties.shift) {
              _this2.elements.textArea[0].selectionStart = _this2.cursor.position - 1;
              _this2.elements.textArea[0].selectionEnd = _this2.cursor.position - 1;
            } else if (_this2.properties.shift && _this2.elements.textArea[0].selectionEnd > _this2.select.center) {
              _this2.elements.textArea[0].selectionEnd -= 1;
            } else if (_this2.properties.shift && _this2.elements.textArea[0].selectionStart < _this2.select.center) {
              if (_this2.elements.textArea[0].selectionStart !== 0) {
                _this2.elements.textArea[0].selectionStart -= 1;
              }
            } else if (_this2.properties.shift && _this2.elements.textArea[0].selectionStart === _this2.elements.textArea[0].selectionEnd) {
              _this2.elements.textArea[0].selectionStart -= 1;
            }
          });
          break;

        case "arrow-up":
          keyElement.innerHTML = createIconHTML("keyboard_arrow_up");
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);
          });
          break;

        case "arrow-down":
          keyElement.innerHTML = createIconHTML("keyboard_arrow_down");
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);
          });
          break;

        case "arrow-right":
          keyElement.innerHTML = createIconHTML("keyboard_arrow_right");
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);

            _this2.cursor.position = _this2.elements.textArea[0].selectionStart;

            if (_this2.properties.shiftKey && (_this2.select.center === 0 || _this2.elements.textArea[0].selectionStart === _this2.elements.textArea[0].selectionEnd)) {
              _this2.select.center = _this2.elements.textArea[0].selectionStart;
            }

            if (!_this2.properties.shiftKey) {
              _this2.elements.textArea[0].selectionStart = _this2.cursor.position + 1;
              _this2.elements.textArea[0].selectionEnd = _this2.cursor.position + 1;
            } else if (_this2.properties.shiftKey && _this2.elements.textArea[0].selectionStart < _this2.select.center) {
              _this2.elements.textArea[0].selectionStart += 1;
            } else if (_this2.properties.shiftKey && _this2.elements.textArea[0].selectionEnd > _this2.select.center) {
              if (_this2.elements.textArea[0].selectionEnd !== _this2.elements.textArea[0].value.length) {
                _this2.elements.textArea[0].selectionEnd += 1;
              }
            } else if (_this2.properties.shiftKey && _this2.elements.textArea[0].selectionEnd === _this2.elements.textArea[0].selectionStart) {
              _this2.elements.textArea[0].selectionEnd += 1;
            }
          });
          break;

        case "mute":
          keyElement.classList.add("keyboard__key--activable", "keyboard__key--active");
          keyElement.innerHTML = createIconHTML("volume_mute");
          keyElement.addEventListener("click", function () {
            _this2.properties.mute = !_this2.properties.mute;

            _this2.keySound(keyElement);

            keyElement.classList.toggle("keyboard__key--active");
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.classList.add("keyboard-alphabet");
          keyElement.classList.add("keyboard-lang");
          keyElement.addEventListener("click", function () {
            _this2.keySound(keyElement);

            _this2.cursor.position = _this2.elements.textArea[0].selectionStart;

            if (_this2.elements.textArea[0].selectionStart === _this2.elements.textArea[0].selectionEnd) {
              _this2.properties.value = _this2.properties.value.substring(0, _this2.cursor.position) + keyElement.textContent + _this2.properties.value.substring(_this2.cursor.position);
            } else {
              _this2.properties.value = _this2.properties.value.substring(0, _this2.elements.textArea[0].selectionStart) + keyElement.textContent + _this2.properties.value.substring(_this2.elements.textArea[0].selectionEnd);
            }

            _this2._triggerEvent("oninput");

            _this2.elements.textArea[0].selectionStart = _this2.cursor.position + 1;
            _this2.elements.textArea[0].selectionEnd = _this2.cursor.position + 1;
          });
          break;
      }

      fragment.appendChild(keyElement);

      if (delimeterStr) {
        var br = document.createElement("div");
        br.classList.add("break");
        fragment.appendChild(br);
      }
    });
    return fragment;
  },
  _triggerEvent: function _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },
  _toggleCapsLock: function _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    if (this.properties.shiftKey) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.elements.keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (key.childElementCount === 0 && key.classList.contains("keyboard-alphabet")) {
            key.textContent = this.properties.capsLock ? key.textContent.toLowerCase() : key.textContent.toUpperCase();
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.elements.keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _key = _step2.value;

          if (_key.childElementCount === 0 && _key.classList.contains("keyboard-alphabet")) {
            _key.textContent = this.properties.capsLock ? _key.textContent.toUpperCase() : _key.textContent.toLowerCase();
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  },
  _toggleShiftKey: function _toggleShiftKey() {
    var _this3 = this;

    this.properties.shiftKey = !this.properties.shiftKey;
    var shiftKey = ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "{", "}", "|", ":", '"', "<", ">", "?"];
    var topRow = ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "[", "]", "\\", ";", "'", ",", ".", "/"];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      var _loop = function _loop() {
        var key = _step3.value;

        if (_this3.properties.capsLock) {
          if (key.childElementCount === 0 && key.classList.contains("keyboard-alphabet")) {
            key.textContent = _this3.properties.shiftKey ? key.textContent.toLowerCase() : key.textContent.toUpperCase();
          }
        } else {
          if (key.childElementCount === 0 && key.classList.contains("keyboard-alphabet")) {
            key.textContent = _this3.properties.shiftKey ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
          }
        }

        var indextopRow = topRow.indexOf(key.textContent);
        var checkIndextopRow = topRow.indexOf(key.textContent) !== -1;
        var indexShiftKey = shiftKey.indexOf(key.textContent);
        var checkIndexShiftKey = shiftKey.indexOf(key.textContent) !== -1;

        if (checkIndextopRow) {
          shiftKey.forEach(function (elem, index) {
            indextopRow === index ? key.textContent = elem : key.textContent;
          });
        } else if (checkIndexShiftKey) {
          topRow.forEach(function (elem, index) {
            indexShiftKey === index ? key.textContent = elem : key.textContent;
          });
        }
      };

      for (var _iterator3 = this.elements.keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  },
  _langKey: function _langKey() {
    var _this4 = this;

    this.properties.lang = !this.properties.lang; //REFACTOR : function filterArrKeys

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      var _loop2 = function _loop2() {
        var key = _step4.value;
        var keyFilters = key.classList.contains("keyboard-lang");

        if (keyFilters && !_this4.properties.lang) {
          _this4.elements.tempArr.push(key.textContent);

          var indexTempArr = _this4.elements.tempArr.indexOf(key.textContent);

          _this4.elements.keysRu.filter(function (item) {
            return item.length < 2;
          }).forEach(function (elem, index) {
            indexTempArr === index ? key.textContent = elem : key.textContent;

            if (_this4.properties.capsLock) {
              key.textContent = key.textContent.toUpperCase();
            } else if (_this4.properties.shiftKey) {
              key.textContent = key.textContent.toUpperCase();
              _this4._toggleShiftKey;
              _this4.properties.shiftKey = !_this4.properties.shiftKey;

              _this4.elements.keys[41].classList.remove("keyboard__key--active");
            }
          });

          _this4.elements.tempArr.length === 47 ? _this4.elements.tempArr = [] : _this4.elements.tempArr;
        } else if (keyFilters && _this4.properties.lang) {
          _this4.elements.tempArr.push(key.textContent);

          var _indexTempArr = _this4.elements.tempArr.indexOf(key.textContent);

          _this4.elements.keysEn.filter(function (item) {
            return item.length < 2;
          }).forEach(function (elem, index) {
            _indexTempArr === index ? key.textContent = elem : key.textContent;

            if (_this4.properties.capsLock) {
              key.textContent = key.textContent.toUpperCase();
            } else if (_this4.properties.shiftKey) {
              key.textContent = key.textContent.toUpperCase();
              _this4._toggleShiftKey;
              _this4.properties.shiftKey = !_this4.properties.shiftKey;

              _this4.elements.keys[41].classList.remove("keyboard__key--active");
            }
          });

          _this4.elements.tempArr.length === 47 ? _this4.elements.tempArr = [] : _this4.elements.tempArr;
        }
      };

      for (var _iterator4 = this.elements.keys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        _loop2();
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
          _iterator4["return"]();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  },
  keydown: function keydown() {
    var _this5 = this;

    document.addEventListener("keydown", function (evt) {
      //   console.log(evt.type);
      //   console.log(evt.key);
      //   console.log(evt.code);
      _this5.elements.keys.forEach(function (item) {
        var keyAttribute = item.getAttribute("data");

        if (evt.code === keyAttribute && keyAttribute === "ShiftLeft" || evt.code === keyAttribute && keyAttribute === "ShiftRight") {
          _this5._toggleShiftKey();

          _this5.elements.keys[41].classList.toggle("keyboard__key--active", _this5.properties.shiftKey);
        }

        if (evt.code === keyAttribute && keyAttribute === "CapsLock") {
          _this5._toggleCapsLock();

          _this5.elements.keys[28].classList.toggle("keyboard__key--active", _this5.properties.capsLock);
        }

        if (evt.code === keyAttribute && keyAttribute === "Enter") {
          _this5.properties.value += "\n";
        }

        if (evt.code === keyAttribute && keyAttribute === "AltLeft" || evt.code === keyAttribute && keyAttribute === "AltRight") {
          evt.preventDefault();
        }

        if (evt.code === keyAttribute && keyAttribute === "Backspace") {
          _this5.properties.value = _this5.properties.value.substring(0, _this5.properties.value.length - 1);
        }

        if (evt.code === keyAttribute && keyAttribute === "Tab") {
          evt.preventDefault();
          _this5.properties.value += "    ";
          _this5.elements.textArea[0].value = _this5.properties.value;
        }

        if (evt.code === keyAttribute) {
          _this5.keySound(item);

          item.classList.add("keyboard__key--backlight");
        }
      });
    });
  },
  keyup: function keyup() {
    var _this6 = this;

    document.addEventListener("keyup", function (evt) {
      //   console.log(evt.type);
      //   console.log(evt.key);
      //   console.log(evt.code);
      _this6.elements.keys.forEach(function (item) {
        var keyAttribute = item.getAttribute("data");
        var alphabet = item.classList.contains("keyboard-alphabet");

        if (evt.code === keyAttribute) {
          item.classList.remove("keyboard__key--backlight");
        }

        if (evt.code === keyAttribute && alphabet) {
          _this6.properties.value = _this6.properties.value + evt.key;
        }
      });
    });
  },
  voice: function voice() {
    var _this7 = this;

    this.properties.voice = !this.properties.voice;
    var recognition = new SpeechRecognition();
    recognition.lang = this.properties.lang === true ? "en-US" : "ru-Ru";

    if (this.properties.voice) {
      recognition.start();
    }

    recognition.addEventListener("result", function (evt) {
      if (evt.results[0].isFinal) {
        var inputText = Array.from(evt.results).map(function (result) {
          return result[0];
        }).map(function (result) {
          return result.transcript;
        }).join("");
        _this7.properties.value += " ".concat(inputText);
        _this7.elements.textArea[0].value = _this7.properties.value;
        console.log("text is :" + inputText);
      }
    });
    recognition.addEventListener("end", function () {
      if (_this7.properties.voice) {
        recognition.start();
      }
    });
    recognition.addEventListener("error", function (evt) {
      if (evt.error === "not-allowed") {
        _this7.elements.textArea[0].value += "\r\n" + "Что-то с микрофоном , постучите по нему";
        _this7.properties.voice = !_this7.properties.voice;
      }
    });
  },
  keySound: function keySound(key) {
    if (!this.properties.mute) {
      return;
    }

    var sound = new Audio();

    if (this.properties.lang) {
      if (key.getAttribute("data") === "ShiftLeft" || key.getAttribute("data") === "ShiftRight") {
        console.log("true");
        sound = new Audio("./assets/sounds/shift.mp3");
      } else if (key.getAttribute("data") === "Enter") {
        console.log("true");
        sound = new Audio("./assets/sounds/enter.mp3");
      } else if (key.getAttribute("data") === "CapsLock") {
        console.log("true");
        sound = new Audio("./assets/sounds/capslock.mp3");
      } else if (key.getAttribute("data") === "Backspace") {
        console.log("true");
        sound = new Audio("./assets/sounds/backspace.mp3");
      } else if (key.getAttribute("data") === "Space") {
        sound = new Audio("./assets/sounds/spacebar_en.mp3");
      } else if (key.textContent === "EN") {
        sound = new Audio("./assets/sounds/langSwitch.mp3");
      } else {
        sound = new Audio("./assets/sounds/all_en.mp3");
      }
    } else {
      if (key.getAttribute("data") === "ShiftLeft" || key.getAttribute("data") === "ShiftRight") {
        console.log("true");
        sound = new Audio("./assets/sounds/shift.mp3");
      } else if (key.getAttribute("data") === "Enter") {
        console.log("true");
        sound = new Audio("./assets/sounds/enter.mp3");
      } else if (key.getAttribute("data") === "CapsLock") {
        console.log("true");
        sound = new Audio("./assets/sounds/capslock.mp3");
      } else if (key.getAttribute("data") === "Backspace") {
        console.log("true");
        sound = new Audio("./assets/sounds/backspace.mp3");
      } else if (key.getAttribute("data") === "Space") {
        sound = new Audio("./assets/sounds/spacebar_ru.mp3");
      } else if (key.textContent === "RU") {
        sound = new Audio("./assets/sounds/langSwitchRu.mp3");
      } else {
        sound = new Audio("./assets/sounds/all_ru.mp3");
      }
    }

    sound.volume = 0.7;
    sound.play();
  },
  open: function open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },
  close: function close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};
window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});