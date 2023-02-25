import { Container, Nav, Navbar } from "react-bootstrap";
import Brand from "./Brand";

const Panel = ({ children }) => {
  return (
    <aside className="App-aside border-end">
      <Navbar>
        <Container className="d-flex flex-column align-items-start">
          <Brand />
          <Nav className="my-4">{children}</Nav>
        </Container>
      </Navbar>
    </aside>
  );
};

export default Panel;
