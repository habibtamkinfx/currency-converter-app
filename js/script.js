const formEl = document.getElementById('currency-form');
const amountEl = document.getElementById('amount');
const fromCurrencyEl = document.getElementById('from-currency');
const toCurrencyEl = document.getElementById('to-currency');
const resultEl = document.getElementById('result');
const swapButtonEl = document.querySelector('#swap-btn');

window.addEventListener('load', populateCurrencies);

formEl.addEventListener('submit', handleSubmit);
swapButtonEl.addEventListener('click', swapCurrencies);

function createCurrencyOption(selectEl, currency) {
  const optionEl = document.createElement('option');
  optionEl.value = currency;
  optionEl.textContent = currency;
  selectEl.appendChild(optionEl);
}

async function populateCurrencies() {
  amountEl.focus();
  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const currencies = Object.keys(data.rates);
    fromCurrencyEl.innerHTML = '';
    toCurrencyEl.innerHTML = '';
    currencies.forEach((currency) => {
      createCurrencyOption(fromCurrencyEl, currency);
      createCurrencyOption(toCurrencyEl, currency);
    });
    fromCurrencyEl.value = 'USD';
    toCurrencyEl.value = 'AFN';
  } catch (error) {
    resultEl.innerHTML = `Error: ${error.message}`;
  }
}

function validateInputs(amount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return false;
  }

  if (fromCurrencyEl.value === toCurrencyEl.value) {
    alert('Please select different currencies');
    return false;
  }

  return true;
}

async function handleSubmit(e) {
  e.preventDefault();
  const numericAmount = Number(amountEl.value.trim());

  const isValid = validateInputs(numericAmount);
  if (!isValid) return;

  const from = fromCurrencyEl.value;
  const to = toCurrencyEl.value;

  try {
    resultEl.innerHTML = 'Loading...';
    const rates = await fetchExchangeRate(from);
    const rate = rates[to];
    if (!rate) {
      throw new Error('Invalid currency code');
    }
    displayResult(numericAmount, from, to, rate);
  } catch (error) {
    resultEl.innerHTML = `Error: ${error.message}`;
  }
}

async function fetchExchangeRate(fromCurrency) {
  const response = await fetch(
    `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.rates;
}

function calculateConversion(amount, rate) {
  return (amount * rate).toFixed(2);
}
function displayResult(amount, from, to, rate) {
  const converted = calculateConversion(amount, rate);
  resultEl.innerHTML = `${amount} ${from} = ${converted} ${to}`;
}

function swapCurrencies() {
  const temp = fromCurrencyEl.value;
  fromCurrencyEl.value = toCurrencyEl.value;
  toCurrencyEl.value = temp;
  resultEl.innerHTML = '';
}
