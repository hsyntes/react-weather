"use strict";

// Weather Class
class Weather {
  constructor(weatherCode, time, tempUnit, windSpeedUnit) {
    this.weatherCode = weatherCode;
    this.time = time;
    this.tempUnit = tempUnit;
    this.windSpeedUnit = windSpeedUnit;
  }

  // Getting the weather forecast by the weather code
  _getWeatherForecast() {
    switch (this.weatherCode) {
      case 0:
        return {
          weather: "Clear sky",
          icon: this.time === "night" ? "night.png" : "sun.png",
        };

      case 1:
        return {
          weather: "Mainly clear",
          code: "Clear",
          icon: this.time === "night" ? "night.png" : "sun.png",
        };

      case 2:
        return {
          weather: "Partly cloudy",
          icon:
            this.time === "night"
              ? "partly-cloudy-night.png"
              : "partly-cloudy-day.png",
        };

      case 3:
        return {
          weather: "Cloudy",
          icon: "cloudy.png",
        };

      case 45:
      case 48:
        return {
          weather: "Foggy",
          icon: "fog.png",
        };

      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
        return {
          weather: "Light rainly",
          icon: "light-rain.png",
        };

      case 61:
      case 63:
      case 65:
        return {
          weather: "Slight rainly",
          icon: "rain.png",
        };

      case 66:
      case 67:
        return {
          weather: "Heavy rainly",
          icon: "heavy-rain.png",
        };

      case 71:
      case 73:
      case 75:
      case 77:
        return {
          weather: "Snowfall",
          icon: "snow.png",
        };

      case 80:
      case 81:
      case 82:
        return {
          weather: "Heavy rainly",
          icon: "heavy-rain.png",
        };

      case 85:
      case 86:
        return {
          weather: "Snowy",
          icon: "snow.png",
        };

      case 95:
      case 96:
        return {
          weather: "Thunderstorm",
          icon: "storm.png",
        };

      case 99:
        return {
          weather: "Thunderstorm",
          icon: "storm.png",
        };
    }
  }
}

// Current Weather Class
class CurrentWeather extends Weather {
  constructor(
    weatherCode,
    time,
    tempUnit,
    windSpeedUnit,
    timezone,
    temperature,
    windSpeed
  ) {
    super(weatherCode, time, tempUnit, windSpeedUnit);
    this.timezone = timezone;
    this.temperature = temperature;
    this.windSpeed = windSpeed;
  }
}

// Daily Weather Class
class DailyWeather extends Weather {
  constructor(
    weatherCode,
    time,
    tempUnit,
    windSpeedUnit,
    temperatureMax,
    temperatureMin,
    windSpeed,
    date,
    precipitationSum,
    rain_sum,
    showersSum,
    snowfallSum
  ) {
    super(weatherCode, time, tempUnit, windSpeedUnit);
    this.temperatureMax = temperatureMax;
    this.temperatureMin = temperatureMin;
    this.windSpeed = windSpeed;
    this.date = date;
    this.precipitationSum = precipitationSum;
    this.rainSum = rain_sum;
    this.showersSum = showersSum;
    this.snowfallSum = snowfallSum;
  }

  // Getting the weekdays
  _getDay = () =>
    new Intl.DateTimeFormat(navigator.language, {
      weekday: "long",
    }).format(new Date(this.date));
}

// App Class
class App {
  #app;
  #currentWeather;

  #colors = {
    light: getComputedStyle(document.documentElement).getPropertyValue(
      "--bs-light"
    ),

    dark: getComputedStyle(document.documentElement).getPropertyValue(
      "--bs-dark"
    ),

    white: getComputedStyle(document.documentElement).getPropertyValue(
      "--bs-white"
    ),

