const search = document.querySelector('.fa-search');
const input = document.querySelector('#search');
const results = document.querySelectorAll('.countries p');
const loader = document.querySelector('.loading');
const container = document.querySelector('.container');
let wind = document.querySelector('#wind');
let condition= document.querySelectorAll('.condition');
let conditionIcon= document.querySelector('#condition--icon');
let rain = document.querySelector('#rain');
let humidity = document.querySelector('#humidity');
let city = document.querySelector('#city');
let celcius = document.querySelector('#celcius');
let tdate = document.querySelector('#tdate'); // Sample 10:36-Tuesday,22 Oct 19
let error = document.querySelector('.error');
let errorText = document.querySelector('.error p');

loader.style.display = 'none';
error.style.display = 'none';


search.addEventListener('click', () => {
  searchCity();
});

results.forEach((result) => {
  result.addEventListener('click', () => {
    updateWeather(result.textContent);
  });
});

input.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    searchCity();
  }
});

function updateWeather(cityName) {
  loader.style.display = 'block';
  if (!(cityName.length > 20)) {
    cityName.textContent = input.value;
  }
  fetch('/weather', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ search: cityName }),
  })
    .then((response) => response.json())
    .then((data) => {
      checkError(data);
      loader.style.display = 'none';
      // We are getting an array names weather nad there are two objects in it 1 is current and 2 is location
      const weather = data.weather;
      const location = weather.location;
      const current = weather.current;
      wind.textContent = current.wind_kph;
      condition.forEach((cond) => {
        cond.textContent = current.condition.text;
      });
      conditionIcon.src = 'https:' + current.condition.icon;
      rain.textContent = current.precip_mm;
      humidity.textContent = current.humidity;
      city.textContent = location.name;
      celcius.textContent = current.temp_c + `°C`;
      tdate.textContent = `${current.last_updated}`;
    });
}



function searchCity() {
  loader.style.display = 'block';
  const inputValue = input.value;
  const data = JSON.stringify({ search: inputValue });
  fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      checkError(data);
      const matches = data.matches;
      results.forEach((result, index) => {
        if (matches[index]) {
          result.textContent = matches[index];
          loader.style.display = 'none';
        } else {
          result.textContent = '';
          loader.style.display = 'none';
        }
      });
    });
}

window.addEventListener('load', () => {
  loader.style.display = 'block';
  fetch('/location', {
    method: 'GET',
  })
  // We only get Name of city from the server and it is string not json
  .then((response) => response.text())
  .then((data) => {
      checkError(data);
      loader.style.display = 'none';
    updateWeather(data);
  });
});

function checkError(data) {
  if (data.error) {
    console.log(data.error);
    loader.style.display = 'none';
    container.style.display = 'none';
    error.style.display = 'block';
  }
}
