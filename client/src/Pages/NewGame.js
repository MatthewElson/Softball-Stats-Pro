import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, updateDoc, getDoc, arrayUnion} from "firebase/firestore";
// import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import NavBar from '../Components/NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import EditPlayers from '../Modules/EditPlayersNewGame';
import SubmitStats from '../Modules/SubmitStats';
import Globals from '../Globals';

const NewGame = () => {
    const selectPlayerText = "Select a player";
    const { teamName } = useParams();
    const [players, setPlayers] = useState([selectPlayerText, selectPlayerText, selectPlayerText, selectPlayerText, selectPlayerText, selectPlayerText, selectPlayerText, selectPlayerText, selectPlayerText, selectPlayerText])
    // const [playerName, setPlayerName] = useState("");
    const [tempPlayers, setTempPlayers] = useState(players);
    const [gameStats, setGameStats] = useState([[], [], [], [], [], [], [], [], [], []]);
    const [rbis, setRbis] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [average, setAverage] = useState([[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]);
    const [selectedPlayerIdx, setSelectedPlayerIdx] = useState();
    const [toggle, setToggle] = useState(false);
    const [lineupToggle, setLineupToggle] = useState(true);
    const [popupToggle, setPopupToggle] = useState(false);
    // const [createNewPlayerToggle, setCreateNewPlayerToggle] = useState(false);
    const [layout, setLayout] = useState(true)
    const [secret, setSecret] = useState("");
    const goodButtons = ["Single", "Double", "Triple", "Homerun"]
    const badButtons = ["Out", "Strikeout"];
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [allPlayers, setAllPlayers] = useState();
    const [lineupCards, setLineupCards] = useState([]);

    useEffect(() => {
        const func = async () => {
            const docRef = doc(db, "teams", teamName);
            const docSnap = await getDoc(docRef);
            setData(docSnap.data());
            setAllPlayers(docSnap.data().players);//.players.sort((a, b) => a.name > b.name ? 1 : -1));
            setLoading(false);
        }
        func();
    }, [teamName]);

    const handleRadioChange = (e) => {
        const idx = Number(e.target.value);
        if (players[idx] !== selectPlayerText){
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
                        if (players[selectedPlayerIdx + 1] !== selectPlayerText)
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

    // const handleToggle = () => {
    //     setToggle((prev) => !prev);
    // }

    // const handleLineupToggle = () => {
    //     setLineupToggle((prev) => !prev);
    // }

    // const handleCreateNewPlayerToggle = () =>{
    //     setCreateNewPlayerToggle(prev => !prev);
    // }

    // const handleCreateNewPlayer = async (inputValue, idx) => {
    //     handleCreateNewPlayerToggle();
    //     setPlayerName(inputValue);
    //     // const docRef = doc(db, "teams", teamName);
    //     // await updateDoc(docRef, {
    //     //     players: arrayUnion({
    //     //         name: inputValue,
    //     //         singles: 0,
    //     //         doubles: 0,
    //     //         triples: 0,
    //     //         homeruns: 0,
    //     //         outs: 0,
    //     //         strikeouts: 0,
    //     //         rbis: 0,
    //     //         games: 0,
    //     //         sbs:0,
    //     //         walks: 0,
    //     //     })
    //     // });

    //     // const copyTempPlayers = [...tempPlayers];
    //     // copyTempPlayers[idx] = inputValue;
    //     // setTempPlayers(copyTempPlayers);
    //     // handleSelectPlayer({ label: inputValue, value: inputValue, idx: idx }, { action: 'manual insert' });
    //     // setData(data);
    // }

    // const CreateNewPlayer = ({playerName, idx}) => <CreateNewPlayer createNewPlayerToggle playerName={playerName} handleCreateNewPlayer idx={idx}/>

    const handleSubmitForm = (e) => {
        e.preventDefault();
        Globals.toggleCB(setLineupToggle);
        setPlayers(lineupCards);
    }

    // const handleLayout = () => {
    //     setLayout(prev => !prev)
    // }
    
    const handleSubmitStats = async (e) => {
        e.preventDefault();
        
        try {
            if (data.secret === secret) {
                
                for (const player of players) {
                    const idx = players.indexOf(player);
                    
                    const docRef = doc(db, "teams", teamName);

                    const updatedPlayers = allPlayers.map((plyr) => {
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
            {return  v !== selectPlayerText && !tempPlayers.includes(v)}
        ).map(playerData => ({value: playerData.name, label: playerData.name, idx: i}) ));
            return dropdownObject;
    }

    const handleSelectPlayer = (obj, itemAffected) => {
        const copyTempPlayers = [...tempPlayers];
        let changeValue = true;
        if(itemAffected.action !== 'clear'){
            for (let i = 0; i < copyTempPlayers.length; i++){
                if (obj.value !== selectPlayerText && copyTempPlayers[i] === obj.value) {
                    changeValue = false;
                    return false;
                }
            }
        }
        if (changeValue){
            if(obj)
                copyTempPlayers[obj.idx] = obj.value;
            else
                copyTempPlayers[itemAffected.removedValues[0].idx] = selectPlayerText;
            setTempPlayers(copyTempPlayers);
        }
    }
    
    
    return (
        <>
            {loading ? (<><h1 className="loading">Loading Stats...</h1><NavBar teamName={teamName}/></>) : (
            <>
                {lineupToggle && <EditPlayers lineupToggle={lineupToggle} setLineupToggle={setLineupToggle} handleSubmitForm={handleSubmitForm} allPlayers={allPlayers} setAllPlayers={setAllPlayers} lineupCards={lineupCards} setLineupCards={setLineupCards}/>}
                {/* {createNewPlayerToggle && (
                    <div className="modal show grayBack" style={{ display: 'block', position: 'initial' }}>
                        <CreateNewPlayer playerName={playerName}/>
                    </div>
                )} */}

                {popupToggle && <SubmitStats popupToggle setPopupToggle setSecret />}
                        
                <Container className={`${lineupToggle ? "blurred" : ""}`}>
                    <Row><Col><NavBar teamName={teamName}/></Col></Row>
                    <Row className='justify-content-center' xs={2} md={4}>
                        <Col className='mb-2 d-grid px-2'>
                            <Button onClick={() => Globals.toggleCB(setLineupToggle)}>Lineup</Button>
                        </Col>
                        { !players.every((v) => v === selectPlayerText) && (
                        <>
                            <Col className='mb-2 d-grid px-2'>
                                <Button className="layout" onClick={() => Globals.toggleCB(setLayout)}>{layout ? "2" : "1"}</Button>
                            </Col>
                            <Col className='mb-2 d-grid px-2'>
                                <Button className="toggle" onClick={() => Globals.toggleCB(setToggle)}>{toggle ? "Auto" : "Manual"}</Button>
                            </Col>
                            <Col className='mb-2 d-grid px-2'>
                                <Button variant='success' onClick={()=> Globals.toggleCB(setPopupToggle)}>Submit Stats</Button>
                            </Col>
                        </>
                        )}
                    </Row>
                    <Row>
                        {players.map((player, idx) => (
                            <Col xs={ layout ? "6" : "12"} className={`mb-2 px-2 ${(players[selectedPlayerIdx] !== selectPlayerText && player === players[selectedPlayerIdx]) ? "selected" : ""} ${player === selectPlayerText ? "hidden" : ""}`} key={'selected_' + idx}>
                                <label className={`${(players[selectedPlayerIdx] !== selectPlayerText && player === players[selectedPlayerIdx]) ? "selectedPlayer" : "notSelectedPlayer"}`} htmlFor={player.name}>
                                    <ListGroup horizontal>
                                        <ListGroup.Item className={`lineupListGroupItem ${(layout ? 'px-2' : '')}`}>{layout ? player.name?.substring(0,4) : player.name}</ListGroup.Item>
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
                    { !players.every((v) => v === selectPlayerText) && (
                    <>
                        <Row className='justify-content-center' xs={2} md={4}>
                            {goodButtons.map((btn, idx) => (
                                <Col className='d-grid px-2' key={`button_${idx}`}>
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
                            {badButtons.map((btn, idx) => (
                                <Col className='d-grid px-2' key={`button_${idx}`}>
                                    <Button className="mb-2" variant="danger" value={btn} onClick={handleClick}>{btn}</Button>
                                </Col>
                            ))}
                        </Row>
                        <Row className='justify-content-center' xs={2} md={4}>
                            <Col className='d-grid px-2'>
                                <Button className="mb-2 delete-Button" variant='warning' onClick={handleDelete}>Delete Stat</Button>
                            </Col>
                        </Row>
                    </>
                    )}
                    {lineupCards.map((player, idx) => (
                        <input key={'radio_' + idx} id={player.name} type="radio" name="selector" className='hidden' value={idx} checked={player?.name === players[selectedPlayerIdx]?.name} onChange={handleRadioChange} />
                    ))}
                </Container>
            </>)}
        </>
    )
};

export default NewGame;
