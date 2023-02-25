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
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Panel from "../components/Panel";
import fetchData from "../functions/fetchData";
import DailyWeatherPage from "./DailyWeather";

const SearchedCityDetailPage = () => {
  const { weather } = useLoaderData();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={weather}>
        {(weather) => {
          const { daily, daily_units, hourly, current_weather } = weather.data;
          const { city } = weather;
          dispatch(locationSliceActions.locate(city));

          const {
            weathercode: hourlyWeatherCodes,
            time: hourlyTimes,
            temperature_2m: hourlyTemperatures,
          } = hourly;

          const {
            temperature_2m_max: temperature_unit,
            windspeed_10m_max: windspeed_unit,
          } = daily_units;

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
                <Header searched={true} />
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

export default SearchedCityDetailPage;

export const searchedCityLoader = async (params) => {
  const { searchedCityDetail } = params;

  const [latitude, longitude, city] = [
    Number(searchedCityDetail.split("&").at(2).split("=").at(1)),
    Number(searchedCityDetail.split("&").at(3).split("=").at(1)),
    searchedCityDetail.split("&").at(1).split("=").at(1),
  ];

  const data = await fetchData(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall,snow_depth,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,windspeed_10m_max,windspeed_10m_min&current_weather=true&timezone=auto`
  );

  return { data, city };
};

export const loader = ({ params }) =>
  defer({ weather: searchedCityLoader(params) });
