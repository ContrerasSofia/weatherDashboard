var searchBtn = $('.citySearch');
var entryData = $('.cityEntry');
var APIKey = '970b86b32913a5303a116990d171f9ba';
var histBtns = $('.historyButtons');


renderHistory();

searchBtn.on('click', function (event) {
    event.preventDefault();
    var cityName = entryData.val().trim();
    getParameters(cityName);
});

histBtns.on('click', '.history', function (event) {
    var i = $(this).index();
    var historyWeather = JSON.parse(localStorage.getItem('historyWeather'));
    getWeather(historyWeather[i].Lat, historyWeather[i].Lon);
  });

function getParameters(cityName){
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + APIKey;
      fetch(requestUrl)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          console.log(data);
          getWeather(data[0].lat, data[0].lon);
      });
};

function getWeather(lat, lon){
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&cnt=45&appid='+APIKey+'&units=imperial';
    fetch(requestUrl)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          console.log(data);
          renderWeather(data);
          saveHistory(data,lat,lon);
      });
};

function renderWeather(data){
    var cardBody = $('.blockquote');
    var cardHeader = $('.card-header');
    var index = 0;

    $('.mainContent').removeClass('Hide');

    for (let i = 0; i < 6; i++) {  
        var temp = document.createElement('p');
        var wind = document.createElement('p');
        var humidity = document.createElement('p');
        var title = document.createElement('h5');
        
        temp.textContent = 'Temp: ' + data.list[index].main.temp + ' °F';
        wind.textContent = 'Wind: ' + data.list[index].wind.speed + ' MPH';
        humidity.textContent = 'Humidity: ' + data.list[index].main.humidity + ' %';
        title.textContent = dayjs(data.list[index].dt_txt).format('MMMM D, YYYY');

        cardBody[i].replaceChild(temp, cardBody[i].childNodes[0]);
        cardBody[i].replaceChild(wind, cardBody[i].childNodes[1]);
        cardBody[i].replaceChild(humidity, cardBody[i].childNodes[2]);
        cardHeader[i].replaceChild(title,  cardHeader[i].childNodes[0]);
        
        index = index + 8
        if(index == 40)
            index-- ;
    }

    //Render city tittle 
    var day = document.createElement('h3');
    day.textContent = data.city.name;
    cardHeader[0].replaceChild(day,  cardHeader[0].childNodes[0]);

};

function saveHistory(data, lat, lon){    
    const city = {
      name : data.city.name,
      Lat : lat,
      Lon : lon,
    };
  
    var historyWeather = JSON.parse(localStorage.getItem('historyWeather'));
    
    if(historyWeather == null)
        historyWeather = Array();
    else{
        for (let i = 0; i < historyWeather.length; i++) {
            if(historyWeather[i].name == city.name)
                return;
        }
    }
  
    historyWeather.push(city);
    historyWeather == null;
    localStorage.setItem('historyWeather', JSON.stringify(historyWeather));
    renderHistory();
 };

function renderHistory(){
    var history = $('.historyButtons');
    var historyWeather = JSON.parse(localStorage.getItem('historyWeather'));
    
    history.empty();

    for (let i = 0; i < historyWeather.length; i++) {
        var button = $('<button class="btn history mt-0 mb-0" type="button"></button>');
        button.text(historyWeather[i].name);
        history.append(button);        
    }
};

