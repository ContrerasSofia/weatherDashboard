var searchBtn = $('.citySearch');
var entryData = $('.cityEntry');
var APIKey = '970b86b32913a5303a116990d171f9ba';

searchBtn.on('click', function (event) {
    event.preventDefault();
    var cityName = entryData.val().trim();
    getParameters(cityName);
});

function getParameters(cityName){
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + APIKey;
      fetch(requestUrl)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          console.log(data);
          getWeather(data[0].name, data[0].lat, data[0].lon);
      });
}

function getWeather(cityName, lat, lon){
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&cnt=6&appid='+APIKey;
    fetch(requestUrl)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          console.log(data);
          renderWeather(data);
      });
}

function renderWeather(data){
    var mainCard = $('.mainCardHeader');
    $('.mainContent').removeClass('Hide');

    var day = document.createElement('h3');
    day.textContent = data.city.name;
    mainCard.append(day);

    var cardBody = $('.blockquote');
    
    for (let i = 0; i < data.list.length; i++) {
        var temp = document.createElement('p');
        var wind = document.createElement('p');
        var humidity = document.createElement('p');
        
        temp.textContent = 'Temp: ' + data.list[i].main.temp + ' °F';
        wind.textContent = 'Wind: ' + data.list[i].wind.speed + ' MPH';
        humidity.textContent = 'Humidity: ' + data.list[i].main.humidity + ' %';

        cardBody[i].append(temp);
        cardBody[i].append(wind);
        cardBody[i].append(humidity);
    }
}