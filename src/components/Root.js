import { Outlet, useNavigation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";
import Panel from "./Panel";
import DailyWeatherPage from "../pages/DailyWeather";
import Header from "./Header";
import Spinner from "./Spinner";
import { useDispatch } from "react-redux";
import { setTheme } from "../store/theme/theme-slice";

const Root = ({ daily, units, current_weather, hourly, searched }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { temperature_unit, windspeed_unit } = units;
  const { hourlyWeatherCodes, hourlyTimes, hourlyTemperatures } = hourly;

  const { sunset: sunsets, sunrise: sunrises } = daily;

  // Updating theme with Redux Thunk
  dispatch(
    setTheme(new Date(), new Date(sunrises.at(0)), new Date(sunsets.at(0)))
  );

  return (
    <motion.div
      className="App"
      animate={{ opacity: [0, 1], scale: [0.95, 1] }}
      transition={{ ease: "easeInOut", duration: 0.35 }}
    >
      <Panel>
        {navigation.state !== "loading" && (
          <DailyWeatherPage
            daily={daily}
            units={{ temperature_unit, windspeed_unit }}
          />
        )}
      </Panel>
      <section
        id="content-section"
        className="text-center"
        style={{ width: "100%" }}
      >
        <Header searched={searched} />
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
};

export default Root;
