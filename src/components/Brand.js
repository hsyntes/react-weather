import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../logo.svg";

const BREAK_POINT = window.matchMedia("(max-width: 768px)");

const Brand = ({ onClick }) => {
  const [isMobileView, setMobileView] = useState(BREAK_POINT.matches);

  BREAK_POINT.addEventListener("change", (e) => setMobileView(e.matches));

  return (
    <Link
      to="/"
      className="d-flex navbar-brand align-items-center align-self-start text-center"
      onClick={onClick}
    >
      <img src={logo} width={36} alt="App logo" />
      <h1
        className="ms-2"
        style={{ fontSize: isMobileView ? "2.2rem" : "2rem" }}
      >
        WeatherFor
      </h1>
    </Link>
  );
};

export default Brand;
