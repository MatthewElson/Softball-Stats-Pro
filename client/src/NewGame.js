import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
// import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import CreatableSelect from 'react-select/creatable';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

const NewGame = () => {

    const { teamName } = useParams();
    const [players, setPlayers] = useState(["Select a player", "Select a player", "Select a player", "Select a player", "Select a player", "Select a player", "Select a player", "Select a player", "Select a player", "Select a player"])
    const [tempPlayers, setTempPlayers] = useState(players);
    const [gameStats, setGameStats] = useState([[], [], [], [], [], [], [], [], [], []]);
    const [rbis, setRbis] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [average, setAverage] = useState([[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]);
    const [selectedPlayerIdx, setSelectedPlayerIdx] = useState();
    const [toggle, setToggle] = useState(false);
    const [formToggle, setFormToggle] = useState(false);
    const [popupToggle, setPopupToggle] = useState(false);
    const [layout, setLayout] = useState(true)
    const [secret, setSecret] = useState("");
    const goodButtons = ["Single", "Double", "Triple", "Homerun"]
    const badButtons = ["Out", "Strikeout"];
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const func = async () => {
            const docRef = doc(db, "teams", teamName);
            const docSnap = await getDoc(docRef);
            setData(docSnap.data());
            setLoading(false);
        }
        func();
    }, [teamName]);

    const handleRadioChange = (e) => {
        const idx = Number(e.target.value);
        if (players[idx] !== "Select a player"){
            setSelectedPlayerIdx(Number(e.target.value));
        }
    }

    const handleClick = (e) => {

        if (selectedPlayerIdx >= 0){
            const stat = e.target.value;

            if (goodButtons.includes(stat) || badButtons.includes(stat)){
                const copiedStats = [...gameStats];
                copiedStats[selectedPlayerIdx].push(stat);
                setGameStats(copiedStats);

                const copiedAverage = [...average];
                copiedAverage[selectedPlayerIdx][1] += 1;
    
                if (goodButtons.includes(stat)) {
                    copiedAverage[selectedPlayerIdx][0] += 1;
                }
    
                setAverage(copiedAverage);

                if (toggle) {
                    if (selectedPlayerIdx !== players.length - 1){
                        if (players[selectedPlayerIdx + 1] !== "Select a player")
                            setSelectedPlayerIdx(prev => prev + 1);
                        else 
                            setSelectedPlayerIdx(0);
                    } 
                    else
                        setSelectedPlayerIdx(0);
                }
            }

            else if (stat === "RBI+" || (stat === "RBI-" && rbis[selectedPlayerIdx] > 0)){
                const copiedRBIs = [...rbis];
                if (stat === "RBI+")
                    copiedRBIs[selectedPlayerIdx] += 1;
                else
                    copiedRBIs[selectedPlayerIdx] -= 1;

                setRbis(copiedRBIs);
            }
        }
    }

    const handleDelete = () => {
        if (selectedPlayerIdx >= 0){
            const currGameStats = [...gameStats];
            const currAvgStats = [...average];
            const deletedStat = currGameStats[selectedPlayerIdx].pop();
            if (deletedStat){
                if (goodButtons.includes(deletedStat)){
                    currAvgStats[selectedPlayerIdx][0] -= 1;
                }
                currAvgStats[selectedPlayerIdx][1] -= 1;
                setAverage(currAvgStats);
                setGameStats(currGameStats);
            }

        }
    }

    const handleToggle = () => {
        setToggle((prev) => !prev);
    }

    const handleFormToggle = () => {
        setFormToggle((prev) => !prev);
    }

    const handlePopupToggle = () => {
        setPopupToggle(prev => !prev);
    }

    const handleCreateNewPlayer = (inputValue) => {
        // const newOption = createOption(inputValue);
        // setOptions((prev) => [...prev, newOption]);
        // setValue(newOption);
    }

    const handleCreate = (inputValue) => {
        //   const newOption = createOption(inputValue);
        //   setOptions((prev) => [...prev, newOption]);
        //   setValue(newOption);
      };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        setFormToggle((prev) => !prev);
        setPlayers(tempPlayers);
    }

    const handleLayout = () => {
        setLayout(prev => !prev)
    }
    
    const handleSubmitStats = async (e) => {
        e.preventDefault();
        
        try {
            if (data.secret === secret) {
                
                for (const player of players) {
                    const idx = players.indexOf(player);
                    
                    const docRef = doc(db, "teams", teamName);
                    const docSnap = await getDoc(docRef);
                    const teamPlayers = docSnap.data().players;

                    const updatedPlayers = teamPlayers.map((plyr) => {
                        const prevStats = {
                            singles: plyr.singles,
                            doubles: plyr.doubles,
                            triples: plyr.triples,
                            homeruns: plyr.homeruns,
                            outs: plyr.outs,
                            strikeouts: plyr.strikeouts,
                            rbis: plyr.rbis,
                            games: plyr.games,
                        };
                        if (player === plyr.name) {
                            gameStats[idx].forEach((type) => {
                                if (type === "Single") {
                                    prevStats.singles += 1;
                                } else if (type === "Double") {
                                    prevStats.doubles += 1;
                                } else if (type === "Triple") {
                                    prevStats.triples += 1;
                                } else if (type === "Homerun") {
                                    prevStats.homeruns += 1;
                                } else if (type === "Strikeout") {
                                    prevStats.strikeouts += 1;
                                } else if (type === "Out") {
                                    prevStats.outs += 1;
                                }
                            });
                            prevStats.rbis += rbis[idx];
                            if (gameStats[idx].length > 0){
                                prevStats.games += 1;
                            }
                            return { ...plyr, ...prevStats };
                        }
                        return plyr;
                    });
                    
                    await updateDoc(docRef, { players: updatedPlayers });
                }
                alert("Stats have been successfully added")
            } else {
                alert("Wrong team password");
            }
            setSecret("");
        } catch (error) {
           alert(`Error updating document: ${error}`);        
        }
    };

    const selectPlayerList = (i) => {
        const dropdownObject = [];
        dropdownObject.push(...data.players.filter((v,i) => 
           {return  v !== "Select a player" && !tempPlayers.includes(v)}
    ).map(playerData => ({value: playerData.name, label: playerData.name, idx: i}) ));
        return dropdownObject;
    }

    const handleSelectPlayer = (obj, itemAffected) => {
        const copyTempPlayers = [...tempPlayers];
        let changeValue = true;
        if(itemAffected.action !== 'clear'){
            for (let i = 0; i < copyTempPlayers.length; i++){
                if (obj.value !== "Select a player" && copyTempPlayers[i] === obj.value) {
                    changeValue = false;
                    break;
                }
            }
        }
        if (changeValue){
            if(obj)
                copyTempPlayers[obj.idx] = obj.value;
            else
                copyTempPlayers[itemAffected.removedValues[0].idx] = "Select a player";
            setTempPlayers(copyTempPlayers);
        }
    }
    
    return (
        <>
            {loading ? (<><h1 className="loading">Loading Stats...</h1><NavBar teamName={teamName}/></>) : (
            <>
                {formToggle && (
                    <div className="modal show" style={{ display: 'block', position: 'initial' }}>
                        <Modal id="selectPlayersModal" show={formToggle} onHide={handleFormToggle}>
                            <Form onSubmit={handleSubmitForm}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Players</Modal.Title>
                                </Modal.Header>
                                <Modal.Body id="selectPlayersModelBody">
                                    {tempPlayers.map((player, idx) => (
                                        <Form.Group className="mb-2" controlId={"formPlayer" + idx} key={"formPlayer" + idx}>
                                            <CreatableSelect
                                                aria-label='Select players'
                                                isClearable
                                                onCreateOption={(e,a) => handleCreateNewPlayer(e,a)}
                                                onChange={(newValue, PopValueActionMeta) => handleSelectPlayer(newValue, PopValueActionMeta)}
                                                options= {selectPlayerList(idx)}
                                                //setValue={player}
                                                defaultValue={{ label: player, value: player, idx: idx }}
                                                name={player}
                                                placeholder='Select a player'
                                            />
                                        </Form.Group>
                                    ))}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={handleFormToggle}>Close</Button>
                                    <Button type="submit" variant="success">Save</Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                )}

                {popupToggle && (
                    <div className="modal show" style={{ display: 'block', position: 'initial' }}
                    >
                        <Modal show={popupToggle} onHide={handlePopupToggle}>
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
                                    <Button variant="secondary" onClick={handlePopupToggle}>Close</Button>
                                    <Button type="submit" variant="primary">Submit Stats</Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                )}
                
                <Container className={`${formToggle ? "blurred" : ""}`}>
                    <Row><Col><NavBar teamName={teamName}/></Col></Row>
                    <Row className='justify-content-center' xs={2} md={4}>
                        <Col className='mb-2 d-grid px-2'>
                            <Button onClick={handleFormToggle}>Lineup</Button>
                        </Col>
                        <Col className='mb-2 d-grid px-2'>
                            <Button className="layout" onClick={handleLayout}>{layout ? "2" : "1"}</Button>
                        </Col>
                        <Col className='mb-2 d-grid px-2'>
                            <Button className="toggle" onClick={handleToggle}>{toggle ? "Auto" : "Manual"}</Button>
                        </Col>
                        <Col className='mb-2 d-grid px-2'>
                            <Button variant='success' onClick={handlePopupToggle}>Submit Stats</Button>
                        </Col>
                    </Row>
                    <Row>
                        {players.map((player, idx) => (
                            <Col xs={ layout ? "6" : "12"} className={`mb-2 px-2 ${(players[selectedPlayerIdx] !== "Select a player" && player === players[selectedPlayerIdx]) ? "selected" : ""} ${player === "Select a player" ? "hidden" : ""}`} key={'selected' + idx}>
                                <label className={`${(players[selectedPlayerIdx] !== "Select a player" && player === players[selectedPlayerIdx]) ? "selectedPlayer" : "notSelectedPlayer"}`} htmlFor={player}>
                                    <ListGroup horizontal>
                                        <ListGroup.Item className={`lineupListGroupItem ${(layout ? 'px-2' : '')}`}>{layout ? player.substring(0,4) : player}</ListGroup.Item>
                                        <ListGroup.Item className={`lineupListGroupItem ${(layout ? 'px-2' : '')}`}>{average[idx][0]}/{average[idx][1]}</ListGroup.Item>
                                        <ListGroup.Item className={`lineupListGroupItem ${(layout ? 'px-2' : '')}`}>{rbis[idx]} {layout ? "" : "RBI's"}</ListGroup.Item>
                                    </ListGroup>
                                    <ListGroup> 
                                        <ListGroup.Item className='lineupListGroupItemBottom'>{gameStats[idx].length ? gameStats[idx].join(", ") : 'No Bats Yet'}</ListGroup.Item>
                                    </ListGroup>
                                </label>
                            </Col>
                        ))}
                    </Row>
                    <Row className='justify-content-center' xs={2} md={4}>
                        {goodButtons.map((btn) => (
                            <Col className='d-grid px-2' key={btn}>
                                <Button className="mb-2" value={btn} onClick={handleClick}>{btn}</Button>
                            </Col>
                        ))}
                    </Row>
                    <Row className='justify-content-center' xs={2} md={4}>
                        <Col className='d-grid px-2'>
                            <Button className="mb-2" value="RBI+" onClick={handleClick}>RBI+</Button>
                        </Col>
                        <Col className='d-grid px-2'>
                            <Button className="mb-2" variant="warning" value="RBI-" onClick={handleClick}>RBI-</Button>
                        </Col>
                        {badButtons.map((btn) => (
                            <Col className='d-grid px-2' key={btn} >
                                <Button className="mb-2" variant="danger" value={btn} onClick={handleClick}>{btn}</Button>
                            </Col>
                        ))}
                    </Row>
                    <Row className='justify-content-center' xs={2} md={4}>
                        <Col className='d-grid px-2'>
                            <Button className="mb-2 delete-Button" variant='warning' onClick={handleDelete}>Delete Stat</Button>
                        </Col>
                    </Row>
                    {players.map((player, idx) => (
                        <input key={'radio' + idx} id={player} type="radio" name="selector" className='hidden' value={idx} checked={player === players[selectedPlayerIdx]} onChange={handleRadioChange} />
                    ))}
                </Container>
            </>)}
        </>
    )
};

export default NewGame;
