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

class Birth {
  constructor(date, month, year) {
    this.date = date;
    this.month = month;
    this.year = year;
    this._getYearCalender();
  }

  _isLeapYear = () => {
    if (this.year % 100 === 0 ? this.year % 400 === 0 : this.year % 4 === 0)
      return true;
    return false;
  };

  _getYearCalender = () => {
    if (this.year) {
      this._isLeapYear()
        ? (this.birthYearCalender = [[29, [2]]])
        : (this.birthYearCalender = [[28, [2]]]);

      this.birthYearCalender.push(
        [30, [4, 6, 9, 11]],
        [31, [1, 3, 5, 7, 8, 10, 12]]
      );
    }
  };
}

class App {
  #currentDate;
  #currentYear;
  #currentMonth;
  #currentDay;
  #currentUser;
  #validDays;
  #invalidDay;
  #invalidMonth;
  #invalidYear;
  #userData;

  constructor() {
    this._setDates();
    this._getUserData();
    form.addEventListener('submit', (e) => this._newBirth(e));
  }

  _setDates = () => {
    this.#currentDate = new Date();
    this.#currentYear = this.#currentDate.getFullYear();
    this.#currentMonth = this.#currentDate.getMonth() + 1;
    this.#currentDay = this.#currentDate.getDate();
  };

  _newBirth = (e) => {
    e.preventDefault();

    if (this.#userData) this._init();

    const birthYear = Number(yearInput.value);
    const birthMonth = Number(monthInput.value);
    const birthDate = Number(dayInput.value);

    this.#currentUser = new Birth(birthDate, birthMonth, birthYear);
    this._validateDate(birthDate, birthMonth, birthYear)
      ? this._calcAge()
      : this._showError();
  };

  _init = () => {
    this._resetAge();
    this._clearError();
  };

  _validateDate = (birthDate, birthMonth, birthYear) => {
    if (birthDate && birthMonth && birthYear) {
      if (birthDate <= 0 || birthMonth <= 0 || birthYear <= 0) {
        this._getInvalidDate(birthDate, birthMonth, birthYear);
        return false;
      } else {
        this._confirmMonthDays(birthMonth);
        if (
          birthDate > this.#validDays ||
          birthMonth > 12 ||
          birthYear > this.#currentYear
        ) {
          this._getInvalidDate(birthDate, birthMonth, birthYear);
          playSound(errorSound);
          return false;
        } else {
          playSound(successSound);
          return true;
        }
      }
    } else {
      this._getInvalidDate(birthDate, birthMonth, birthYear);
      playSound(errorSound);
      return false;
    }
  };

  _getInvalidDate = (date, month, year) => {
    if (
      this.#validDays
        ? date <= 0 || date > this.#validDays
        : date <= 0 || date > 31
    ) {
      this.#invalidDay = true;
    } else {
      this.#invalidDay = false;
    }

    if (month <= 0 || month > 12) {
      this.#invalidMonth = true;
    } else {
      this.#invalidMonth = false;
    }

    if (year <= 0 || year > this.#currentYear) {
      this.#invalidYear = true;
    } else {
      this.#invalidYear = false;
    }
  };

  _confirmMonthDays = (month) => {
    this.#currentUser.birthYearCalender.forEach(
      (calender) =>
        calender[1].includes(month) && (this.#validDays = calender[0])
    );
  };

  _calcAge = () => {
    if (this.#currentDay < this.#currentUser.date) {
      this.#currentMonth--;
      this.#currentDay += 30.5;
    }

    if (this.#currentMonth < this.#currentUser.month) {
      this.#currentYear--;
      this.#currentMonth += 12;
    }

    this.#currentUser.age = {
      days: this.#currentDay - this.#currentUser.date,
      months: this.#currentMonth - this.#currentUser.month,
      years: this.#currentYear - this.#currentUser.year,
    };

    this._storeUserData();

    this._generateAge();
  };

  _storeUserData = () => {
    this.#userData = this.#currentUser.age;
    localStorage.setItem('userLocalData', JSON.stringify(this.#userData));
  };

  _getUserData = () => {
    this.#userData = JSON.parse(localStorage.getItem('userLocalData'));

    if (this.#userData) this._showAge();
  };

  _generateAge = () => {
    resultText.forEach((text) => animateElement(text, 'result__text_reveal'));
    this._showAge();
  };

  _showAge = () => {
    yearsResult.textContent = Math.trunc(this.#userData.years);
    monthsResult.textContent = Math.trunc(this.#userData.months);
    daysResult.textContent = Math.trunc(this.#userData.days);
  };

  _resetAge = () => {
    yearsResult.textContent = '--';
    monthsResult.textContent = '--';
    daysResult.textContent = '--';
  };

  _showError = () => {
    if (this.#invalidDay) {
      dayInput.setAttribute('aria-invalid', true);
      animateElement(dayInput, 'form__input_invalid');
      dayErrorMessage.classList.remove('form__error-message_hide');
    }
    if (this.#invalidMonth) {
      monthInput.setAttribute('aria-invalid', true);
      animateElement(monthInput, 'form__input_invalid');
      monthErrorMessage.classList.remove('form__error-message_hide');
    }
    if (this.#invalidYear) {
      yearInput.setAttribute('aria-invalid', true);
      animateElement(yearInput, 'form__input_invalid');
      yearErrorMessage.classList.remove('form__error-message_hide');
    }
  };

  _clearError = () => {
    dayInput.removeAttribute('aria-invalid');
    dayErrorMessage.classList.add('form__error-message_hide');

    monthInput.removeAttribute('aria-invalid');
    monthErrorMessage.classList.add('form__error-message_hide');

    yearInput.removeAttribute('aria-invalid');
    yearErrorMessage.classList.add('form__error-message_hide');
  };
}

const app = new App();
