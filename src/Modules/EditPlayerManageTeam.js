import React, { useState } from 'react';
import Globals from '../Globals';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import { Row, Col, Container, Toast } from 'react-bootstrap';
import ToggleCheckboxImage from '../Components/ToggleCheckboxImage';
const EditPlayer = ({setCurrentTask, currentTask, setPlayers, players, teamName, selectedPlayerName}) => {
    const [errorEditing, setErrorEditing] = useState(false);
    console.log(setErrorEditing);
    const [rulesResults, setRulesResults] = useState([]);
    const rulesStrings = [
        "Must be unique.",
        "20 characters or less.",
        "Only contains letters & spaces."
    ]
    
    const updateRules = (e) => {
        setErrorEditing(false);
        setRulesResults(followsEditPlayerRules(e.currentTarget.value));
    }

    const editPlayerInRoster = async (e) => {
        e.preventDefault();
        // console.log(e);
        if(rulesResults.some(v => !v)){
            setErrorEditing(true);
        }else{
            const docRef = doc(db, "teams", teamName);
            const playerInfo = players.filter(v => v.name === selectedPlayerName)[0];
            const nameInput = e.currentTarget.querySelector('#inputPlayerName');
            playerInfo.name = nameInput.value
            console.log('playerInfo :', playerInfo);
            setPlayers(players.sort((a,b) => a.name > b.name ? 1 : -1));
            await updateDoc(docRef, {
                players: arrayUnion({...playerInfo})
            });
            await updateDoc(docRef, {
                players: arrayRemove({...playerInfo, name: selectedPlayerName})
            });
            setCurrentTask(Globals.taskNumbers.none);
        }
    }

    function followsEditPlayerRules(playerNameToTest) {
        const results = [];
        const playerNameToTestLowerCase = playerNameToTest.toLowerCase();
        //Rule #1: Player can't have the same name as another player
        results.push(!players.some(v => v.name.toLowerCase() === playerNameToTestLowerCase))
        //Rule #2: Player name can't exceed 20 characters
        results.push(!(playerNameToTest.length > 20))
        //Rule #3: Player name can only have letters and spaces
        results.push((playerNameToTest.match(/[a-zA-Z ]/g)?.length === playerNameToTest.length))
        return results;
    }


    return (
        <Modal show={currentTask === Globals.taskNumbers.edit} onHide={() => setCurrentTask(Globals.taskNumbers.none)}>
            <Form onSubmit={editPlayerInRoster}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Player: {selectedPlayerName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                <Form.Label htmlFor="inputPlayerName">Name</Form.Label>
                <Form.Control
                type="name"
                id="inputPlayerName"
                aria-describedby="nameHelp"
                onChange={updateRules}
                />
                <Container>
                    {rulesStrings.map((rule, i) => (
                            <Row key={`${rulesResults[i]}_${i}`}>
                                <Col>
                                    <Form.Text id="nameHelp" muted>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`svgToSwap-${i} bi bi-x-lg`} viewBox="0 0 16 16">
                                            <ToggleCheckboxImage booleanValue={rulesResults[i]} idx={i}/>
                                        </svg>
                                        {rule}
                                    </Form.Text>
                                </Col>
                            </Row>
                        )
                    )}
                </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" type='submit'>
                        Save Edit
                    </Button>
                    <Button variant="secondary" onClick={() => setCurrentTask(Globals.taskNumbers.none)}>
                        Cancel
                    </Button>
                </Modal.Footer>                 
            </Form>
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <Toast show={errorEditing} onClose={() => setErrorEditing(!errorEditing)} delay={3000} autohide bg={'warning'}>
                    <Toast.Body>Player's information not changed.</Toast.Body>
                </Toast>
            </div>
        </Modal>
    )
}

export default EditPlayer;
