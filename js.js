const calc = document.querySelector('.calc');
const result = document.querySelector('.result');
const undo = document.querySelector('.undo');
const onOff = document.querySelector('.on-btn');
let lastInput;
let isCalculed = false;
let lastValueInput = [];
let resultArr = [];
let lastValue;
let power = false;
let timer;
let operator;

// Event listener for turning on/off the calculator
onOff.addEventListener('click', () => {
  timeToOff(); // Initiates a timer for auto-off feature
  onOff.classList.toggle('active');
  result.classList.toggle('active');
  // Checks if the calculator is active (on)
  if (result.classList.contains('active')) {
    power = true;
  }
  // Clears the state on off
  clear();
});

function clear() {
  result.value = '0';
  lastInput = '';
  isCalculed = false;
  lastValueInput = [];
  lastValue = undefined;
  operator = '';
}

// The function to remove the last input value
function undoValue() {
  if (result.value.length > 0) {
    result.value = result.value.slice(0, -1);
    lastValueInput.pop();
    lastValue = lastValueInput.join('');
  }
  if (result.value.length <= 0) {
    result.value = '0';
  }
  timeToOff(); // Resets the auto-off timer
}

// Auto-off function, turns off the calculator after a certain period of time
function timeToOff() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    if (power) {
      power = false;
      result.classList.remove('active');
      onOff.classList.remove('active');
    }
  }, 20000);
}

// Main calculator function, handles all user input
function calculator(btnValue) {
  const numbers = /[0-9]/.test(btnValue);
  const oper = /[+\-*/]/.test(btnValue);
  const clearBtn = btnValue === 'C' || btnValue === 'Delete';
  const dot = btnValue === '.';
  const equal = btnValue === '=' || btnValue === 'Enter';
  const percent = btnValue === '%';
  timeToOff(); // Resets the auto-off timer

  // Handles 'clear' input
  if (result.value !== '0' && clearBtn) {
    clear();
  }

  // Handles number input
  if (numbers) {
    // If the current result is zero or a calculation has just been made
    if (result.value === '0' || isCalculed) {
      result.value = btnValue;
      isCalculed = false;
    } else {
      lastValueInput.push(btnValue);
      lastValue = lastValueInput.join('');
      result.value += btnValue;
    }
    lastInput = parseInt(btnValue, 10);
  }

  // Handles operator input
  if (oper && result.value !== '0') {
    isCalculed = false;
    lastValueInput = [];
    // If the last input was also an operator, replace it
    if (/[+\-*/]/.test(lastInput)) {
      result.value = result.value.slice(0, -1);
    }
    result.value += btnValue;
    lastInput = btnValue;
    operator = lastInput;
  }

  // Handles percent input
  if (percent && result.value !== '0' && typeof (lastInput) === 'number') {
    // Converts the current value to a percentage
    result.value = eval(result.value) / 100;
    lastInput = result.value;
  }

  // Handles dot input
  const hasDot = result.value.includes('.');
  if (dot && typeof (lastInput) === 'number' && !hasDot) {
    result.value += btnValue;
  }

  // Handles equal input
  if (equal) {
    // If a calculation has already been made, repeat it
    if (isCalculed) {
      try {
        return result.value = eval(`${result.value}${operator}${lastValue}`);
      } catch (error) {
        console.error('Wrong number:', error);
      }
    }
    // If the last input was an operator, remove it before calculating
    if (/[+\-*/]/.test(lastInput)) {
      undoValue();
      result.value = eval(result.value);
      isCalculed = true;
    } else {
      result.value = eval(result.value);
      isCalculed = true;
    }
  }
}

// Event listener for calculator buttons
calc.addEventListener('click', (ev) => {
  if (result.classList.contains('active')) {
    power = true;
  }
  if (power && ev.target.classList.contains('btn')) {
    calculator(ev.target.innerHTML);
  }
});

// Event listener for undo button
undo.addEventListener('click', undoValue);

// Event listener for keyboard input
document.addEventListener('keydown', (ev) => {
  if (result.classList.contains('active')) {
    power = true;
  }
  power ? calculator(ev.key) : null;
  timeToOff(); // Resets the auto-off timer
  ev.key === 'Backspace' ? undoValue() : null;
});
