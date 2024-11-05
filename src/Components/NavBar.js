import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Navigation( { teamName, pageName }) {
  return (
    <Navbar expand="lg">
      <Container>
        {MenuItems(teamName, pageName)}
      </Container>
    </Navbar>
  );
}

function MenuItems(teamName, pageName) {
  return (
    <>
        <Navbar key={'xs'} expand={'xs'}>
          <Container fluid>
            <Navbar.Brand><span className='text-primary'><h1>{pageName ? pageName : teamName}</h1></span></Navbar.Brand>
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
                  <Nav.Link href={`/new-game/${teamName}`}><span className='text-primary'>New Game</span></Nav.Link>
                  <Nav.Link href={`/team-stats/${teamName}`}><span className='text-primary'>Stats</span></Nav.Link>
                  <Nav.Link href={`/manage-team/${teamName}`}><span className='text-primary'>Manage Team</span></Nav.Link>
                  <Nav.Link href="/"><span className='text-primary'>Sign Out</span></Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
    </>
  );
}

export default Navigation;
