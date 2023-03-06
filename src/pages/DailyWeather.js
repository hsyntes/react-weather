import { NavLink } from "react-router-dom";
import { Card, Nav, OverlayTrigger, Popover } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import getWeatherData from "../util/getWeatherData";
import getDate from "../util/getDate";

const DailyWeatherPage = ({ daily, units }) => {
  const {
    time,
    weathercode,
    temperature_2m_max: temperature_max,
    temperature_2m_min: temperature_min,
  } = daily;

  const { temperature_unit } = units;

  const [weathercodes, times] = [weathercode.slice(1), time.slice(1)];

  return weathercodes.map((weathercode, index) => (
    <motion.div
      key={index}
      animate={{ scale: [0, 1] }}
      transition={{ ease: "easeOut", duration: 0.5, delay: 0.15 * index }}
    >
      <Nav.Item>
        <OverlayTrigger
          trigger={["focus", "hover"]}
          placement="right"
          delay={{ show: 150, hide: 350 }}
          overlay={
            <Popover>
              <Popover.Body>
                {index === 0
                  ? "Tomorrow"
                  : getDate(new Date(times[index]), { weekday: "long" })}
              </Popover.Body>
            </Popover>
          }
        >
          <NavLink
            to={`daily-weather/day=${times[index]}&index=${index + 1}`}
            className={({ isActive }) =>
              isActive ? "nav-link active p-0" : "nav-link border  p-0"
            }
          >
            <Card className="border-0">
              <Card.Header>
                <p className="card-text" style={{ fontSize: "14px" }}>
                  {index === 0
                    ? "Tomorrow"
                    : getDate(new Date(times[index]), { weekday: "short" })}
                </p>
              </Card.Header>
              <Card.Body>
                <img
                  src={getWeatherData(weathercode).icon.day}
                  className="weather-icon"
                  alt="Daily Weather Icon"
                  loading="lazy"
                />
                <span>{getWeatherData(weathercode).forecast_short}</span>
              </Card.Body>
              <Card.Footer>
                <center>
                  <FontAwesomeIcon icon={faSun} />
                  <span className="ms-1">
                    {Math.round(temperature_max[index])}
                    <sup>{temperature_unit}</sup>
                  </span>
                  <br />
                  <FontAwesomeIcon icon={faMoon} />
                  <span className="ms-1">
                    {Math.round(temperature_min[index])}
                    <sup>{temperature_unit}</sup>
                  </span>
                </center>
              </Card.Footer>
            </Card>
          </NavLink>
        </OverlayTrigger>
      </Nav.Item>
    </motion.div>
  ));
};

export default DailyWeatherPage;
