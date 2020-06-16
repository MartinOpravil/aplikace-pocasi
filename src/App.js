import React, { useState } from 'react';
import './App.css';

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
          setQuery('')
          setWeather(result);
          console.log(result);
        }); // Po převedení zavolej funkci setWeather
    }
  }

  const dateBuilder = (d) => {
    //let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

  return (
    <div className={
      (typeof weather.main != "undefined")
        ? ((weather.main.temp > 16)
          ? "app warm" 
          : "app")
        : "app"}>
      
      <main>
        <div className="search-box">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="search..." 
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
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
          </div>
        </div>
        ) : (
        <div>
          <div className="location-box">
            <div className="location">Zadejte název města, či státu.</div>
          </div>
        </div>
        )}
      </main>

    </div>
  );
}

export default App;
