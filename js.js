const calc = document.querySelector('.calc')
const result = document.querySelector('.result')
const undo = document.querySelector('.undo')
const onOff = document.querySelector('.on-btn')
let lastInput
let isCalculed = false
let lastValueInput = []
let resultArr = []
let lastValue
let power = false
let timer
let operator
let lastOperator


onOff.addEventListener('click', () => {
  timeToOff()
  onOff.classList.toggle('active')
  result.classList.toggle('active')
  if (result.classList.contains('active')) {
    power = true
  }
  clear()

})

function clear() {
  result.value = '0'
  lastInput = ''
  isCalculed = false
  lastValueInput = []
  lastValue = undefined
  operator = ''
}

function undoValue() {
  if (result.value.length > 0) {
    result.value = result.value.slice(0, -1)
    lastValueInput.pop()
    lastValue = lastValueInput.join('')
  } if (result.value.length <= 0) {
    result.value = '0'
  }
  timeToOff()
}

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

function calculator(btnValue) {
  const numbers = /[0-9]/.test(btnValue)
  const oper = /[+\-*/]/.test(btnValue)
  const clearBtn = btnValue === 'C' || btnValue === 'Delete'
  const dot = btnValue === '.'
  const equal = btnValue === '=' || btnValue === 'Enter'
  const percent = btnValue === '%'

  timeToOff()

  if (result.value != '0' && clearBtn) {
    clear()
  }

  if (numbers) {
    if (result.value === '0' || isCalculed) {
      result.value = btnValue
      isCalculed = false
    } else {
      lastValueInput.push(btnValue)
      lastValue = lastValueInput.join('')
      result.value += btnValue
    }
    lastInput = parseInt(btnValue, 10)
  }

  if (oper && result.value !== '0') {
    isCalculed = false
    lastValueInput = []
    if (/[+\-*/]/.test(lastInput)) {
      result.value = result.value.slice(0, -1)
    }
    result.value += btnValue
    lastInput = btnValue
    operator = lastInput
  }





  if (percent && result.value !== '0' && typeof (lastInput) === 'number') {
    result.value = eval(result.value) / 100;
    lastInput = result.value;
  }
  const hasDot = result.value.includes('.');
  if (dot && typeof (lastInput) === 'number' && !hasDot) {
    result.value += btnValue
  }
  if (equal) {
    if (isCalculed) {

      try {
        return result.value = eval(`${result.value}${operator}${lastValue}`)
      } catch (error) {
        console.error('Wrong number:', error);
      }


    }
    if (/[+\-*/]/.test(lastInput)) {
      undoValue()
      result.value = eval(result.value)
      isCalculed = true
    } else {
      result.value = eval(result.value)
      isCalculed = true
    }
  }
}



calc.addEventListener('click', (ev) => {

  if (result.classList.contains('active')) {
    power = true
  } if (power && ev.target.classList.contains('btn')) {
    calculator(ev.target.innerHTML)
  }
})


undo.addEventListener('click', undoValue)

document.addEventListener('keydown', (ev) => {
  if (result.classList.contains('active')) {
    power = true
  }
  power ? calculator(ev.key) : null
  timeToOff()
  ev.key === 'Backspace' ? undoValue() : null
})
