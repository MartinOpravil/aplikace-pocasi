import React, { Component, useState } from 'react';
import './App.css';
import bgthunder from './assets/thunderstorm-bg.jpg';
import bgclear from './assets/clear-bg.jpg';
import bgrain from './assets/rain-bg.jpg';
import bgsnow from './assets/snow-bg.jpg';
import bgcloud from './assets/cloud-bg.jpg';
import bgdrizzle from './assets/drizzle-bg.jpg';
import bgdefault from './assets/default-bg.jpg';

import icongps from './assets/gps.png';

import Chart from './components/Chart';

const api_weather = {
  key: "536c97c14cefed7970f3e01903eba237",
  base: "https://api.openweathermap.org/data/2.5/"
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstload: true,
      query: "",
      weather: {},
      forecastTemp: [],
      forecastTempDesc: [],
      forecastRain: []
    }

    this.search = this.search.bind(this);
    this.gpsweather = this.gpsweather.bind(this);
    this.createForecast = this.createForecast.bind(this);
    this.createDataChartTemp = this.createDataChartTemp.bind(this);
    this.createDataChartRain = this.createDataChartRain.bind(this);
  }

  /* state = {
    query: "",
    weather: {},
    forecastTemp: [],
    forecastTempDesc: []
  } */

  /* const [query, setQuery] = useState(''); // Hodnota
  const [weather, setWeather] = useState({}); // Objekt

  const [chartData, setChartData] = useState({});
  const [forecastTemp, setforecastTemp] =useState([]);
  const [forecastTempDesc, setforecastTempDesc] =useState([]); */

  search (evt) {
    if (evt.key === "Enter") {
      fetch(`${api_weather.base}weather?q=${this.state.query}&units=metric&lang=cz&APPID=${api_weather.key}`) // Zeptej se na toto API
        .then(res => res.json())  // Poté co dostaneš odpověď převeď
        .then(result => {
          //console.log(query);
          this.forecast(this.state.query);
          this.setState({query: ""});
          this.setState({weather: result});
          //console.log(result);
        }); // Po převedení zavolej funkci setWeather
    }
  }
  
  forecast (city) {
    this.setState({firstload: false});
    fetch(`${api_weather.base}forecast?q=${city}&units=metric&cnt=25&lang=cz&APPID=${api_weather.key}`)
    .then(res => res.json())
    .then(result => {
      this.createForecast(result.list);
    })
  }

  gpssearch (city) {
    fetch(`${api_weather.base}weather?q=${city}&units=metric&lang=cz&APPID=${api_weather.key}`) // Zeptej se na toto API
        .then(res => res.json())  // Poté co dostaneš odpověď převeď
        .then(result => {
          this.forecast(city);
          this.setState({query: ""});
          this.setState({weather: result});
        }); // Po převedení zavolej funkci setWeather
  }

  gpsweather () {
    fetch(`https://ipapi.co/json/`)
    .then(response => response.json())
    .then(data => {
      this.setState({query: data.city});
      this.gpssearch(data.city);
    })
  }

  // Dá přeloženému popisu velké písmeno na začátku
  fixDescription (d) {
    let firstcharacter = d[0].toUpperCase();
    let rest = d.substring(1);
    return firstcharacter+rest;
  }

  //gpsweather();

  dateBuilder (d) {
    let months = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];
    let days = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];

    // Funkce existují pro práci s Date formátem
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    //console.log(d);
    // Template string
    return `${day} ${date}. ${month} ${year}`;
  }

  /* const translateWeatherConditions = (con) => {
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
        //condition = "Jasno";
        break;
      case "Clouds":
        condition = "Oblačno";
        break;
      default:
    }
    return condition;
  } */

  changeBackground (con) {
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

  
  createDataChartTemp () {
    let data = {
      labels: this.state.forecastTempDesc,
      datasets: [{
        data: this.state.forecastTemp,
        backgroundColor: "#345995",
        borderColor: "rgba(255,255,255,1)"
      }]
    }
    //console.log("TEMP");
    //console.log(this.state.forecastTemp);
    return data;
  }

  createDataChartRain () {
    let data = {
      labels: this.state.forecastTempDesc.slice(0,9),
      datasets: [{
        data: this.state.forecastRain,
        backgroundColor: "#345995",
        borderColor: "rgba(255,255,255,1)"
      }]
    }
    //console.log("Rain");
    //console.log(this.state.forecastRain);
    return data;
  }

  createForecast (data) {
    if (typeof data != "undefined") {
      let forecast = [];
      let forecastDesc = [];
      let forecastRain = [];
      for (let i = 0; i < data.length; i++) {
        forecast.push(Math.round(data[i].main.temp));
        forecastDesc.push(data[i].dt_txt.substring(11,16));
        if (typeof data[i].rain != "undefined") {
          forecastRain.push(data[i].rain["3h"]);
        }
      }
      this.setState({forecastTemp: forecast});
      this.setState({forecastTempDesc: forecastDesc});
      this.setState({forecastRain: forecastRain});

      //console.log(this.state.forecastTemp);
      //console.log(this.state.forecastRain);
    }
  }

  render() {
    // Název aplikace
    let output_elements = [];
    let element_nazev = <div>
                          <div className="title">Aplikace Počasí</div>
                          <div className="apis">openweathermap.org - ipapi.co</div>
                        </div>;
    
    let element_search = <div className="search-box">
                            <input 
                              type="text" 
                              className="search-bar" 
                              placeholder="vyhledat..." 
                              onChange={e => this.setState({query: e.target.value})}
                              value={this.state.query}
                              onKeyPress={this.search}
                            />
                            <div className="gps" onClick={this.gpsweather}><img src={icongps} alt="gps icon"/></div>
                          </div>;

    let element_copyright = <div>
                              <div className="location-box">
                                <div className="copyright">© Martin Opravil 2020</div>
                              </div>
                            </div>

    let element_error = <div>
                          <div className="error-message">
                            <div>Zadaná lokalita nebyla rozpoznána.</div>
                            <div>Zkuste to prosím znovu, nejlépe anglicky.</div>
                          </div>
                        </div>

    // Defaultní zobrazení
    if (typeof this.state.weather.main == "undefined" && this.state.firstload) {
      output_elements.push(element_nazev);
      output_elements.push(element_search);
      output_elements.push(element_copyright);
    // Pokud je špatně vstup
    } else if (typeof this.state.weather.main == "undefined" && this.state.firstload == false) {
      output_elements.push(element_nazev);
      output_elements.push(element_search);
      output_elements.push(element_error);
      output_elements.push(element_copyright);
    // Vyhledané místo
    } else {
      output_elements.push(element_search);
    }

    return (

      <div className="app" style={{backgroundImage: `url(${this.changeBackground((typeof this.state.weather.main != "undefined") ? this.state.weather.weather[0].main : "")})`}}>
        <main>
          <div className="border">
            <div>
              { output_elements }
            </div>
            {(typeof this.state.weather.main != "undefined") ? (
            <div>
              <div className="location-box">
                <div className="location">{this.state.weather.name === "Prague" ? "Praha" : this.state.weather.name}, {this.state.weather.sys.country}</div>
                <div className="date">{this.dateBuilder(new Date())}</div>
              </div>
              <div className="info-container">
                <div className="weather-box">
                  <div className="temp">
                    {Math.round(this.state.weather.main.temp)}°c
                  </div>
                  <div className="weather">
                    {this.fixDescription(this.state.weather.weather[0].description)}
                  </div>
                
                  <div className="humidity">{this.state.weather.main.humidity}% vlhkost</div>
                  <div className="pressure">{this.state.weather.main.pressure} hPa</div>
                </div>
                <div className="chart-container">
                  <Chart chartData={this.createDataChartTemp} titleName="Teplota (°c) - 72h"/>
                  <Chart chartData={this.createDataChartRain} titleName="Srážky (mm) - 24h"/>
                </div>
              </div>
            </div>
            ) : ('')}
          </div>
        </main>

      </div>
    )
  }
}

export default App;
