import { useSelector } from "react-redux";
import { Card, Col, Row } from "react-bootstrap";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faTemperatureHalf,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import getWeatherData from "../util/getWeatherData";

const CustomTooltip = ({ active, payload, unit }) => {
  if (active && payload && payload.length) {
    const { code, hour, temperature } = payload.at(0).payload;

    return (
      <Card className="shadow">
        <Card.Header className="pb-0">
          <Card.Title className="fs-6">{hour}</Card.Title>
        </Card.Header>
        <Card.Body className="d-flex align-items-center pt-0">
          <img
            src={getWeatherData(code).icon.day}
            width={24}
            alt="Tooltip Icon"
          />
          <span className="ms-1">
            {getWeatherData(code).forecast_short}, {Math.round(temperature)}
            <sup>{unit}</sup>
          </span>
        </Card.Body>
      </Card>
    );
  }

  return null;
};

const Weather = ({ weather, units, date, hourlyWeathers }) => {
  const animationState = useSelector((state) => state.animation);
  const { floating } = animationState;

  const { temperature, weathercode, windspeed } = weather;
  const { temperature_unit, windspeed_unit } = units;

  const { icon, forecast } = getWeatherData(weathercode);

  const { codes, hours, temperatures } = hourlyWeathers;

  const data = hours.map((hour, index) => {
    return {
      code: codes[index],
      hour: hour.split("T").at(1),
      temperature: temperatures[index],
    };
  });

  return (
    <>
      <h6 className="fs-1">{date}</h6>
      <span className="d-block my-2">{forecast}</span>
      <Row className="align-items-center my-5" style={{ overflow: "hidden" }}>
        <Col xs="3" className="text-end">
          {temperature.hasOwnProperty("max") ? (
            <>
              <FontAwesomeIcon icon={faSun} />
              <span className="fs-3 ms-1">{Math.round(temperature.max)}</span>
              <sup className="fs-5">{temperature_unit}</sup>
              <br />
              <FontAwesomeIcon icon={faMoon} />
              <span className="fs-3 ms-1">{Math.round(temperature.min)}</span>
              <sup className="fs-5">{temperature_unit}</sup>
            </>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faTemperatureHalf}
                size="xl"
                className="me-1"
              />
              <span className="fs-1">{Math.round(temperature)}</span>
              <br />
              <span className="fs-2">{temperature_unit}</span>
            </>
          )}
        </Col>
        <Col xs="6">
          <motion.img
            src={icon.day}
            width={192}
            alt="Weather Icon"
            animate={floating}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="weather-icon img-fluid"
            loading="lazy"
          />
        </Col>
        <Col xs="3" className="text-start">
          <FontAwesomeIcon icon={faWind} className="me-1" size="xl" />
          {windspeed.hasOwnProperty("max") ? (
            <span className="fs-3">
              {Math.round(
                (Math.round(windspeed.max) - Math.round(windspeed.min)) / 2
              )}
            </span>
          ) : (
            <span className="fs-1">{Math.round(windspeed)}</span>
          )}
          <br />
          <span className="fs-4">{windspeed_unit}</span>
        </Col>
      </Row>
      <Row className="justify-content-center my-3" style={{ height: "200px" }}>
        <Col md="10" className="text-center">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart width="100%" height={200} data={data}>
              <defs>
                <linearGradient
                  id="linear-gradient"
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={1}
                >
                  <stop offset="0%" stopColor="#F5BC00" stopOpacity={1} />
                  <stop offset="100%" stopColor="#1f63ee" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" />
              <Tooltip
                wrapperStyle={{ outline: "none" }}
                content={<CustomTooltip />}
                unit={temperature_unit}
                animationEasing="ease-out"
                animationDuration={1000}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                fillOpacity={1}
                fill="url(#linear-gradient)"
                stroke="#1f63ee"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </>
  );
};

export default Weather;
