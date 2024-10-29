import React, { useState } from 'react';
import Globals from '../Globals';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';

import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

const DeletePlayer = ({setCurrentTask, currentTask, setPlayers, players, teamName, selectedPlayerName}) => {
    // setCurrentTask={setCurrentTask} currentTask={currentTask}/>}
    const [errorDeleting, setErrorDeleting] = useState(false);
    const deletePlayerFromRoster = async (e) => {
        
        e.preventDefault();
        // console.log(e);
        if(e.currentTarget.querySelector('#removePlayerWithName').value === selectedPlayerName){
            const docRef = doc(db, "teams", teamName);
            const playerInfo = players.filter(v => v.name === selectedPlayerName);
            console.log('playerInfo :', playerInfo);
            const newPlayersList = players.filter(v => v.name !== selectedPlayerName);
            setPlayers(newPlayersList);
            await updateDoc(docRef, {
                players: arrayRemove({...playerInfo[0]})
            });
            setCurrentTask(Globals.taskNumbers.none);
        }else{
            setErrorDeleting(true);
        }
    }

    return (
        <Modal show={currentTask === Globals.taskNumbers.remove} onHide={() => setCurrentTask(Globals.taskNumbers.none)}>
            <Form onSubmit={deletePlayerFromRoster}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form.Group>
                            <Form.Label className="mb-3">Type <b>{selectedPlayerName}</b> to confirm the delete action.</Form.Label>
                            <Form.Control id="removePlayerWithName" type="input" required placeholder={selectedPlayerName}></Form.Control>
                        </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" type='submit'>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={() => setCurrentTask(Globals.taskNumbers.none)}>
                        Cancel
                    </Button>
                </Modal.Footer>                 
            </Form>
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <Toast show={errorDeleting} onClose={() => setErrorDeleting(!errorDeleting)} delay={3000} autohide bg='danger'>
                    <Toast.Body>Player not deleted, please try again.</Toast.Body>
                </Toast>
            </div>
        </Modal>
    )
}

export default DeletePlayer;
