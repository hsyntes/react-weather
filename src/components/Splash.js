import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import logo from "../logo.svg";

const Splash = () => {
  const animationState = useSelector((state) => state.animation);
  const { splash, flicker } = animationState;

  return (
    <>
      <div id="spinner">
        <motion.img
          src={logo}
          width={96}
          alt="Spinner Logo"
          animate={splash}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: 4 }}
        />
        <motion.p
          className="d-flex align-items-center my-4"
          animate={flicker}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: 1.25 }}
        >
          <span>Finding your location</span>
          <FontAwesomeIcon icon={faSearch} className="ms-2" />
        </motion.p>
      </div>
    </>
  );
};

export default Splash;
