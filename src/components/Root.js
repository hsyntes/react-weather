import { Outlet, useNavigation } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import Panel from "./Panel";
import DailyWeatherPage from "../pages/DailyWeather";
import Header from "./Header";

const Root = ({ daily, units, current_weather, hourly }) => {
  const navigation = useNavigation();

  const { temperature_unit, windspeed_unit } = units;
  const { hourlyWeatherCodes, hourlyTimes, hourlyTemperatures } = hourly;

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
};

export default Root;
