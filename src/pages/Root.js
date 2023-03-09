import { Suspense } from "react";
import { useDispatch } from "react-redux";
import { Await, defer, useLoaderData } from "react-router-dom";
import { locationSliceActions } from "../store/location/location-slice";
import Splash from "../components/Splash";
import Root from "../components/Root";
import getPosition from "../util/getPosition";
import fetchData from "../util/fetchData";
import setLocation from "../util/setLocation";

const RootLayout = () => {
  const { weather } = useLoaderData();
  const dispatch = useDispatch();

  return (
    <Suspense fallback={<Splash />}>
      <Await resolve={weather}>
        {(weather) => {
          const { daily, daily_units, hourly, current_weather } = weather.data;
          const { address } = weather.location;
          const location = setLocation(address);

          const {
            weathercode: hourlyWeatherCodes,
            time: hourlyTimes,
            temperature_2m: hourlyTemperatures,
          } = hourly;

          const {
            temperature_2m_max: temperature_unit,
            windspeed_10m_max: windspeed_unit,
          } = daily_units;

          dispatch(locationSliceActions.locate(location));

          return (
            <Root
              daily={daily}
              units={{ temperature_unit, windspeed_unit }}
              current_weather={current_weather}
              hourly={{
                hourlyWeatherCodes,
                hourlyTimes,
                hourlyTemperatures,
              }}
            />
          );
        }}
      </Await>
    </Suspense>
  );
};

const weatherLoader = async () => {
  const position = await getPosition();
  const { latitude, longitude } = position.coords;

  const response = await fetch(
    `https://eu1.locationiq.com/v1/reverse?key=pk.c900545b9932c55be279d9c4a34436eb&lat=${latitude}&lon=${longitude}&format=json`
  );

  const data = await fetchData(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall,snow_depth,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windspeed_10m_min&current_weather=true&timezone=auto`
  );

  const location = await response.json();

  return { data, location };
};

export const loader = () => defer({ weather: weatherLoader() });

export default RootLayout;
