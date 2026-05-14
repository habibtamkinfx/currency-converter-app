const formEl = document.getElementById('currency-form');
const amountEl = document.getElementById('amount');
const fromCurrencyEl = document.getElementById('from-currency');
const toCurrencyEl = document.getElementById('to-currency');
const resultEl = document.getElementById('result');
const swapButtonEl = document.querySelector('#swap-btn');

window.addEventListener('load', populateCurrencies);

formEl.addEventListener('submit', handleSubmit);
swapButtonEl.addEventListener('click', swapCurrencies);

async function populateCurrencies() {
  const response = await fetch(
    'https://api.exchangerate-api.com/v4/latest/USD',
  );
  const data = await response.json();
  const currencies = Object.keys(data.rates);

  currencies.forEach((currency) => {
    const option1 = document.createElement('option');
    option1.value = currency;
    option1.textContent = currency;
    fromCurrencyEl.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = currency;
    option2.textContent = currency;
    toCurrencyEl.appendChild(option2);
  });
}

async function handleSubmit(e) {
  e.preventDefault();
  const amount = Number(amountEl.value.trim());
  if (!amount) {
    alert('Please enter a valid amount');
    return;
  }

  if (fromCurrencyEl.value === toCurrencyEl.value) {
    alert('Please select different currencies');
    return;
  }

  const from = fromCurrencyEl.value;
  const to = toCurrencyEl.value;

  try {
    resultEl.innerHTML = 'Loading...';
    const rates = await fetchExchangeRate(from);
    const rate = rates[to];
    if (!rate) {
      throw new Error('Invalid currency code');
    }
    displayResult(amount, from, to, rate);
  } catch (error) {
    resultEl.innerHTML = `Error: ${error.message}`;
  }
}

async function fetchExchangeRate(fromCurrency) {
  const response = await fetch(
    `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`,
  );
  const data = await response.json();
  if (!data) {
    throw new Error('Network response was not ok');
  }
  return data.rates;
}

function displayResult(amount, from, to, rate) {
  const converted = (amount * rate).toFixed(2);
  resultEl.innerHTML = `${amount} ${from} = ${converted} ${to}`;
}

function swapCurrencies() {
  const temp = fromCurrencyEl.value;
  fromCurrencyEl.value = toCurrencyEl.value;
  toCurrencyEl.value = temp;
}
