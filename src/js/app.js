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
          code: "Clear",
          icon: this.time === "night" ? "night.png" : "sun.png",
        };

      case 1:
        return {
          weather: "Mainly clear, partly cloudy and overcast",
          code: "Clear",
          icon: this.time === "night" ? "night.png" : "sun.png",
        };

      case 2:
        return {
          weather: "Mainly clear, partly cloudy and overcast",
          code: "Partly Cloudy",
          icon:
            this.time === "night"
              ? "partly-cloudy-night.png"
              : "partly-cloudy-day.png",
        };

      case 3:
        return {
          weather: "Mainly clear, partly cloudy and overcast",
          code: "Cloudy",
          icon: "cloudy.png",
        };

      case 45:
      case 48:
        return {
          weather: "Fog and depositing rime fog",
          code: "Foggy",
          icon: "fog.png",
        };

      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
        return {
          weather: "Drizzle: light, moderate and dense intensity",
          code: "Light rainly",
          icon: "light-rain.png",
        };

      case 61:
      case 63:
      case 65:
        return {
          weather: "Rain: slight, moderate and heavy intensity",
          code: "Slight rainly",
          icon: "rain.png",
        };

      case 66:
      case 67:
        return {
          weather: "Freezing rain: light and heavy intensity",
          code: "Heavy rainly",
          icon: "heavy-rain.png",
        };

      case 71:
      case 73:
      case 75:
      case 77:
        return {
          weather: "Snowfall: slight, moderate and heavy intensity",
          code: "Snowly",
          icon: "snow.png",
        };

      case 80:
      case 81:
      case 82:
        return {
          weather: "Rain showers: slight, moderate and violent",
          code: "Heavy rainly",
          icon: "heavy-rain.png",
        };

      case 85:
      case 86:
        return {
          weather: "Snow showers slight and heavy",
          code: "Snowly",
          icon: "snow.png",
        };

      case 95:
      case 96:
        return {
          weather: "Thunderstorm: slight or moderate",
          code: "Thunderstorm",
          icon: "storm.png",
        };

      case 99:
        return {
          weather: "Thunderstorm with slight and heavy hail",
          code: "Thunderstorm",
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
  #currentWeather;

  #dailyWeather = [];

  #temperatureUnit;
  #windSpeedUnit;
  #time;

  constructor() {
    this._getPermission();
  }

  // Setting the theme by time
  _setTheme(data) {
    const { sunrise, sunset } = data.daily;

    const [sunsetHour, sunsetMinute] = sunset[0].slice(-5).split(":");
    const [sunriseHour, sunriseMinute] = sunrise[0].slice(-5).split(":");

    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    if (currentHour > 12) {
      currentHour > Number(sunsetHour)
        ? (this.#time = "night")
        : (this.#time = "day");

      if (currentHour === Number(sunsetHour))
        currentMinute > Number(sunsetMinute)
          ? (this.#time = "night")
          : (this.#time = "day");
    } else {
      currentHour < Number(sunriseHour)
        ? (this.#time = "night")
        : (this.#time = "day");

      if (currentHour === Number(sunriseHour))
        currentMinute < Number(sunriseMinute)
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
          <div class="list-group">
            <div class="list-group-item border-0 ps-0">
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
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn ${this.#time === "night" ? "text-white" : "text-muted"}"
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
        <span>
          ${this.#currentWeather.timezone.split("/")[1]}
        </span>
      </span>
      <br />
      <span class="h2">
        ${new Intl.DateTimeFormat(navigator.language, {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date())}
      </span>
      <p class="${this.#time === "night" ? "text-white" : "text-black"} mt-3">
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
    }" width="136" alt="weather_forecast_icon" />
      <div>
        <span class="h1">
          ${this.#currentWeather.temperature}
          <sup>${this.#currentWeather.tempUnit}</sup>
        </span>
        <br />
        <span>
          <i class="fas fa-wind"></i>
        </span>
        <span>
          ${this.#currentWeather.windSpeed} ${
      this.#currentWeather.windSpeedUnit
    }
        </span>
      </div>
    </main>
    `;

    document
      .querySelector(".app")
      .insertAdjacentHTML("afterbegin", currentWeatherHTML);
  }

  // Showing daily weather forecast on the display
  _renderDailyWeather() {
    document.querySelector(
      "#daily-weather"
    ).className = `row flex-nowrap py-3 text-center ${
      this.#time === "night" ? "text-white" : "text-muted"
    }`;

    this.#dailyWeather.forEach((dailyWeather) => {
      const dailyWeatherHTML = `
        <div class="col-6">
          <div class="card ${
            this.#time === "night" ? "bg-dark" : "bg-white shadow"
          } rounded border-0 py-2">
            <div class="card-header border-0 pb-0">
              <img src="../img/${
                dailyWeather._getWeatherForecast().icon
              }" class="img-fluid ${
        this.#time === "night" ? "img-dark" : "img-day"
      }" width="64" alt="weather_forecast_icon" />
              <br />
              <span class="${
                this.#time === "night" ? "text-light" : "text-black"
              }">${dailyWeather._getWeatherForecast().code}</span>
            </div>
            <div class="card-body">
              <div class="text-center">
                <span>
                  <i class="fa-regular fa-sun"></i>
                  ${dailyWeather.temperatureMax}
                </span>
                <span>
                  <sup>${dailyWeather.tempUnit}</sup>
                </span>
              </div>
              <div class="text-center">
                <span>
                  <i class="fa-regular fa-moon"></i>
                  ${dailyWeather.temperatureMin}
                </span>
                <span>
                  <sup>${dailyWeather.tempUnit}</sup>
                </span>
              </div>
            </div>
            <div class="card-footer ${
              this.#time === "night" ? "text-light" : "text-black"
            } border-0 pt-0">
              <span>${dailyWeather._getDay()}</span>
            </div>
          </div>
        </div>
        `;

      document
        .querySelector("#daily-weather")
        .insertAdjacentHTML("beforeend", dailyWeatherHTML);
    });
  }

  // Setting search country modal
  _setModal() {
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

    document.body.insertAdjacentHTML("beforeend", modalSearchCountry);
  }

  // Reading the API and getting data from it
  _getWeatherData = (position) =>
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,showers_sum,snowfall_sum,windspeed_10m_max,sunrise,sunset&current_weather=true&timezone=auto`
    )
      .then((promise) => {
        if (!promise.ok) throw new Error(promise.status);

        return promise.json();
      })
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
        this._setModal();
      })
      .catch((err) => console.error(err.message))
      .finally();

  // Getting location permission from user
  _getPermission = () =>
    navigator.geolocation.getCurrentPosition((position) =>
      this._getWeatherData(position)
    );
}

const app = new App();
