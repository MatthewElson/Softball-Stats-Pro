import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from '../Components/NavBar.js';
import Globals from '../Globals.js';
import AddPlayerToRoster from '../Modules/AddPlayerToRoster.js';
import EditPlayer from '../Modules/EditPlayerManageTeam.js';
import DeletePlayer from '../Modules/DeletePlayer.js';

const ManageTeam = () => {
    const { teamName } = useParams();
    const [selectedPlayerName, setSelectedPlayerName] = useState('');
    const [players, setPlayers] = useState([]);
    const [currentTask, setCurrentTask] = useState(0);

    useEffect(() => {
        const func = async () => {
            const docRef = doc(db, "teams", teamName);
            const docSnap = await getDoc(docRef);
            setPlayers(docSnap.data().players.sort((a, b) => a.name > b.name ? 1 : -1));
        }
        func();
    }, [teamName]);

    const editPlayerInRoster = (playerName) => {
        setSelectedPlayerName(playerName);
        setCurrentTask(Globals.taskNumbers.edit);
    }

    const deletePlayerFromRoster = (playerName) => {
        setSelectedPlayerName(playerName);
        setCurrentTask(Globals.taskNumbers.remove);
        // console.log("Remove" + playerName);
    }

    const PlayerRow = ({player, idx}) => (
        <Row className={`my-2 ${idx === 0 ? '' : 'borderTop'}`}>
            <Col xs={8} md={10}>
                {player.name}
            </Col>
            <Col xs={2} md={1} onClick={() => editPlayerInRoster(player.name)} className='text-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
            </Col>
            <Col xs={2} md={1} onClick={() => deletePlayerFromRoster(player.name)} className='text-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
            </Col>
        </Row>
    )

    return (
        <div>
            {currentTask === Globals.taskNumbers.add && <AddPlayerToRoster setCurrentTask={setCurrentTask} currentTask={currentTask} setPlayers={setPlayers} players={players} teamName={teamName}/> }
            {currentTask === Globals.taskNumbers.edit && <EditPlayer setCurrentTask={setCurrentTask} currentTask={currentTask} setPlayers={setPlayers} players={players} teamName={teamName} selectedPlayerName={selectedPlayerName}/> }
            {currentTask === Globals.taskNumbers.remove && <DeletePlayer setCurrentTask={setCurrentTask} currentTask={currentTask} setPlayers={setPlayers} players={players} teamName={teamName} selectedPlayerName={selectedPlayerName}/>}
            <NavBar teamName={teamName} pageName={"Manage Team"}/>
            <Container>
                <Row>
                    <Col xs={12} md={6}>
                        <Container>
                            <Row>
                                <Col xs={8} md={10}><h3 className='headerSize'>Roster</h3></Col>
                                <Col xs={{ span: 2, offset: 2 }} md={{ span: 2, offset: 0 }} className='bi-person-plus-parent justify-content-md-center text-center' onClick={() => setCurrentTask(Globals.taskNumbers.add)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus ms-2" viewBox="0 0 16 16">
                                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                                    </svg>
                                </Col>
                            </Row>
                        </Container>
                        <ListGroup variant="flush" className='mb-3'>
                            <Container>
                                {players.filter(v => !v.isSub).map((player, idx) => <PlayerRow player={player} idx={idx} key={`AllPlayers_${idx}`}/> )}
                            </Container>
                        </ListGroup>
                    </Col>
                    <Col xs={12} md={6}>
                        <Container>
                            <Row>
                                <Col xs={12}><h3 className='headerSize'>Subs</h3></Col>
                            </Row>
                        </Container>
                        <ListGroup variant="flush">
                            <Container>
                                {players.filter(v => v.isSub).map((player, idx) => <PlayerRow player={player} idx={idx} key={'AllSubs_' + idx}/>)}
                            </Container>
                        </ListGroup>
                    </Col>
                </Row>  
            </Container>
        </div>
    )
}

export default ManageTeam;
