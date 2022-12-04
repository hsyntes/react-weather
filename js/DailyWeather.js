// Inheritance from Weather
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
  // Encapsulation
  _getDay = () =>
    new Intl.DateTimeFormat(navigator.language, {
      weekday: "long",
    }).format(new Date(this.date));
}
