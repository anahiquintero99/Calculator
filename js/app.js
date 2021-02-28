//DOM elements

const display = document.querySelector('.calculator__display');
const keys = document.querySelectorAll('.calculator__key');

const REGEX_NUMBERS = /\d/;
const REGEX_SYMBOLS = /[\+\-\*\/]/;
const REGEX_INVALID_CONTENT = /[^\.\+\-\*\/\d]/;
const REGEX_INVALID_CONTENT_KEYBOARD = /[^=\.\+\-\*\/\dBackspace]/;

//flag to validet if a point can be written.
let allowPoint = true;

//Function

function validateKey(key) {
  //if there is no content, firts character murt be a
  //number or a plus/minus symbol.
  if (!display.textContent) {
    return REGEX_NUMBERS.test(key) || /[\.+-]/.test(key);
  }

  if (key === '.') return allowPoint;

  const lastCharacter = getLastCharacter();
  //if key is symbol, next character must be a number.
  if (REGEX_SYMBOLS.test(lastCharacter)) {
    return REGEX_NUMBERS.test(key);
  }

  return true;
}

function handleEqua() {
  //Avoid XSS attacks
  if (REGEX_INVALID_CONTENT.test(display.textContent)) return;

  const result = eval(display.textContent);
  display.textContent = result;
  return;
}

function handleClearAll() {
  display.textContent = '';
}

function handleClearOne() {
  const [lastCharacter, index] = getLastCharacter();
  if (lastCharacter === '.') allowPoint = true;
  display.textContent = display.textContent.slice(0, index);
}

function getLastCharacter() {
  const lastCharacterIndex = display.textContent.length - 1;
  const lastCharacter = display.textContent[lastCharacterIndex];

  return [lastCharacter, lastCharacterIndex];
}

function handClickedKey(key) {
  switch (key) {
    case '=':
      handleEqua();
      break;

    case 'C':
      handleClearAll();
      break;

    case '⇤':
    case 'Backspace':
      handleClearOne();
      break;

    default:
      if (!validateKey(key)) return;

      if (key === '.') {
        allowPoint = false;

        const [lastCharacter] = display.textContent ? getLastCharacter() : [null];
        if (!REGEX_NUMBERS.test(lastCharacter)) {
          display.textContent += '0';
        }
      }

      if (REGEX_SYMBOLS.test(key)) {
        allowPoint = true;
      }

      display.textContent += key;

      //Scroll display to the very right.
      display.scrollLeft = display.getBoundingClientRect().width;
  }
}

//  Events

keys.forEach((key) => {
  key.addEventListener('click', () => handClickedKey(key.textContent));
});

document.addEventListener('keyup', (event) => {
  if (REGEX_INVALID_CONTENT_KEYBOARD.test(event.key)) return;

  handClickedKey(event.key);
});
