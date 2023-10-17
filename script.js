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
const initSounds = () => {
  successSound.play();
  successSound.pause();

  errorSound.play();
  errorSound.pause();
};

const playSound = (sound) => {
  sound.play();
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

const isLeapYear = (year) => {
  if (year % 100 === 0 ? year % 400 === 0 : year % 4 === 0) return true;
  return false;
};

const confirmMonthDays = (month) => {
  currentUser.birthYearCalender.forEach(
    (calender) => calender[1].includes(month) && (validDays = calender[0])
  );
};

const validateDate = (birthDate, birthMonth, birthYear) => {
  if (birthDate && birthMonth && birthYear) {
    if (birthDate <= 0 || birthMonth <= 0 || birthYear <= 0) {
      getInvalidDate(birthDate, birthMonth, birthYear);
      return false;
    } else {
      confirmMonthDays(birthMonth);
      if (birthDate > validDays || birthMonth > 12 || birthYear > currentYear) {
        getInvalidDate(birthDate, birthMonth, birthYear);
        playSound(errorSound);
        return false;
      } else {
        playSound(successSound);
        return true;
      }
    }
  } else {
    getInvalidDate(birthDate, birthMonth, birthYear);
    playSound(errorSound);
    return false;
  }
};

const getInvalidDate = (date, month, year) => {
  if (validDays ? date <= 0 || date > validDays : date <= 0 || date > 31)
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

const clearError = () => {
  dayInput.removeAttribute('aria-invalid');
  dayErrorMessage.classList.add('form__error-message_hide');

  monthInput.removeAttribute('aria-invalid');
  monthErrorMessage.classList.add('form__error-message_hide');

  yearInput.removeAttribute('aria-invalid');
  yearErrorMessage.classList.add('form__error-message_hide');
};

const showAge = () => {
  resultText.forEach((text) => animateElement(text, 'result__text_reveal'));
  yearsResult.textContent = Math.trunc(currentUser.age.years);
  monthsResult.textContent = Math.trunc(currentUser.age.months);
  daysResult.textContent = Math.trunc(currentUser.age.days);
};

const resetAge = () => {
  yearsResult.textContent = '--';
  monthsResult.textContent = '--';
  daysResult.textContent = '--';
};

const saveUserInfo = (date, month, year) => {
  currentUser = new Birth(date, month, year);
  currentUser.getYearCalender();
};

const clearUserInfo = () => {
  currentUser.year = 0;
  currentUser.month = 0;
  currentUser.day = 0;
  currentUser.birthYearCalender = [];
  currentUser.age = {};
};

const resetVariables = () => {
  validDays = invalidDay = invalidMonth = invalidYear = null;
  currentDate = new Date();
  currentYear = currentDate.getFullYear();
  currentMonth = currentDate.getMonth() + 1;
  currentDay = currentDate.getDate();
};

const init = () => {
  resetVariables();
  clearUserInfo();
  resetAge();
  clearError();
};

// Variables
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth() + 1;
let currentDay = currentDate.getDate();

let currentUser;
let validDays;
let invalidDay, invalidMonth, invalidYear;
let newRequest = false;

// User Type
const Birth = function (date, month, year) {
  this.date = date;
  this.month = month;
  this.year = year;
};

Birth.prototype.getYearCalender = function () {
  if (this.year) {
    isLeapYear(this.year)
      ? (this.birthYearCalender = [[29, [2]]])
      : (this.birthYearCalender = [[28, [2]]]);
    this.birthYearCalender.push(
      [30, [4, 6, 9, 11]],
      [31, [1, 3, 5, 7, 8, 10, 12]]
    );
  }
};

Birth.prototype.calcAge = function () {
  if (currentDay < this.date) {
    currentMonth--;
    currentDay += 30.5;
  }

  if (currentMonth < this.month) {
    currentYear--;
    currentMonth += 12;
  }

  this.age = {
    days: currentDay - this.date,
    months: currentMonth - this.month,
    years: currentYear - this.year,
  };

  showAge();
};

// Events
form.addEventListener('submit', (e) => {
  e.preventDefault();

  initSounds();

  if (newRequest) init();

  const birthYear = Number(yearInput.value);
  const birthMonth = Number(monthInput.value);
  const birthDate = Number(dayInput.value);

  saveUserInfo(birthDate, birthMonth, birthYear);

  validateDate(birthDate, birthMonth, birthYear)
    ? currentUser.calcAge(birthDate, birthMonth, birthYear)
    : showError();

  newRequest = true;
});
