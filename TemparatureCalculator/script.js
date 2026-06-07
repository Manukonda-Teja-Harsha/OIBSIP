const input = document.getElementById('temperatureInput');
const button = document.getElementById('convertButton');
const result = document.getElementById('result');

function showResult(message, isError = false) {
  result.textContent = message;
  result.classList.toggle('error', isError);
}

function convertFromCelsius(value) {
  const fahrenheit = value * 9 / 5 + 32;
  const kelvin = value + 273.15;
  return `${fahrenheit.toFixed(2)} °F • ${kelvin.toFixed(2)} K`;
}

function convertFromFahrenheit(value) {
  const celsius = (value - 32) * 5 / 9;
  const kelvin = celsius + 273.15;
  return `${celsius.toFixed(2)} °C • ${kelvin.toFixed(2)} K`;
}

function convertFromKelvin(value) {
  const celsius = value - 273.15;
  const fahrenheit = celsius * 9 / 5 + 32;
  return `${celsius.toFixed(2)} °C • ${fahrenheit.toFixed(2)} °F`;
}

button.addEventListener('click', () => {
  const rawValue = input.value.trim();
  const value = parseFloat(rawValue);
  const unit = document.querySelector('input[name="inputUnit"]:checked').value;

  if (rawValue === '' || Number.isNaN(value)) {
    showResult('Please enter a valid number.', true);
    return;
  }

  if (unit === 'kelvin' && value < 0) {
    showResult('Kelvin cannot be below 0.', true);
    return;
  }

  let output;
  if (unit === 'celsius') {
    output = convertFromCelsius(value);
  } else if (unit === 'fahrenheit') {
    output = convertFromFahrenheit(value);
  } else {
    output = convertFromKelvin(value);
  }

  showResult(`Converted: ${output}`);
});
