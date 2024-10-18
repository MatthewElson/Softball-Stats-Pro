import React, { useState }  from 'react';
// import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Globals from '../Globals';
import DndRosterContainer from '../Dnd/Containers/DndRosterContainer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const EditPlayers = ({ lineupToggle, setLineupToggle, handleSubmitForm, allPlayers, setAllPlayers}) => {
    const [lineupCards, setLineupCards] = useState([]);
    // console.log('lineupCards :', lineupCards);
    const playerRoster = [];
    const playerSubs = [];
    allPlayers.forEach(player => player.isSub ? playerSubs.push(player) : playerRoster.push(player));

    return (
        <div className='modal show' style={{ display: 'block', position: 'initial' }}>
            <Modal id="selectPlayersModal" show={lineupToggle} onHide={() => Globals.toggleCB(setLineupToggle)}>
                <Form onSubmit={handleSubmitForm}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Players</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="selectPlayersModelBody">
                        <DndProvider backend={HTML5Backend}>
                            <DndRosterContainer lineupCards={lineupCards} setLineupCards={setLineupCards} allPlayers={allPlayers} setAllPlayers={setAllPlayers}/>
                        </DndProvider>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" type='submit'>
                            Save Edit
                        </Button>
                        <Button variant="secondary" onClick={() => Globals.toggleCB(setLineupToggle)}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

export default EditPlayers;
