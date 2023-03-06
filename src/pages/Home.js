import { useOutletContext } from "react-router-dom";
import Weather from "../components/Weather";
import getDate from "../util/getDate";

const HomePage = () => {
  const { units, hourly, current_weather } = useOutletContext();

  const { hourlyWeatherCodes, hourlyTimes, hourlyTemperatures } = hourly;

  const [date, currentHour] = [
    "Today ".concat(
      getDate(new Date(), { hour: "numeric", minute: "numeric" })
    ),
    Number(getDate(new Date(), { hour: "numeric", hourCycle: "h23" })),
  ];

  const index = hourlyTimes.findIndex(
    (hourlyTime) =>
      Number(hourlyTime.split("T").at(1).split(":").at(0)) === currentHour
  );

  const slicedHours = hourlyTimes.slice(index, index + 13);
  const slicedWeatherCodes = hourlyWeatherCodes.slice(index, index + 13);
  const slicedTemperatures = hourlyTemperatures.slice(index, index + 13);

  const hourlyWeathers = {
    hours: slicedHours,
    codes: slicedWeatherCodes,
    temperatures: slicedTemperatures,
  };

  return (
    <Weather
      weather={current_weather}
      units={units}
      date={date}
      hourlyWeathers={hourlyWeathers}
    />
  );
};

export default HomePage;
