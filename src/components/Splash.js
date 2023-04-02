import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import logo from "../logo.svg";
import { Toast, ToastContainer } from "react-bootstrap";
import { useEffect, useState } from "react";

const Splash = () => {
  const animationState = useSelector((state) => state.animation);
  const [toast, setToast] = useState(false);
  const { splash, flicker } = animationState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setToast(true);
    }, 3000);

    return () => clearTimeout(identifier);
  }, [toast]);

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
      <ToastContainer position="bottom-center" style={{ marginBottom: "5vh" }}>
        <Toast show={toast} animation={true}>
          <Toast.Header closeButton={false}>
            <img src={logo} width={24} alt="App logo" />
            <h4 className="ms-2">React-Weather</h4>
          </Toast.Header>
          <Toast.Body>
            Please make sure that you have your location turned on.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Splash;
