import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Button,
  Col,
  Collapse,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
  Modal,
  Offcanvas,
  Row,
} from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleLeft,
  faBars,
  faLocationDot,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import useInput from "../hooks/use-input";
import Brand from "./Brand";
import SearchedCityPage from "../pages/SearchedCity";

const Header = ({ searched }) => {
  const [modal, setModal] = useState(false);
  const [offcanvas, setOffcanvas] = useState(false);
  const [collapse, setCollapse] = useState(false);

  const locationsState = useSelector((state) => state.location);
  const { location } = locationsState;

  const {
    state: { input: city },
    handleOnChange: handleCityOnChange,
  } = useInput();

  const handleModal = () => setModal(!modal);
  const handleOffcanvas = () => setOffcanvas(!offcanvas);
  const handleCollapse = () => setCollapse(!collapse);

  return (
    <>
      <header className="App-header py-3">
        <Container>
          <Row className="align-items-center">
            <Col xs="2">
              {searched ? (
                <Link to="..">
                  <FontAwesomeIcon icon={faAngleLeft} size="xl" />
                </Link>
              ) : (
                <FontAwesomeIcon
                  className="d-md-none"
                  icon={faBars}
                  size="xl"
                  style={{ cursor: "pointer" }}
                  onClick={handleOffcanvas}
                />
              )}
            </Col>
            <Col xs="8">
              {location !== null && (
                <span className="h4">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span className="ms-2">{location}</span>
                </span>
              )}
            </Col>
            <Col xs="2">
              {!searched && (
                <FontAwesomeIcon
                  icon={faSearch}
                  size="xl"
                  style={{ cursor: "pointer" }}
                  onClick={handleModal}
                />
              )}
            </Col>
          </Row>
        </Container>
      </header>
      <Modal
        show={modal}
        onHide={handleModal}
        fullscreen="md-down"
        centered
        scrollable
      >
        <Modal.Header className="d-block">
          <div className="d-flex align-items-start mb-3">
            <span className="h4">Search City</span>
            <FontAwesomeIcon
              icon={faTimes}
              size="xl"
              className="ms-auto"
              style={{ cursor: "pointer" }}
              onClick={handleModal}
            />
          </div>
          <FloatingLabel label="Search City">
            <Form.Control
              type="text"
              name="city"
              placeholder="Searcy City"
              value={city}
              onChange={handleCityOnChange}
              autoComplete="off"
            />
          </FloatingLabel>
        </Modal.Header>
        <Modal.Body style={city === "" ? undefined : { height: "300px" }}>
          <ListGroup>
            <SearchedCityPage city={city} />
          </ListGroup>
        </Modal.Body>
      </Modal>
      <Offcanvas show={offcanvas} onHide={handleOffcanvas} placement="start">
        <Offcanvas.Header>
          <Brand
            className="d-flex align-items-center text-center"
            onClick={handleOffcanvas}
          />
          <FontAwesomeIcon
            icon={faTimes}
            size="xl"
            className="ms-auto"
            style={{ cursor: "pointer" }}
            onClick={handleOffcanvas}
          />
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Offcanvas.Title>Developer Contact</Offcanvas.Title>
          <Button
            type="button"
            variant="link"
            className="d-flex align-items-center w-100 px-0"
            onClick={handleCollapse}
          >
            <img
              src="https://avatars.githubusercontent.com/u/69708483?s=400&u=7e5e2f43e9d02dec298e7bb375f265db157e20c1&v=4"
              width={48}
              alt="Developer Icon"
              className="rounded-circle"
            />
            <div className="text-start ms-3">
              <span>Huseyin Ates</span>
              <br />
              <span className="text-muted">React Developer</span>
            </div>
            <div className="ms-auto">
              <motion.div
                animate={collapse ? { rotateZ: 180 } : { rotateZ: 0 }}
                transition={{ ease: "easeOut", duration: 0.5 }}
              >
                <FontAwesomeIcon icon={faAngleDown} size="lg" />
              </motion.div>
            </div>
          </Button>
          <Collapse in={collapse}>
            <ListGroup>
              <ListGroup.Item className="d-flex align-items-center px-2">
                <FontAwesomeIcon icon={faGithub} size="lg" />
                <a
                  href="https://www.github.com/hsyntes/"
                  className="d-block w-100 ms-3"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex align-items-center px-2">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
                <a
                  href="https://www.linkedin.com/in/hsyntes/"
                  className="d-block w-100 ms-3"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </ListGroup.Item>
            </ListGroup>
          </Collapse>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
