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
    date
  ) {
    super(weatherCode, time, tempUnit, windSpeedUnit);
    this.temperatureMax = temperatureMax;
    this.temperatureMin = temperatureMin;
    this.date = date;
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

  #dailyWeather = [];

  #temperatureUnit;
  #windSpeedUnit;
  #time;

  constructor(className) {
    this._createApp(className);
  }

  // Creating the app div
  _createApp(className) {
    this.#app = document.createElement("div");
    this.#app.className = className;

    document.body.prepend(this.#app);

    this._getPermission();
  }

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
      this.#temperatureUnit,
      this.#windSpeedUnit,
      timezone,
      temperature,
      windspeed
    );
  }

  // Creating daily weather forecasts for 1 week
  _createDailyWeather(data) {
    const { weathercode, temperature_2m_max, temperature_2m_min, time } =
      data.daily;

    let day = 0;

    while (day < 7) {
      const dailyWeather = new DailyWeather(
        weathercode[day],
        "day",
        this.#temperatureUnit,
        this.#windSpeedUnit,
        temperature_2m_max[day],
        temperature_2m_min[day],
        time[day]
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
                    alt="developer"
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
        data-bs-toggle="modal"
        data-bs-target="#modal-search-country"
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
    } text-center">
      <img src="../img/${
        this.#currentWeather._getWeatherForecast().icon
      }" class="img-fluid ${
      this.#time === "night" ? "img-dark" : "img-day"
    }" id="current-weather-icon" width="168" alt="weather_forecast_icon" />
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
    </main>
    `;

    this.#app.insertAdjacentHTML("afterbegin", currentWeatherHTML);
  }

  // Showing daily weather forecast on the display
  _renderDailyWeather() {
    const footer = document.createElement("footer");
    footer.className = "mt-auto p-3";

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
          } rounded border-0 py-2">
            <div class="card-header border-0 pb-0">
              <img src="../img/${
                dailyWeather._getWeatherForecast().icon
              }" class="img-fluid daily-weather-icon ${
        this.#time === "night" ? "img-dark" : "img-day"
      }" width="84" alt="weather_forecast_icon" />
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

    this.#dailyWeather.forEach((dailyWeather, index) => {
      [
        document.querySelectorAll(".daily-weather-icon").src,
        document.querySelectorAll(".daily-weather").textContent,
        document.querySelectorAll(".daily-weather-temperature-max").textContent,
        document.querySelectorAll(".daily-weather-temperature-min").textContent,
        document.querySelectorAll(".daily-weather-day").textContent,
      ] = [
        `../img/${dailyWeather._getWeatherForecast().icon}`,
        dailyWeather._getWeatherForecast().weather,
        Math.round(dailyWeather.temperatureMax),
        Math.round(dailyWeather.temperatureMin),
        dailyWeather._getDay(),
      ];
    });
  }

  // Setting search country modal
  _setModalSearch() {
    const modalSearchCountry = `
  <div class="modal fade" id="modal-search-country">
    <div
      class="modal-dialog modal-dialog-centered modal-fullscreen-md-down"
    >
      <div class="modal-content ${
        this.#time === "night" ? "bg-black" : "bg-white"
      }">
        <div class="modal-header ${
          this.#time === "night" ? "text-white" : "text-black"
        } border-0">
          <h6 class="mb-0">Search country</h6>
          <button
            type="button"
            class="btn ${this.#time === "night" ? "text-white" : "text-black"}"
            data-bs-dismiss="modal"
          >
            <i class="fa fa-times fa-xl"></i>
          </button>
        </div>
        <div class="modal-body">
          <input
            type="text"
            name="input-search-country"
            id="input-search-country"
            class="form-control ${
              this.#time === "night" ? "bg-dark" : "bg-light"
            } py-3"
            placeholder="Search any country"
          />
        </div>
        <div class="modal-footer border-0"></div>
      </div>
    </div>
  </div>
    `;

    this.#app.insertAdjacentHTML("beforeend", modalSearchCountry);
  }

  // Calling the fetch API
  _callAPI = (position) =>
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum,windspeed_10m_max,sunrise,sunset&current_weather=true&timezone=auto`
    );

  // Reading the API and getting data from it
  _getWeatherData = (position) =>
    this._callAPI(position)
      .then((promise) => promise.json())
      .then((data) => {
        const { temperature_2m_max, windspeed_10m_max } = data.daily_units;

        [this.#temperatureUnit, this.#windSpeedUnit] = [
          temperature_2m_max,
          windspeed_10m_max,
        ];

        this._setTheme(data);

        this._createCurrentWeather(data);
        this._createDailyWeather(data);

        this._renderCurrentWeather();
        this._renderDailyWeather();

        this._updateTime();

        setInterval(
          () =>
            this._callAPI(position)
              .then((promise) => promise.json())
              .then((data) => {
                this._createCurrentWeather(data);
                this._createDailyWeather(data);

                this._updateData();

                this._setTheme(data);
              }),
          60000
        );

        this._setModalSearch();
      });
  // .finally();

  // Showing error message to user
  _showError(err) {
    const modalError = `
    <div class="modal fade" id="modal-error" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-white text-muted rounded shadow border-0">
          <div class="modal-header pb-0 border-0">
            <h6 class="text-primary mx-auto mb-0">
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
}

const app = new App("app d-flex flex-column");
