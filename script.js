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
  if (year % 100 === 0 ? year % 400 === 0 : year % 4 === 0) return true;
  return false;
};

const confirmDays = (month) => {
  birth.yearDays.forEach(
    (yearDay) => yearDay[1].includes(month) && (validDays = yearDay[0])
  );
};

const validateDate = (day, month, year) => {
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
    animateElement(dayInput, 'form__input_invalid');
    dayErrorMessage.classList.remove('form__error-message_hide');
  }
  if (invalidMonth) {
    monthInput.setAttribute('aria-invalid', true);
    animateElement(monthInput, 'form__input_invalid');
    monthErrorMessage.classList.remove('form__error-message_hide');
  }
  if (invalidYear) {
    yearInput.setAttribute('aria-invalid', true);
    animateElement(yearInput, 'form__input_invalid');
    yearErrorMessage.classList.remove('form__error-message_hide');
  }
};

const animateElement = (element, animation) => {
  element.classList.add(animation);
  element.addEventListener(
    'animationend',
    () => {
      element.classList.remove(animation);
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
  birth.updateYearDays();
};

const calculateAge = (day, month, year) => {
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
  resultText.forEach((text) => animateElement(text, 'result__text_reveal'));
  yearsResult.textContent = Math.trunc(remYears);
  monthsResult.textContent = Math.trunc(remMonths);
  daysResult.textContent = Math.trunc(remDays);
};

const clearBirthInfo = () => {
  birth.year = 0;
  birth.month = 0;
  birth.day = 0;
  birth.yearDays.splice(0, 1);
};

const resetAge = () => {
  yearsResult.textContent = '--';
  monthsResult.textContent = '--';
  daysResult.textContent = '--';
};

const resetVariables = () => {
  validDays =
    invalidDay =
    invalidMonth =
    invalidYear =
    remYears =
    remMonths =
    remDays =
      null;
  currentDate = new Date();
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
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth() + 1;
let currentDay = currentDate.getDate();
let validDays;
let invalidDay, invalidMonth, invalidYear;
let remYears, remMonths, remDays;

const birth = {
  year: 0,
  month: 0,
  day: 0,
  yearDays: [
    [30, [4, 6, 9, 11]],
    [31, [1, 3, 5, 7, 8, 10, 12]],
  ],
  updateYearDays() {
    isLeapYear(this.year)
      ? this.yearDays.unshift([29, [2]])
      : this.yearDays.unshift([28, [2]]);
  },
};

// Events
form.addEventListener('submit', (e) => {
  e.preventDefault();

  init();

  const birthYear = Number(yearInput.value);
  const birthMonth = Number(monthInput.value);
  const birthDate = Number(dayInput.value);

  saveBirthInfo(birthDate, birthMonth, birthYear);

  validateDate(birthDate, birthMonth, birthYear)
    ? calculateAge(birthDate, birthMonth, birthYear)
    : showError();
});
