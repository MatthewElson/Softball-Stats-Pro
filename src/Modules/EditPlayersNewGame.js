import React  from 'react';
// import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Globals from '../Globals';
import DndRosterContainer from '../Dnd/Containers/DndRosterContainer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'


const EditPlayers = ({ lineupToggle, setLineupToggle, handleLineupForm, allPlayers, lineupCards, setLineupCards, removePlayerFromFunctions}) => (
    <div className='modal show' style={{ display: 'block', position: 'initial' }}>
        <Modal id="selectPlayersModal" show={lineupToggle} onHide={() => Globals.toggleCB(setLineupToggle)}>
            <Form onSubmit={handleLineupForm}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Lineup</Modal.Title>
                </Modal.Header>
                <Modal.Body id="selectPlayersModelBody">
                    <DndProvider backend={window.innerWidth < 800 ? TouchBackend : HTML5Backend} options={{enableMouseEvents: true}}>
                        <DndRosterContainer lineupCards={lineupCards} setLineupCards={setLineupCards} allPlayers={allPlayers} removePlayerFromFunctions={removePlayerFromFunctions}/>
                    </DndProvider>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" type='submit'>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={() => Globals.toggleCB(setLineupToggle)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </div>
)

export default EditPlayers;
