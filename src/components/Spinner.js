import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import logo from "../logo.svg";

const Spinner = () => {
  const animationState = useSelector((state) => state.animation);
  const { spinner } = animationState;

  return (
    <>
      <div id="spinner">
        <motion.img
          src={logo}
          width={64}
          alt="Spinner Logo"
          initial={{ borderRadius: "100%" }}
          animate={spinner}
          transition={{ repeat: Infinity, ease: "easeInOut", duration: 0.75 }}
        />
      </div>
      {createPortal(
        <div className="modal-backdrop fade show"></div>,
        document.body
      )}
    </>
  );
};

export default Spinner;
