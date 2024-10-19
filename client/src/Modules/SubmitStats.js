import React  from 'react';
// import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Globals from '../Globals';

const SubmitStats = ({popupToggle, setPopupToggle, setSecret}) => {
    return (
        <div className="modal show" style={{ display: 'block', position: 'initial' }} >
            <Modal show={popupToggle} onHide={() => Globals.toggleCB(setPopupToggle)}>
                <Modal.Header closeButton>
                <Modal.Title>Submit Stats</Modal.Title>
                </Modal.Header>
        
                <Form>
                    <Modal.Body>
                        <Form.Group className="mb-2" controlId="formPassword">
                            <Form.Label>Team Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setSecret(e.target.value)} required/>
                            {/* <input id="secret" type="password" name="secret" value={secret} /> */}
                        </Form.Group>
                    </Modal.Body>
            
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => Globals.toggleCB(setPopupToggle)}>Close</Button>
                        <Button type="submit" variant="success">Submit Stats</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

export default SubmitStats;
