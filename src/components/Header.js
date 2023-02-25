import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Col,
  Container,
  FloatingLabel,
  Form,
  ListGroup,
  Modal,
  Offcanvas,
  Row,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faBars,
  faLocationDot,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import useInput from "../hooks/use-input";
import Brand from "./Brand";
import SearchedCityPage from "../pages/SearchedCity";

const Header = ({ searched }) => {
  const [modal, setModal] = useState(false);
  const [offcanvas, setOffcanvas] = useState(false);
  const locationsState = useSelector((state) => state.location);

  const { location } = locationsState;

  const {
    state: { input: city },
    handleOnChange: handleCityOnChange,
  } = useInput();

  const handleModal = () => setModal(!modal);
  const handleOffcanvas = () => setOffcanvas(!offcanvas);

  return (
    <>
      <header className="App-header py-3">
        <Container>
          <Row className="align-items-center">
            <Col xs="2">
              {searched ? (
                <Link to=".." className="d-md-none">
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
              <span className="h2">
                <FontAwesomeIcon icon={faLocationDot} />
                <span className="ms-2">{location}</span>
              </span>
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
        <Offcanvas.Body></Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
