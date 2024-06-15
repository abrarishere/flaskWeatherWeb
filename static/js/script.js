const search = document.querySelector('.fa-search');
const input = document.querySelector('#search');
const results = document.querySelectorAll('.countries p');
const loader = document.querySelector('.loading');
const container = document.querySelector('.container');
let wind = document.querySelector('#wind');
let cloud = document.querySelector('#cloudy');
let rain = document.querySelector('#rain');
let humidity = document.querySelector('#humidity');
let city = document.querySelector('#city');
let celcius = document.querySelector('#celcius');
let tdate = document.querySelector('#tdate'); // Sample 10:36-Tuesday,22 Oct 19

loader.style.display = 'none';


search.addEventListener('click', () => {
  // Lets get the input value and sent to python script
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
      // We are getting object in which there us array names matches and we are getting that array
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
});

results.forEach((result) => {
  result.addEventListener('click', () => {
    loader.style.display = 'block';
    input.value = result.textContent;
    fetch('/weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ search: result.textContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        loader.style.display = 'none';
        // We are getting an array names weather nad there are two objects in it 1 is current and 2 is location
        const weather = data.weather;
        const location = weather.location;
        const current = weather.current;
        wind.textContent = current.wind_kph;
        if (current.cloud === 0) {
          cloud.textContent = 'Clear';
        }
        rain.textContent = current.precip_mm;
        humidity.textContent = current.humidity;
        city.textContent = location.name;
        celcius.textContent = current.temp_c + `°C`;
        tdate.textContent = `${current.last_updated}`;
      });
  });
});
