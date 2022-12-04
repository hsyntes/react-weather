// Abstract Class;
class Weather {
  constructor(weatherCode, time, tempUnit, windSpeedUnit) {
    this.weatherCode = weatherCode;
    this.time = time;
    this.tempUnit = tempUnit;
    this.windSpeedUnit = windSpeedUnit;
  }

  // Encapsulation
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
