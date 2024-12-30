import React from 'react';
import { useNavigate , useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from '../Components/NavBar';

const MenuPage = () => {
    const { teamName } = useParams();
    const navigate = useNavigate();
    
    return (
        <>
            <NavBar pageName="Menu" showMenu={false}/>
            <Container id="menuContainer" className='mx-0'>
                <Row className='text-center' xs={1}>
                    <Col className="pb-3 d-grid" md={4}>
                        <Button onClick={() => navigate(`/new-game/${teamName}`)}>Record Game</Button>
                    </Col>
                    <Col className="pb-3 d-grid" md={4}>
                        <Button onClick={() => navigate(`/manage-team/${teamName}`)}>Manage Team</Button>
                    </Col>
                    <Col className="pb-3 d-grid" md={4}>
                        <Button onClick={() => navigate(`/player-stats/${teamName}`)}>Player Stats</Button>
                    </Col>
                    <Col className="pb-3 d-grid" md={4}>
                        <Button onClick={() => navigate(`/team-stats/${teamName}`)}>Team Stats</Button>
                    </Col>
                    <Col className="pb-3 d-grid">
                        <Button onClick={() => navigate('/')}>Log Out</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default MenuPage;
