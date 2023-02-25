import { Suspense } from "react";
import { useDispatch } from "react-redux";
import {
  Await,
  defer,
  Outlet,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { locationSliceActions } from "../store/location/location-slice";
import { setTheme } from "../store/theme/theme-slice";
import Splash from "../components/Splash";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Panel from "../components/Panel";
import DailyWeatherPage from "./DailyWeather";
import getPosition from "../functions/getPosition";
import fetchData from "../functions/fetchData";
import setLocation from "../functions/setLocation";

const RootLayout = () => {
  const { weather } = useLoaderData();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <Suspense fallback={<Splash />}>
      <Await resolve={weather}>
        {(weather) => {
          const { daily, daily_units, hourly, current_weather } = weather.data;
          const { sunset: sunsets, sunrise: sunrises } = daily;
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

          // Updating theme with Redux Thunk
          dispatch(
            setTheme(
              new Date(),
              new Date(sunsets.at(0)),
              new Date(sunrises.at(0))
            )
          );

          dispatch(locationSliceActions.locate(location));

          return (
            <motion.div
              className="App"
              animate={{ opacity: [0, 1], scale: [0.95, 1] }}
              transition={{ ease: "easeInOut", duration: 0.35 }}
            >
              <Panel>
                <DailyWeatherPage
                  daily={daily}
                  units={{ temperature_unit, windspeed_unit }}
                />
              </Panel>
              <section
                id="content-section"
                className="text-center"
                style={{ width: "100%" }}
              >
                <Header />
                <main className="App-main">
                  {navigation.state === "loading" ? (
                    <Spinner />
                  ) : (
                    <Container>
                      <Outlet
                        context={{
                          current_weather: current_weather,
                          daily: daily,
                          units: { temperature_unit, windspeed_unit },
                          hourly: {
                            hourlyWeatherCodes,
                            hourlyTimes,
                            hourlyTemperatures,
                          },
                        }}
                      />
                    </Container>
                  )}
                </main>
              </section>
            </motion.div>
          );
        }}
      </Await>
    </Suspense>
  );
};

export const weatherLoader = async () => {
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
