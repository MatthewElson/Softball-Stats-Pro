import React, { useState } from 'react';
import Globals from '../Globals';
import { db } from "../firebase";
import { doc, updateDoc, getDoc, arrayUnion} from "firebase/firestore";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Toast from 'react-bootstrap/Toast';
import ToggleCheckboxImage from '../Components/ToggleCheckboxImage';

const AddPlayerToRoster = ({setCurrentTask, currentTask, setPlayers, players, teamName}) => {
    const [newPlayerName, setNewPlayerName] = useState('');
    const [isSub, setIsSub] = useState(false);
    const [playerAlreadyExists, setPlayerAlreadyExists] = useState(false);
    const addPlayer = async (e) => {
        e.preventDefault();

        if(players.find(v => v.name === newPlayerName)){
            setPlayerAlreadyExists(true);
            return;
        }
        
        setCurrentTask(currentTask.none);

        console.log(newPlayerName,isSub);

        const assignNewPlayerInfo = new Globals.assignNewPlayerInfo(newPlayerName, isSub);
        try{
            console.log(players);
            if(newPlayerName){
                setPlayers([...players, assignNewPlayerInfo]);
                const docRef = doc(db, "teams", teamName);
                //const docSnap = await getDoc(docRef);
                await updateDoc(docRef, {
                    players: arrayUnion({...assignNewPlayerInfo})
                });
                // console.log(teamPlayers);
            }
        }
        catch(e){
            console.error(e);
        }
    }

    return (
        <Modal show={currentTask===Globals.taskNumbers.add} onHide={() => {setCurrentTask(Globals.taskNumbers.none)} }>
            <Form onSubmit={addPlayer}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Player</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <InputGroup>
                            <Form.Control
                                id='newPlayerName'
                                placeholder="Name"
                                aria-label="New player name"
                                aria-describedby="The name of the new player you're creating."
                                required
                                onChange={(e) => {setNewPlayerName(e.currentTarget.value)}}
                            />
                            <InputGroup.Text>Is Sub</InputGroup.Text>
                            <ToggleButton
                                id="isSub"
                                type="checkbox"
                                variant="secondary"
                                checked={isSub}
                                value={0}
                                onChange={ () => setIsSub(!isSub) }
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="svgToSwap bi bi-x-lg" viewBox="0 0 16 16">
                                    <ToggleCheckboxImage booleanValue={isSub}/>
                                </svg>      
                            </ToggleButton>
                        </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" type='submit'>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={() => setCurrentTask(Globals.taskNumbers.none)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Form>
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <Toast show={playerAlreadyExists} onClose={() => setPlayerAlreadyExists(!playerAlreadyExists)} delay={3000} autohide bg='danger'>
                    <Toast.Body>A player with that name already exists. Please use another name.</Toast.Body>
                </Toast>
            </div>
        </Modal>
    )
}

export default AddPlayerToRoster;
