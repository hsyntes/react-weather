import { useOutletContext, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Weather from "../components/Weather";
import getDate from "../util/getDate";

const DailyWeatherDetailPage = () => {
  const params = useParams();
  const { units, hourly, daily } = useOutletContext();

  const dayIndex = Number(
    params.dailyWeatherDetail.split("&").at(1).split("=").at(1)
  );

  const { hourlyWeatherCodes, hourlyTimes, hourlyTemperatures } = hourly;

  const {
    temperature_2m_max: temperatures_max,
    temperature_2m_min: temperatures_min,
    weathercode: weathercodes,
    windspeed_10m_max: windspeeds_max,
    windspeed_10m_min: windspeeds_min,
    time: times,
  } = daily;

  const temperature = {
    max: temperatures_max[dayIndex],
    min: temperatures_min[dayIndex],
  };

  const weathercode = weathercodes[dayIndex];

  const windspeed = {
    max: windspeeds_max[dayIndex],
    min: windspeeds_min[dayIndex],
  };

  const dailyWeather = { temperature, weathercode, windspeed };

  const date = getDate(new Date(times[dayIndex]), {
    weekday: "long",
    day: "numeric",
  });

  const index = hourlyTimes.findIndex(
    (hourlyTime) =>
      Number(hourlyTime.split("T").at(0).split("-").at(2)) ===
      Number(date.split(" ").at(0))
  );

  const slicedHours = hourlyTimes.slice(index, index + 24);

  const slicedWeatherCodes = hourlyWeatherCodes.slice(index, index + 24);

  const slicedTemperatures = hourlyTemperatures.slice(index, index + 24);

  const hourlyWeathers = {
    hours: slicedHours,
    codes: slicedWeatherCodes,
    temperatures: slicedTemperatures,
  };

  return (
    <AnimatePresence>
      <motion.div
        key={dayIndex}
        animate={{ opacity: [0, 1], scale: [0.95, 1] }}
        transition={{ ease: "easeOut", duration: 0.35, delay: 0.15 }}
      >
        <Weather
          weather={dailyWeather}
          units={units}
          date={date.split(" ").at(1)}
          hourlyWeathers={hourlyWeathers}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default DailyWeatherDetailPage;
