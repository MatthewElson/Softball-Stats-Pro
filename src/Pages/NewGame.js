import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, updateDoc, getDoc} from "firebase/firestore";
// import CloseButton from 'react-bootstrap/CloseButton';
import Button from 'react-bootstrap/Button';
import NavBar from '../Components/NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import EditLineup from '../Modules/EditPlayersNewGame';
import SubmitStats from '../Modules/SubmitStats';
import Globals from '../Globals';

const NewGame = () => {
    const { teamName } = useParams();
    const [players, setPlayers] = useState([])
    // const [tempPlayers, setTempPlayers] = useState(players);
    const [gameStats, setGameStats] = useState([]); 
    const [rbis, setRbis] = useState([]);
    const [average, setAverage] = useState([]);
    const [selectedPlayerIdx, setSelectedPlayerIdx] = useState(0);
    const [lineupToggle, setLineupToggle] = useState(true);
    const [popupToggle, setPopupToggle] = useState(false);
    const [secret, setSecret] = useState("");
    const goodButtons = [{ buttonText:"1st", playerOutcomes: "Single"}, { buttonText:"2nd", playerOutcomes: "Double"}, { buttonText:"3rd", playerOutcomes: "Triple"}, { buttonText:"Homerun", playerOutcomes: "Homerun"}]
    const badButtons = ["Out", "Strikeout"];
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [allPlayers, setAllPlayers] = useState();
    const [lineupCards, setLineupCards] = useState([]);
    const [ourScore, setOurScore] = useState(0);
    const [theirScore, setTheirScore] = useState(0);


    useEffect(() => {
        const func = async () => {
            const docRef = doc(db, "teams", teamName);
            const docSnap = await getDoc(docRef);
            setData(docSnap.data());
            const playerData = docSnap.data().players;
            setAllPlayers(playerData);//.players.sort((a, b) => a.name > b.name ? 1 : -1));
            setLoading(false);
            const averagesNeeded = [];
            const gameStatsNeeded = [];
            const rbisNeeded = [];
            for (let i = 0; i < playerData.length; i++) {
                averagesNeeded.push([0, 0]);   
                gameStatsNeeded.push([]);
                rbisNeeded.push(0);
            }
            setAverage(averagesNeeded);
            setGameStats(gameStatsNeeded);
            setRbis(rbisNeeded);
        }
        func();
    }, [teamName]);

    const handleRadioChange = (e) => {
        setSelectedPlayerIdx(Number(e.target.value));
    }

    const handleCompleteBatClick = (e, updatePoints = '') => {

        if (selectedPlayerIdx >= 0){
            const stat = e.target.value;

            if (goodButtons.some((elem) => elem.playerOutcomes === stat) || badButtons.includes(stat)) {
                const copiedStats = [...gameStats];
                // goodButtons.find((elem) => elem.playerOutcomes === stat
                copiedStats[selectedPlayerIdx].push(stat);
                setGameStats(copiedStats);

                const copiedAverage = [...average];
                copiedAverage[selectedPlayerIdx][1] += 1;
    
                if (goodButtons.some((elem) => elem.playerOutcomes === stat)) {
                    copiedAverage[selectedPlayerIdx][0] += 1;
                }
                setAverage(copiedAverage);
                
                // if(updatePoints)
                //     setOurScore(prev => ++prev);
            }
            else if (stat === "RBI+" || (stat === "RBI-" && rbis[selectedPlayerIdx] > 0)){
                const copiedRBIs = [...rbis];
                if (stat === "RBI+"){
                    copiedRBIs[selectedPlayerIdx] += 1;
                    if(updatePoints === 'add')
                        setOurScore(prev => ++prev);
                }
                else{
                    copiedRBIs[selectedPlayerIdx] -= 1;
                    if(updatePoints === 'subtract')
                        setOurScore(prev => --prev);
                }

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
                if (goodButtons.some((elem) => elem.playerOutcomes === deletedStat)){
                    currAvgStats[selectedPlayerIdx][0] -= 1;
                }
                currAvgStats[selectedPlayerIdx][1] -= 1;
                setAverage(currAvgStats);
                setGameStats(currGameStats);
            }

        }
    }

    const handleLineupForm = (e) => {
        e.preventDefault();
        Globals.toggleCB(setLineupToggle);
        setPlayers(lineupCards);
    }
    
    const handleSubmitStatsForm = async (e) => {
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
                        if (player.name === plyr.name) {
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
                alert("Stats have been successfully added");
                Globals.toggleCB(setPopupToggle);
            } else {
                alert("Wrong team password");
            }
            setSecret("");
        } catch (error) {
           alert(`Error updating document: ${error}`);        
        }
    };

    const goToPreviousBatter = () => {
        selectedPlayerIdx - 1 > -1 ? setSelectedPlayerIdx(prev => prev - 1) : setSelectedPlayerIdx(players.length - 1);
    }

    const goToNextBatter = () => {
        selectedPlayerIdx + 1 < players.length ? setSelectedPlayerIdx(prev => prev + 1) : setSelectedPlayerIdx(0);
    }

    const getNext3Batters = (players, idx) => {
        const battersIndexes = [];
        if(Boolean(players.length >= 3)){
            if(players[idx]){
                battersIndexes[0] = [players[idx]];
                if(players[idx + 1]){
                    battersIndexes[1] = [players[idx + 1]];
                    if(players[idx + 2])
                        battersIndexes[2] = [players[idx + 2]];
                    else
                        battersIndexes[2] = [players[0]];
                }
                else{
                    battersIndexes[1] = [players[0]];
                    battersIndexes[2] = [players[1]];
                }
            }
            else{
                battersIndexes[0] = [players[0]];
                battersIndexes[1] = [players[1]];
                battersIndexes[2] = [players[2]];
            }
        }
        else 
            return [];
        
        return battersIndexes;
    }
    
    try {
    return (
        <>
            {loading ? (<><h1 className="loading">Loading Game...</h1><NavBar teamName={teamName}/></>) : (
            <>
                {lineupToggle && <EditLineup lineupToggle={lineupToggle} setLineupToggle={setLineupToggle} handleLineupForm={handleLineupForm} allPlayers={allPlayers} lineupCards={lineupCards} setLineupCards={setLineupCards} removePlayerFromFunctions={[setRbis, setGameStats, setAverage]} />}
                {popupToggle && <SubmitStats popupToggle={popupToggle} setPopupToggle={setPopupToggle} setSecret={setSecret} handleSubmitStatsForm={handleSubmitStatsForm}/>}
                        
                <Container className={`${lineupToggle ? "blurred" : ""}`}>
                    <Row xs={12}><Col><NavBar teamName={teamName}/></Col></Row>
                    <Row xs={12} className='mb-2'>
                        <Col className='isInlineGrid'>
                            <ButtonGroup className='my-1'>
                                <Button onClick={() => Globals.toggleCB(setLineupToggle)}>Lineup</Button>
                                { players.length >= 3 &&
                                    <Button variant='success' onClick={()=> Globals.toggleCB(setPopupToggle)}>Submit Stats</Button>
                                }
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row className='mb-2'>
                        { players.length >= 3 &&
                            <Col xs={12}>
                                <ListGroup horizontal className='my-1'>
                                    <ListGroup.Item id='ourScore' className='vertical-align:middle'>Us: {ourScore}</ListGroup.Item>
                                    <ListGroup.Item id='theirScore'>
                                        <Row>
                                            <Col>
                                                <span className='me-1 vertical-align:middle'>Them: {theirScore}</span>
                                            </Col>
                                            <Col className='px-0'>
                                                <ButtonGroup size="sm">
                                                    <Button id='addEnemyScore' onClick={() => setTheirScore(prev => prev + 1)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" variant="success" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                                        </svg>
                                                    </Button>
                                                    <Button id='subEnemyScore' onClick={() => setTheirScore(prev => prev === 0 ? 0 : prev - 1)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
                                                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                                                        </svg>
                                                    </Button>
                                                </ButtonGroup>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                </ListGroup>                            
                            </Col>
                        }
                    </Row>
                    <Row id="currentBatterRow" className='mb-2'>
                        { players.length >= 3  && 
                            <Col className="currentBatterNav">
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={goToPreviousBatter} fill={'currentColor'} className="bi bi-chevron-compact-left goToPreviousBatter" viewBox="5 0 5 16" preserveAspectRatio="none">
                                <path fillRule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223"/>
                                </svg>
                            </Col>
                        }
                        { getNext3Batters(players, selectedPlayerIdx)[0]?.map((player) => (
                            <Col xs="10" className={`mb-1 px-2 ${player === players[selectedPlayerIdx] ? "selected" : ""}`} key={'selected_' + selectedPlayerIdx}>
                                <label className={`${player === players[selectedPlayerIdx] ? "selectedPlayer" : "notSelectedPlayer"}`} htmlFor={player.name}>
                                    <ListGroup>
                                        <ListGroup.Item className='lineupListGroupItemTop yPadding'>Batter # {(selectedPlayerIdx + 1)}</ListGroup.Item>
                                    </ListGroup>
                                    <ListGroup horizontal>
                                        <ListGroup.Item className='lineupListGroupItem yPadding' id="battingPlayersName">{player.name?.substring(0,10)}</ListGroup.Item>
                                        <ListGroup.Item className='lineupListGroupItem yPadding' id="battingPlayersAverage">{average[selectedPlayerIdx][0]}/{average[selectedPlayerIdx][1]}</ListGroup.Item>
                                        <ListGroup.Item className='lineupListGroupItem yPadding' id="battingPlayersRBIs">{rbis[selectedPlayerIdx]} RBI's</ListGroup.Item>
                                    </ListGroup>
                                    <ListGroup> 
                                        <ListGroup.Item className='lineupListGroupItemBottom yPadding'>{gameStats[selectedPlayerIdx].length ? gameStats[selectedPlayerIdx].join(", ") : 'No Bats Yet'}</ListGroup.Item>
                                    </ListGroup>
                                </label>
                            </Col>
                        ))}
                        { players.length >= 3  &&
                            <Col className="currentBatterNav">
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={goToNextBatter} fill={'currentColor'} className="bi bi-chevron-compact-right goToNextBatter" viewBox="6 0 5 16" preserveAspectRatio="none">
                                    <path fillRule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671"/>
                                </svg>
                            </Col>
                        }
                    </Row>
                    <Row className='mb-2'>
                        <Col xs={{ span: 10, offset: 1 }}>
                            <ListGroup>
                                {getNext3Batters(players, selectedPlayerIdx)[1]?.map((player) => (
                                    <ListGroup.Item key={`OnDeck${player.name}`} className='yPadding'><b>Deck: </b>{player.name}</ListGroup.Item>
                                ))}
                                {getNext3Batters(players, selectedPlayerIdx)[2]?.map((player) => (
                                    <ListGroup.Item key={`OnDeck${player.name}`} className='yPadding'><b>Hole: </b>{player.name}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='px-2 isInlineGrid' xs={12} md={11}>
                            { players.length >= 3 && (
                            <>
                                <ButtonGroup className='mb-1'>
                                    <Button className="px-2 buttonGroupLabel" disabled>On Base</Button>
                                    {goodButtons.map((btn, idx) =>
                                        <Button className="px-2 whiteBorder" value={btn.playerOutcomes} key={`goodButton_${idx}`} onClick={handleCompleteBatClick}>{btn.buttonText}</Button>
                                    )}
                                </ButtonGroup>
                                <ButtonGroup className='mb-1'>
                                    <Button className="px-2 buttonGroupLabel" disabled>Points</Button>
                                    <Button className="px-2 whiteBorder btnGroup2Items" value="RBI+" onClick={(e) => handleCompleteBatClick(e, 'add')}>RBI+</Button>
                                    <Button className="px-2 whiteBorder btnGroup2Items" variant="warning" value="RBI-" onClick={(e) => handleCompleteBatClick(e, 'subtract')}>RBI-</Button>
                                </ButtonGroup>
                                <ButtonGroup className='mb-1'>
                                    <Button className="px-2 buttonGroupLabel" disabled>Other</Button>
                                    {badButtons.map((btn, idx) => (
                                        <Button className="px-2 whiteBorder btnGroup2Items" key={`badButton_${idx}`} variant="danger" value={btn} onClick={handleCompleteBatClick}>{btn}</Button>
                                    ))}
                                </ButtonGroup>
                                <ButtonGroup className='mb-0'>
                                    <Button className="delete-Button" variant='warning' onClick={handleDelete}>Delete Stat</Button>
                                </ButtonGroup>
                            </>
                            )}
                        </Col>
                    </Row>
                    {lineupCards.map((player, idx) => (
                        <input key={'radio_' + idx} id={player.name} type="radio" name="selector" className='hidden' value={idx} checked={player?.name === players[selectedPlayerIdx]?.name} onChange={handleRadioChange} />
                    ))}
                </Container>
            </>)}
        </>
    )
    }
    catch(e){
       console.error(e);
    }
};

export default NewGame;