    black: getComputedStyle(document.documentElement).getPropertyValue(
      "--bs-black"
    ),
  };

  #tempChart;

  #dailyWeather = [];
  #currentDailyWeather;

  #units = {};

  #time;

  constructor(className) {
    this._createApp(className);
  }

  // Creating the app container
  _createApp(className) {
    this.#app = document.createElement("div");
    this.#app.className = className;

    document.body.prepend(this.#app);

    this._getPermission();

    this.#app.addEventListener("click", (e) => this._getCurrentDailyWeather(e));
    document
      .querySelector("#input-search-city")
      .addEventListener("keyup", () => {
        fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${
            document.querySelector("#input-search-city").value
          }`
        )
          .then((promise) => promise.json())
          .then((cities) => {
            const { results } = cities;

            document.querySelector(".searched-cities").innerHTML = "";
            if (typeof results !== "undefined") {
              results.forEach((result) => {
                if (result.country)
                  fetch(
                    `https://restcountries.com/v3.1/name/${String(
                      result.country
                    )
                      .trim()
                      .toLowerCase()}`
                  )
                    .then((promise) => promise.json())
                    .then((countries) => {
                      console.log(countries);
                      const searchedCities = `
                    <div class="searched-city py-2 my-1">
                        <div class="row align-items-center">
                          <div class="col-2">
                            <div class="country-img-box">
                              <img src="${countries[0]?.flags?.svg}" class="rounded-circle" />
                            </div>
                          </div>
                          <div class="col-10">${result.name}, ${result.country}</div>
                        </div>
                    </div>
                      `;

                      document
                        .querySelector(".searched-cities")
                        .insertAdjacentHTML("afterbegin", searchedCities);
                    });
              });
            }
          });
      });
  }

  // Calling the fetch API
  _callAPI = (position) =>
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=weathercode,temperature_2m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum,windspeed_10m_max,sunrise,sunset&current_weather=true&timezone=auto`
    );

  // Setting the theme by time
  _setTheme(data) {
    const { sunrise, sunset } = data.daily;

    const [sunsetHour, sunsetMinute] = sunset[0].slice(-5).split(":");
    const [sunriseHour, sunriseMinute] = sunrise[0].slice(-5).split(":");

    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    if (currentHour >= 12) {
      currentHour >= Number(sunsetHour)
        ? (this.#time = "night")
        : (this.#time = "day");

      if (currentHour === Number(sunsetHour))
        currentMinute >= Number(sunsetMinute)
          ? (this.#time = "night")
          : (this.#time = "day");
    } else {
      currentHour <= Number(sunriseHour)
        ? (this.#time = "night")
        : (this.#time = "day");

      if (currentHour === Number(sunriseHour))
        currentMinute <= Number(sunriseMinute)
          ? (this.#time = "night")
          : (this.#time = "day");
    }
  }

  // Creating the current weather forecast
  _createCurrentWeather(data) {
    const { weathercode, temperature, windspeed } = data.current_weather;
    const { timezone } = data;

    this.#currentWeather = new CurrentWeather(
      weathercode,
      this.#time,
      this.#units.temperatureUnit,
      this.#units.windSpeedUnit,
      timezone,
      temperature,
      windspeed
    );
  }

  // Creating daily weather forecasts for 1 week
  _createDailyWeather(data) {
    const {
      weathercode,
      temperature_2m_max,
      temperature_2m_min,
      windspeed_10m_max,
      time,
      precipitation_sum,
      rain_sum,
      showers_sum,
      snowfall_sum,
    } = data.daily;

    let day = 0;

    while (day < 7) {
      const dailyWeather = new DailyWeather(
        weathercode[day],
        "day",
        this.#units.temperatureUnit,
        this.#units.windSpeedUnit,
        temperature_2m_max[day],
        temperature_2m_min[day],
        windspeed_10m_max[day],
        time[day],
        precipitation_sum[day],
        rain_sum[day],
        showers_sum[day],
        snowfall_sum[day]
      );

      this.#dailyWeather.push(dailyWeather);

      day++;
    }

    this.#dailyWeather.shift();
  }

  // Getting the current time
  _getTime = () =>
    new Intl.DateTimeFormat(navigator.language, {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

  // Creating line chart temperatures by hours
  _createTempChart(data) {
    const hours = [];
    data.hourly.time
      .slice(new Date().getHours() + 1, new Date().getHours() + 13)
      .forEach((hour) => hours.push(hour.slice(-5)));

    const temperatures = [];
    data.hourly.temperature_2m
      .slice(new Date().getHours() + 1, new Date().getHours() + 13)
      .forEach((temperature) => temperatures.push(temperature));

    const ctx = document.querySelector("#temp-chart");

    if (this.#tempChart) this.#tempChart.destroy();

    this.#tempChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: hours,
        datasets: [
          {
            label: "Hourly",
            data: temperatures,

            borderColor: `${
              this.#time === "night" ? this.#colors.white : this.#colors.black
            }`,

            borderJoinStyle: "round",
            borderWidth: 2,
            pointBorderWidth: 8,

            backgroundColor: `${
              this.#time === "night" ? this.#colors.white : this.#colors.black
            }`,
          },
        ],
      },
    });
  }

  // Showing both the current and daily weather on the display
  _renderCurrentWeather() {
    document.body.className = this.#time === "night" ? "bg-black" : "bg-light";

    const currentWeatherHTML = `
    <nav class="navbar ${this.#time === "night" ? "bg-dark" : "bg-white"} p-3">
      <button
        type="button"
        class="btn ${this.#time === "night" ? "text-white" : "text-muted"}"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvas-nav-menu"
      >
        <i class="fa-solid fa-bars fa-xl"></i>
      </button>
      <div
        class="offcanvas offcanvas-start ${
          this.#time === "night" ? "bg-black" : "bg-white shadow"
        }"
        id="offcanvas-nav-menu"
      >
        <div class="offcanvas-header align-items-center">
          <h4 class="${
            this.#time === "night" ? "text-white" : "text-black"
          } mb-0">
            <span>
              <img src="../img/icon.ico" width="32" />
            </span>
            <span>Weather Forecast</span>
          </h4>
          <button
            type="button"
            class="btn ${
              this.#time === "night" ? "text-white" : "text-black"
            } ms-auto"
            data-bs-dismiss="offcanvas"
          >
            <i class="fa fa-times fa-xl"></i>
          </button>
        </div>
        <div class="offcanvas-body">
          <ul class="list-group">
            <li class="list-group-item border-0 ps-0">
              <a
                href="https://github.com/hsyntes"
                class="d-flex align-items-center ${
                  this.#time === "night"
                    ? "bg-dark text-white"
                    : "bg-light text-muted"
                } rounded p-3"
                target="_blank"
              >
                <div id="avatar-developer">
                  <img
                    src="https://avatars.githubusercontent.com/u/69708483?v=4"
                    class="img-fluid rounded-circle"
                    alt="_developer"
                  />
                </div>
                <div class="ms-3">
                  <span>
                    <span class="fw-bold">Huseyin Ates</span>
                    <span style="font-size: 12px">
                      (JS Developer)
                    </span>
                  </span>
                  <br />
                  <span>
                    <span>
                      <i class="fa-brands fa-github"></i>
                    </span>
                    <span>GitHub</span>
                  </span>
                </div>
                <span class="ms-auto">
                  <i class="fa fa-angle-right"></i>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-search ${
          this.#time === "night" ? "text-white" : "text-muted"
        }"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvas-search-city"
      >
        <i class="fa fa-search fa-xl"></i>
      </button>
    </nav>
    <header class="${
      this.#time === "night"
        ? "bg-dark text-white"
        : "bg-white text-muted shadow"
    } text-center px-3 pb-5">
      <span class="h1">
        <span>
          <i class="fa-solid fa-location-dot"></i>
        </span>
        <span id="timezone">
          ${this.#currentWeather.timezone.split("/")[1]}
        </span>
      </span>
      <br /> <br />
      <span class="h2" id="current-time">${this._getTime()}</span>
      <p class="${this.#time === "night" ? "text-white" : "text-black"} my-1"
        id ="current-weather">
        ${this.#currentWeather._getWeatherForecast().weather}
      </p>
    </header>
    <main class="${
      this.#time === "night" ? "text-white" : "text-muted"
    } text-center px-3">
      <img src="../img/${
        this.#currentWeather._getWeatherForecast().icon
      }" class="img-fluid ${
      this.#time === "night" ? "img-dark" : "img-day"
    }" id="current-weather-icon" width="168" alt="_weather_forecast_icon" />
      <div>
        <span class="h1" id="current-temperature">
          ${Math.round(this.#currentWeather.temperature)}
          <sup>${this.#currentWeather.tempUnit}</sup>
        </span>
        <br />
        <span>
          <i class="fas fa-wind"></i>
        </span>
        <span id="current-windspeed">
          ${this.#currentWeather.windSpeed} ${
      this.#currentWeather.windSpeedUnit
    }
        </span>
      </div>
      <canvas class="mt-4" id="temp-chart"></canvas>
    </main>
    `;

    this.#app.insertAdjacentHTML("afterbegin", currentWeatherHTML);
  }

  // Showing daily weather forecast on the display
  _renderDailyWeather() {
    const footer = document.createElement("footer");
    footer.className = "p-3";

    const dailyWeatherDiv = document.createElement("div");
    dailyWeatherDiv.className = `row flex-nowrap py-3 text-center ${
      this.#time === "night" ? "text-white" : "text-muted"
    }`;
    dailyWeatherDiv.setAttribute("id", "daily-weather");
    dailyWeatherDiv.innerHTML = "";

    this.#dailyWeather.forEach((dailyWeather, index) => {
      const dailyWeatherHTML = `
        <div class="col-6">
          <div class="card ${
            this.#time === "night" ? "bg-dark" : "bg-white shadow"
          } rounded border-0 py-2"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvas-daily-weather"
          daily-weather-data=${index}>
            <div class="card-header border-0 pb-0">
              <img src="../img/${
                dailyWeather._getWeatherForecast().icon
              }" class="img-fluid daily-weather-icon ${
        this.#time === "night" ? "img-dark" : "img-day"
      }" width="84" alt="_weather_forecast_icon" />
              <br />
              <span class="daily-weather ${
                this.#time === "night" ? "text-light" : "text-black"
              }">${dailyWeather._getWeatherForecast().weather}</span>
            </div>
            <div class="card-body">
              <div class="text-center">
                <span>
                  <i class="fa-regular fa-sun"></i>
                  <span class="daily-weather-temperature-max ms-1">
                    ${Math.round(dailyWeather.temperatureMax)}
                  </span>
                </span>
                <span>
                  <sup>${dailyWeather.tempUnit}</sup>
                </span>
              </div>
              <div class="text-center">
                <span>
                  <i class="fa-regular fa-moon"></i>
                  <span class="daily-weather-temperature-min ms-1">
                    ${Math.round(dailyWeather.temperatureMin)}
                  </span>
                </span>
                <span>
                  <sup>${dailyWeather.tempUnit}</sup>
                </span>
              </div>
            </div>
            <div class="card-footer ${
              this.#time === "night" ? "text-light" : "text-black"
            } border-0 pt-0">
              <span class="daily-weather-day">${
                index === 0 ? "Tomorrow" : `${dailyWeather._getDay()}`
              }</span>
            </div>
          </div>
        </div>
        `;

      dailyWeatherDiv.innerHTML += dailyWeatherHTML;
      footer.append(dailyWeatherDiv);
    });

    document.querySelector(".app").append(footer);
  }

  // Updating the current time
  _updateTime = () =>
    setInterval(
      () =>
        (document.querySelector("#current-time").textContent = this._getTime()),
      1000
    );

  // Updating the current and daily weather's data
  _updateData() {
    [
      document.querySelector("#timezone").textContent,
      document.querySelector("#current-weather").textContent,
      document.querySelector("#current-weather-icon").src,
      document.querySelector("#current-temperature").innerHTML,
      document.querySelector("#current-windspeed").textContent,
    ] = [
      this.#currentWeather.timezone.split("/")[1],
      this.#currentWeather._getWeatherForecast().weather,
      `../img/${this.#currentWeather._getWeatherForecast().icon}`,
      `
      <span class="h1" id="current-temperature">
        ${Math.round(this.#currentWeather.temperature)}
        <sup>${this.#currentWeather.tempUnit}</sup>
      </span>
      `,
      `${this.#currentWeather.windSpeed} ${this.#currentWeather.windSpeedUnit}`,
    ];
  }

  // Setting offcanvases
  _setOffcanvases() {
    document.querySelectorAll(".offcanvas").forEach((offcanvas) => {
      offcanvas.className += ` ${
        this.#time === "night"
          ? "bg-black text-white"
          : "bg-white text-muted shadow"
      }`;

      if (offcanvas.classList.contains("offcanvas-bottom"))
        offcanvas.style.height = `${
          100 -
          ((document.querySelector("nav").getBoundingClientRect().height + 20) *
            100) /
            document.body.getBoundingClientRect().height
        }%`;
    });

    document
      .querySelectorAll(".offcanvas-title")
      .forEach(
        (offcanvasTitle) =>
          (offcanvasTitle.className += ` ${
            this.#time === "night" ? "text-white" : "text-black"
          }`)
      );

    document
      .querySelectorAll(".offcanvas-input")
      .forEach(
        (offcanvasInput) =>
          (offcanvasInput.className += ` ${
            this.#time === "night" ? "input-dark" : "input-light"
          }`)
      );

    document
      .querySelectorAll(".btn-close-offcanvas")
      .forEach(
        (btnCloseOffcanvas) =>
          (btnCloseOffcanvas.className += ` ${
            this.#time === "night" ? "text-white" : "text-black"
          }`)
      );

    document
      .querySelector("#btn-other-data")
      .addEventListener("click", () =>
        document
          .querySelector("#btn-other-data")
          .classList.toggle(
            `${this.#time === "night" ? "btn-active-dark" : "btn-active-light"}`
          )
      );
  }

  // Reading the API and getting data from it
  _getWeatherData = (position) =>
    this._callAPI(position)
      .then((promise) => promise.json())
      .then((data) => {
        const {
          temperature_2m_max,
          windspeed_10m_max,
          precipitation_sum,
          rain_sum,
          showers_sum,
          snowfall_sum,
        } = data.daily_units;

        this.#units = {
          temperatureUnit: temperature_2m_max,
          windSpeedUnit: windspeed_10m_max,
          precipitationUnit: precipitation_sum,
          rainSumUnit: rain_sum,
          showersSumUnit: showers_sum,
          snowfallSumUnit: snowfall_sum,
        };

        this._setTheme(data);
        this._createCurrentWeather(data);
        this._createDailyWeather(data);
        this._renderCurrentWeather();
        this._renderDailyWeather();
        this._createTempChart(data);
        this._updateTime();

        setInterval(
          () =>
            this._callAPI(position)
              .then((promise) => promise.json())
              .then((data) => {
                this._createCurrentWeather(data);
                this._updateData();
                this._createTempChart(data);
                this._setTheme(data);
              }),
          60000
        );

        this._setOffcanvases();
      });
  // .finally();

  // Showing error message to user
  _showError(err) {
    const modalError = `
    <div class="modal fade" id="modal-error" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-white text-muted rounded shadow border-0">
          <div class="modal-header pb-0 border-0">
            <h6 class="modal-title text-primary mx-auto mb-0">
              <span>
                <i class="fa fa-warning text-primary"></i>
              </span>
              <span>Error</span>
            </h6>
          </div>
          <div class="modal-body">
            <p class="text-center text-muted mb-0" id="modal-error-text">${err}</p>
          </div>
          <div class="modal-footer py-0 border-0">
            <button
              type="button"
              class="btn text-primary mx-auto px-4 py-2"
              data-bs-dismiss="modal"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
      `;

    this.#app.insertAdjacentHTML("beforeend", modalError);
    $("#modal-error").modal("show");
  }

  // Getting location permission from user
  _getPermission = () =>
    navigator.geolocation.getCurrentPosition(
      (position) => this._getWeatherData(position),
      () =>
        this._showError(
          "You have to allow the location permission to use this app."
        )
    );

  // Getting the current daily weather's data (clicked)
  _getCurrentDailyWeather(e) {
    const btnOtherData = document.querySelector("#btn-other-data");
    btnOtherData.classList.remove("d-none");
    btnOtherData.classList.remove(
      `${this.#time === "night" ? "btn-active-dark" : "btn-active-light"}`
    );

    [btnOtherData.style.color, btnOtherData.style.border] = [
      `${
        this.#time === "night"
          ? `${this.#colors.white}`
          : `${this.#colors.black}`
      }`,
      `${
        this.#time === "night"
          ? `1px solid ${this.#colors.white}`
          : `1px solid ${this.#colors.black}`
      }`,
    ];

    $("#collapse-other-data").collapse("hide");

    const clickedCard = e.target.closest(".card");

    if (!clickedCard) return;

    this.#currentDailyWeather =
      this.#dailyWeather[clickedCard.getAttribute("daily-weather-data")];

    const [
      currentDailyWeatherLocation,
      currentDailyWeatherImg,
      currentDailyWeatherDay,
      currentDailyWeatherWeather,
      currentDailyWeatherTemperatureMax,
      currentDailyWeatherTemperatureMin,
      currentDailyWeatherWindSpeed,
      othersCurrentWeatherData,
      btnCloseOffCanvas,
    ] = [
      document.querySelector("#current-daily-weather-location"),
      document.querySelector("#current-daily-weather-img"),
      document.querySelector("#current-daily-weather-day"),
      document.querySelector("#current-daily-weather-weather"),
      document.querySelector("#current-daily-weather-temperature-max"),
      document.querySelector("#current-daily-weather-temperature-min"),
      document.querySelector("#current-daily-weather-windspeed"),
      document.querySelector(".others-current-weather-data"),
      document.querySelectorAll(".btn-close-offcanvas"),
    ];

    [
      currentDailyWeatherLocation.innerHTML,
      currentDailyWeatherImg.src,
      currentDailyWeatherDay.textContent,
      currentDailyWeatherWeather.textContent,
      currentDailyWeatherTemperatureMax.innerHTML,
      currentDailyWeatherTemperatureMin.innerHTML,
      currentDailyWeatherWindSpeed.innerHTML,
      othersCurrentWeatherData.innerHTML,
    ] = [
      `
    <span>
      <i class="fa-solid fa-location-dot"></i>
    </span>
    <span id="timezone">
      ${this.#currentWeather.timezone.split("/")[1]}
    </span>
      `,
      `../img/${this.#currentDailyWeather._getWeatherForecast().icon}`,
      this.#currentDailyWeather._getDay(),
      this.#currentDailyWeather._getWeatherForecast().weather,
      `
    <span>
      <i class="fa-regular fa-sun"></i>
      <span class="ms-1">
        ${Math.round(this.#currentDailyWeather.temperatureMax)}
        <sup>${this.#units.temperatureUnit}</sup>
      </span>
    </span>
      `,
      `
    <span>
      <i class="fa-regular fa-moon"></i>
      <span class="ms-1">
        ${Math.round(this.#currentDailyWeather.temperatureMin)}
        <sup>${this.#units.temperatureUnit}</sup>
      </span>
    </span>
      `,
      `
    <span>
      <i class="fas fa-wind"></i>
      <span>${this.#currentDailyWeather.windSpeed} ${
        this.#units.windSpeedUnit
      }</span>
    </span>  
      `,
      `
      ${
        [
          this.#currentDailyWeather.precipitationSum,
          this.#currentDailyWeather.rainSum,
          this.#currentDailyWeather.showersSum,
          this.#currentDailyWeather.snowfallSum,
        ].some((data) => data > 0)
          ? `
      <hr class="${
        this.#time === "night" ? "hr-white" : "hr-black"
      } mx-auto w-50" />
      <span>
        <p class="mb-0">Precipitation sum: ${
          this.#currentDailyWeather.precipitationSum
        } ${this.#units.precipitationUnit}</p>
        <p class="mb-0">Showers sum: ${this.#currentDailyWeather.showersSum} ${
              this.#units.showersSumUnit
            }</p>
        <p class="mb-0">Rain sum: ${this.#currentDailyWeather.rainSum} ${
              this.#units.rainSumUnit
            }</p>
        <p class="mb-0">Snow fall: ${this.#currentDailyWeather.snowfallSum} ${
              this.#units.snowfallSumUnit
            }</p>
      </span>
    `
          : btnOtherData.classList.add("d-none")
      }
      `,
    ];
  }
}

const app = new App("app d-flex flex-column");
