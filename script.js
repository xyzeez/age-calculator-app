// Elements
const form = document.querySelector('#form');
const dayInput = document.querySelector('#day');
const monthInput = document.querySelector('#month');
const yearInput = document.querySelector('#year');
const submitBtn = document.querySelector('#submitBtn');
const yearsResult = document.querySelector('#resultYears');
const monthsResult = document.querySelector('#resultMonths');
const daysResult = document.querySelector('#resultDays');
const yearErrorMessage = document.querySelector('#yearErrorMessage');
const monthErrorMessage = document.querySelector('#monthErrorMessage');
const dayErrorMessage = document.querySelector('#dayErrorMessage');
const resultText = document.querySelectorAll('.result__text');

// Sound effects
const successSound = new Audio('./assets/sounds/ping.mp3');
const errorSound = new Audio('./assets/sounds/error.mp3');

// Functions
const isLeapYear = (year) => {
  if (year % 100 === 0 ? year % 400 === 0 : year % 4 === 0) {
    return true;
  } else {
    return false;
  }
};

const confirmDays = (month) => {
  monthDays.forEach((x) => {
    if (x[1].includes(month)) {
      validDays = x[0];
    }
  });
};

const validateDate = (day, month, year) => {
  console.log('Validating');
  if (day && month && year) {
    if (day <= 0 || month <= 0 || year <= 0) {
      getInvalidDate(day, month, year);
      return false;
    } else {
      confirmDays(month);
      if (day > validDays || month > 12 || year > currentYear) {
        getInvalidDate(day, month, year);
        playSound(errorSound);
        return false;
      } else {
        playSound(successSound);
        return true;
      }
    }
  } else {
    console.log('Straight false');
    getInvalidDate(day, month, year);
    playSound(errorSound);
    return false;
  }
};

const getInvalidDate = (day, month, year) => {
  if (validDays ? day <= 0 || day > validDays : day <= 0 || day > 31)
    invalidDay = true;

  if (month <= 0 || month > 12) invalidMonth = true;

  if (year <= 0 || year > currentYear) invalidYear = true;
};

const showError = () => {
  if (invalidDay) {
    dayInput.setAttribute('aria-invalid', true);
    animateFormInput(dayInput);
    dayErrorMessage.classList.remove('form__error-message_hide');
  }
  if (invalidMonth) {
    monthInput.setAttribute('aria-invalid', true);
    animateFormInput(monthInput);
    monthErrorMessage.classList.remove('form__error-message_hide');
  }
  if (invalidYear) {
    yearInput.setAttribute('aria-invalid', true);
    animateFormInput(yearInput);
    yearErrorMessage.classList.remove('form__error-message_hide');
  }
};

const animateFormInput = (input) => {
  input.classList.add('form__input_invalid');
  input.addEventListener(
    'animationend',
    () => {
      input.classList.remove('form__input_invalid');
    },
    { once: true }
  );
};

const clearError = () => {
  dayInput.removeAttribute('aria-invalid');
  dayErrorMessage.classList.add('form__error-message_hide');

  monthInput.removeAttribute('aria-invalid');
  monthErrorMessage.classList.add('form__error-message_hide');

  yearInput.removeAttribute('aria-invalid');
  yearErrorMessage.classList.add('form__error-message_hide');
};

const playSound = (sound) => {
  sound.play();
};

const saveBirthInfo = (day, month, year) => {
  birth.day = day;
  birth.month = month;
  birth.year = year;
};

const calculateAge = (day, month, year) => {
  saveBirthInfo(day, month, year);
  if (currentDay < birth.day) {
    currentMonth--;
    currentDay += 30.5;
  }

  if (currentMonth < birth.month) {
    currentYear--;
    currentMonth += 12;
  }

  remDays = currentDay - birth.day;
  remMonths = currentMonth - birth.month;
  remYears = currentYear - birth.year;

  showAge();
};

const showAge = () => {
  resultText.forEach((text) => {
    text.classList.add('result__text_reveal');
    text.addEventListener(
      'animationend',
      () => {
        text.classList.remove('result__text_reveal');
      },
      { once: true }
    );
  });
  yearsResult.textContent = Math.trunc(remYears);
  monthsResult.textContent = Math.trunc(remMonths);
  daysResult.textContent = Math.trunc(remDays);
};

const clearBirthInfo = () => {
  birth.year = 0;
  birth.month = 0;
  birth.day = 0;
};

const resetAge = () => {
  yearsResult.textContent = '--';
  monthsResult.textContent = '--';
  daysResult.textContent = '--';
};

const resetVariables = () => {
  isDateValid = false;
  validDays =
    invalidDay =
    invalidMonth =
    invalidYear =
    remYears =
    remMonths =
    remDays =
      null;
  currentYear = currentDate.getFullYear();
  currentMonth = currentDate.getMonth() + 1;
  currentDay = currentDate.getDate();
};

const init = () => {
  resetVariables();
  clearBirthInfo();
  resetAge();
  clearError();
};

// Variables
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth() + 1;
let currentDay = currentDate.getDate();

const monthDays = [
  [30, [4, 6, 9, 11]],
  [31, [1, 3, 5, 7, 8, 10, 12]],
];

const getLeapYear = isLeapYear(currentYear)
  ? (monthDays[2] = [29, [2]])
  : (monthDays[2] = [28, [2]]);

const birth = {
  year: 0,
  month: 0,
  day: 0,
};

let isDateValid = false;
let validDays;
let invalidDay, invalidMonth, invalidYear;
let remYears, remMonths, remDays;

// Events
form.addEventListener('submit', (e) => {
  e.preventDefault();
  init();

  const year = Number(yearInput.value);
  const month = Number(monthInput.value);
  const day = Number(dayInput.value);

  isDateValid = validateDate(day, month, year)
    ? calculateAge(day, month, year)
    : showError();
});
