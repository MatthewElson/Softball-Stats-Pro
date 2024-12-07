import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';

function Navigation( { teamName = "", pageName = "", showMenu = true }) {
  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg" className='removeMargin removePadding py-2 px-2 mb-4'>
      {MenuItems(teamName, pageName, showMenu )}
    </Navbar>
  );
}

function MenuItems(teamName, pageName, showMenu) {
  return (
    <>
        {/* <Navbar.Brand className='removePadding text-primary'><h1 className='removeMargin removePadding'>{pageName ? pageName : teamName}</h1></Navbar.Brand> */}
        <Navbar.Brand className='removePadding navBarPageTitle'>{pageName ? pageName : teamName}</Navbar.Brand>
        {showMenu && <>
          <Navbar.Toggle className='onlyHamburger' aria-controls="basic-navbar-nav"/>
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
              <Nav className="me-auto">
                <Nav.Link href={`/new-game/${teamName}`}><span className='text-primary'>New Game</span></Nav.Link>
                <Nav.Link href={`/player-stats/${teamName}`}><span className='text-primary'>Players Stats</span></Nav.Link>
                <Nav.Link href={`/team-stats/${teamName}`}><span className='text-primary'>Team Stats</span></Nav.Link>
                <Nav.Link href={`/manage-team/${teamName}`}><span className='text-primary'>Manage Team</span></Nav.Link>
                <Nav.Link href="/"><span className='text-primary'>Sign Out</span></Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          </>}
    </>
  );
}

export default Navigation;
