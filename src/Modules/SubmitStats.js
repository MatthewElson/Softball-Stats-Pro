import React, { useState }  from 'react';
// import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import Globals from '../Globals';

const SubmitStats = ({popupToggle, setPopupToggle, setSecret, setOpponentTeamName, handleSubmitStatsForm, setGameType, saveGameResult}) => {
    const gameTypes = ["regular", "playoff", "practice"];
    return (
        <div className="modal show" style={{ display: 'block', position: 'initial' }} >
            <Modal show={popupToggle} onHide={() => Globals.toggleCB(setPopupToggle)}>
                <Modal.Header closeButton>
                <Modal.Title>Submit Stats</Modal.Title>
                </Modal.Header>
        
                <Form onSubmit={handleSubmitStatsForm}>
                    <Modal.Body>
                        <Form.Group className='mb-2' controlId='opponentTeamName'>
                            <Form.Label>Opponent Team Name</Form.Label>
                            <Form.Control type='text' onChange={e => setOpponentTeamName(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className='mb-2' controlId='gameType'>
                            <Form.Label>Game Type</Form.Label>
                            {gameTypes.map((gameType, idx) =>
                                <Form.Check
                                    label= {gameType.replace(/(.)/, (_, chr) => chr.toUpperCase())}
                                    name= {"gameTypeRadioButton"}
                                    type={'radio'}
                                    id={gameType + "Game"}
                                    key={gameType + idx}
                                    onChange={() => setGameType(gameType)}
                                />
                            )}
                        </Form.Group>
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
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <Toast show={saveGameResult.show} onClose={() => Globals.toggleCB(setPopupToggle)} delay={2000} autohide={saveGameResult.success} bg={saveGameResult.success ? 'success' : 'danger'}>
                        <Toast.Body>{saveGameResult.message}</Toast.Body>
                    </Toast>
                </div>
            </Modal>
        </div>
    )
}

export default SubmitStats;
