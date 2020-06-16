import React, { useState } from 'react';
import './App.css';
import bgthunder from './assets/thunderstorm-bg.jpg';
import bgclear from './assets/clear-bg.jpg';
import bgrain from './assets/rain-bg.jpg';
import bgsnow from './assets/snow-bg.jpg';
import bgcloud from './assets/cloud-bg.jpg';
import bgdrizzle from './assets/drizzle-bg.jpg';
import bgdefault from './assets/default-bg.jpg';

import icongps from './assets/gps.png';

const api = {
  key: "536c97c14cefed7970f3e01903eba237",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {

  const [query, setQuery] = useState(''); // Hodnota
  const [weather, setWeather] = useState({}); // Objekt

  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`) // Zeptej se na toto API
        .then(res => res.json())  // Poté co dostaneš odpověď převeď
        .then(result => {
          setQuery('');
          setWeather(result);
          console.log(result);
        }); // Po převedení zavolej funkci setWeather
    }
  }

  const gpssearch = (city) => {
    fetch(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}`) // Zeptej se na toto API
        .then(res => res.json())  // Poté co dostaneš odpověď převeď
        .then(result => {
          setQuery('');
          setWeather(result);
          console.log(result);
        }); // Po převedení zavolej funkci setWeather
  }

  const gpsweather = () => {
    fetch(`https://ipapi.co/json/`)
    .then(response => response.json())
    .then(data => {
      setQuery(data.city);
      gpssearch(data.city);
      //console.log(data.city);
    })
  }

  //gpsweather();

  const dateBuilder = (d) => {
    let months = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];
    let days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];

    // Funkce existují pro práci s Date formátem
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    console.log(d);
    // Template string
    return `${day} ${date}. ${month} ${year}`;
  }

  const translateWeatherConditions = (con) => {
    let condition = con;
    switch(condition) {
      case "Thunderstorm":
        condition = "Bouřka";
        break;
      case "Drizzle":
        condition = "Mrholení";
        break;
      case "Rain":
        condition = "Déšť";
        break;
      case "Snow":
        condition = "Sněžení";
        break;
      case "Clear":
        condition = "Jasno";
        break;
      case "Clouds":
        condition = "Oblačno";
        break;
      default:
    }
    return condition;
  }

  const changeBackground = (con) => {
    let bg = con;
    switch(bg) {
      case "Thunderstorm":
        bg = bgthunder;
        break;
      case "Drizzle":
        bg = bgdrizzle;
        break;
      case "Rain":
        bg = bgrain;
        break;
      case "Snow":
        bg = bgsnow;
        break;
      case "Clear":
        bg = bgclear;
        break;
      case "Clouds":
        bg = bgcloud;
        break;
      default:
        bg = bgdefault;
    }
    return bg;
  }

  return (

    <div className="app" style={{backgroundImage: `url(${changeBackground((typeof weather.main != "undefined") ? weather.weather[0].main : "")})`}}>
      <main>
        <div className="border">
          {(typeof weather.main == "undefined") ? (
          <div>
            <div className="title">Aplikace Počasí</div>
            <div className="apis">openweathermap.org - ipapi.co</div>
          </div>
          ):('')}
          <div className="search-box">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="vyhledat..." 
              onChange={e => setQuery(e.target.value)}
              value={query}
              onKeyPress={search}
            />
            <div class="gps" onClick={gpsweather}><img src={icongps}/></div>
          </div>
          {(typeof weather.main != "undefined") ? (
          <div>
            <div className="location-box">
              <div className="location">{weather.name === "Prague" ? "Praha" : weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            
            <div className="weather-box">
              <div className="temp">
                {Math.round(weather.main.temp)}°c
              </div>
              <div className="weather">
                {translateWeatherConditions(weather.weather[0].main)}
                {console.log(weather.weather[0])}
              </div>
            
            <div className="humidity">{weather.main.humidity}% vlhkost</div>
            <div className="pressure">{weather.main.pressure} hPa</div>
            </div>
          </div>
          ) : (
          <div>
            <div className="location-box">
              <div className="copyright">© Martin Opravil 2020</div>
            </div>
          </div>
          )}
        </div>
      </main>

    </div>
  );
}

export default App;
