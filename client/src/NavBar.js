import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Navigation( { teamName }) {
  return (
    <Navbar expand="lg">
      <Container>
        {MenuItems(teamName)}
      </Container>
    </Navbar>
  );
}

function MenuItems(teamName) {
  return (
    <>
        <Navbar key={'xs'} expand={'xs'}>
          <Container fluid>
            <Navbar.Brand>{teamName}</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-xs`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-xs`}
              aria-labelledby={`offcanvasNavbarLabel-expand-xs`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-xs`}>
                  {teamName}
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href={`/new-game/${teamName}`}>New Game</Nav.Link>
                  <Nav.Link href={`/team-stats/${teamName}`}>Stats</Nav.Link>
                  <Nav.Link href={`/manage-team/${teamName}`}>Manage Team</Nav.Link>
                  <Nav.Link href="/">Sign Out</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    </>
  );
}

export default Navigation;
