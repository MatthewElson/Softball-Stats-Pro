import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Globals from '../Globals';

const CreateNewPlayer = ({createNewPlayerToggle, playerName, handleCreateNewPlayer, idx}) => {

    return (
        <Modal id="createPlayerModal" centered show={createNewPlayerToggle} className='grayBack' onHide={() => Globals.toggleCB(createNewPlayerToggle)}>
            <Modal.Header closeButton className='pb-0'>
                <Modal.Title className='mb-2'>Create New Player</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form.Group>
                    <Container>
                        <Row>
                            <Col className='ps-0' xs={10}>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" required defaultValue={playerName}/>
                            </Col>
                            <Col className='px-0'>
                                <Form.Label>Sub?</Form.Label>
                                <Form.Check type="checkbox"/>
                            </Col>
                        </Row>
                    </Container>
                </Form.Group>
            </Modal.Body>
        
            <Modal.Footer>
                <Button variant="danger" onClick={() => Globals.toggleCB(createNewPlayerToggle)} >Close</Button>
                <Button type="submit" variant="success" onClick={handleCreateNewPlayer(playerName, idx)}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateNewPlayer;
