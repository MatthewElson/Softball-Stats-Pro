import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const NewGame = () => {

    const { teamName } = useParams();
    const [players, setPlayers] = useState(["Select a player", "Select a player", "Select a player", "Select a player", "Select a player", "Select a player", "Select a player", "Select a player", "Select a player", "Select a player"])
    const [tempPlayers, setTempPlayers] = useState(players);
    const [gameStats, setGameStats] = useState([[], [], [], [], [], [], [], [], [], []]);
    const [rbis, setRbis] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [sbs, setSbs] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [average, setAverage] = useState([[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]);
    const [selectedPlayerIdx, setSelectedPlayerIdx] = useState();
    const [toggle, setToggle] = useState(false);
    const [formToggle, setFormToggle] = useState(false);
    const [layout, setLayout] = useState(true)
    const [secret, setSecret] = useState("");
    const goodButtons = ["Single", "Double", "Triple", "Homerun", "Walk"]
    const badButtons = ["Out", "Strikeout"];
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    const myFunction = async () => {
        const docRef = doc(db, "teams", teamName);
        const docSnap = await getDoc(docRef);
        setData(docSnap.data());
        setLoading(false);
    }

    useEffect(() => {
        myFunction();
    }, []);

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

                if (stat !== "Walk"){
                    const copiedAverage = [...average];
                    copiedAverage[selectedPlayerIdx][1] += 1;
        
                    if (goodButtons.includes(stat)) {
                        copiedAverage[selectedPlayerIdx][0] += 1;
                    }
        
                    setAverage(copiedAverage);
                }

                if (toggle) {
                    if (selectedPlayerIdx !== players.length - 1){
                        if (players[selectedPlayerIdx + 1] !== "Select a player"){
                            setSelectedPlayerIdx(prev => prev + 1);
                        } else {
                            setSelectedPlayerIdx(0);
                        }
                        
                    } else {
                        setSelectedPlayerIdx(0);
                    }
                }
            }

            else if (stat === "RBI+" || (stat === "RBI-" && rbis[selectedPlayerIdx] > 0)){
                const copiedRBIs = [...rbis];
                if (stat === "RBI+"){
                    copiedRBIs[selectedPlayerIdx] += 1;
                } else {
                    copiedRBIs[selectedPlayerIdx] -= 1;
                }
                setRbis(copiedRBIs);
            }

            else if (stat === "SB+" || (stat === "SB-" && sbs[selectedPlayerIdx] > 0)){
                const copiedSbs = [...sbs];
                if (stat === "SB+"){
                    copiedSbs[selectedPlayerIdx] += 1;
                } else {
                    copiedSbs[selectedPlayerIdx] -= 1;
                }
                setSbs(copiedSbs);
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

    const handleChange = (e, idx) => {
        const copyTempPlayers = [...tempPlayers];
        let changeValue = true;
        for (let i = 0; i < copyTempPlayers.length; i++){
            if (e.target.value !== "Select a player" && copyTempPlayers[i] === e.target.value) {
                changeValue = false;
                break;
              }
        }
        if (changeValue){
            copyTempPlayers[idx] = e.target.value;
            setTempPlayers(copyTempPlayers);
        }
    }

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
                            sbs: plyr.sbs,
                            games: plyr.games,
                            walks: plyr.walks,
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
                                } else if (type === "Walk") {
                                    prevStats.walks += 1;
                                } else if (type === "Strikeout") {
                                    prevStats.strikeouts += 1;
                                } else if (type === "Out") {
                                    prevStats.outs += 1;
                                }
                            });
                            prevStats.sbs += sbs[idx];
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
    
    

    return (
        <>
        {loading ? (<h1>Loading Stats...</h1>) : (
                <>
            {formToggle && (
                <section className="new-game-form">
                    <form className="players-form" onSubmit={handleSubmitForm}>
                        <h1>Edit Players</h1>
                        {tempPlayers.map((player, idx) => (
                            <select key={idx} value={player} onChange={(e) => handleChange(e, idx)}>
                                <option value="Select a player">Select a player</option>
                                {data.players.map((playerData) => (
                                    <option key={playerData.name} value={playerData.name}>
                                        {playerData.name}
                                    </option>
                                ))}
                            </select>
                        ))}
                        <button type="submit" className="players-form-button">Confirm Changes</button>
                    </form>
                </section>
            )}
            <section className={`new-game ${formToggle ? "blurred" : ""}`}>
                <div className="header">
                    <h1>{data.name}</h1>
                    <Link className="link-button" to={`/menu/${teamName}`}>Menu</Link>
                </div>
                <h2>Submit Stats:</h2>
                <form className="form-submit-stats" onSubmit={handleSubmitStats}>
                    <label htmlFor="secret">Team Password</label>
                    <input id="secret" type="password" name="secret" value={secret} onChange={(e) => setSecret(e.target.value)} required/>
                    <button type="submit">Submit Stats</button>
                </form>
                <section className="offense-heading">
                    <h2>Offense:</h2>
                    <div>
                        <button className="layout" onClick={handleLayout}>{layout ? "2" : "1"}</button>
                        <button className="toggle" onClick={handleToggle}>{toggle ? "Auto" : "Manual"}</button>
                        <button onClick={handleFormToggle}>Lineup</button>
                    </div>
                </section>
                <section className="offense-boxes">
                    {players[0] === "Select a player" && (
                        <h2 className="empty-boxes">SELECT LINEUP ↗️</h2>
                    )}
                    {players.map((player, idx) => (
                        <div className={`box ${layout ? "two-box" : ""} ${(players[selectedPlayerIdx] !== "Select a player" && player === players[selectedPlayerIdx]) ? "selected" : ""} ${player === "Select a player" ? "hidden" : ""}`} key={idx}>
                            <label htmlFor={player}>
                                <div className="upperbox">
                                    <div className="player-name">{layout ? player.substring(0,4) + "." : player}</div>
                                    <div className="player-average">{average[idx][0]}/{average[idx][1]}</div>
                                    <div className="player-sbs">{sbs[idx]} {layout ? "" : "SB's"}</div>
                                    <div className="player-rbis">{rbis[idx]} {layout ? "" : "RBI's"}</div>
                                </div>
                                <div className="lowerbox">
                                    <div>{gameStats[idx].join(", ")}</div>
                                </div>
                            </label>
                        </div>
                    ))}
                </section>
                <section className="offense-good-buttons">
                    {goodButtons.map((btn) => (
                        <button key={btn} value={btn} onClick={handleClick}>{btn}</button>
                    ))}
                </section>
                <section className="offense-sbs-buttons">
                    <button key="SB+" value="SB+" onClick={handleClick}>SB+</button>
                    <button key="SB-" value="SB-" onClick={handleClick}>SB-</button>
                </section>
                <section className="offense-rbis-buttons">
                    <button value="RBI+" onClick={handleClick}>RBI+</button>
                    <button value="RBI-" onClick={handleClick}>RBI-</button>
                </section>
                <section className="offense-bad-buttons">
                    {badButtons.map((btn) => (
                        <button key={btn} value={btn} onClick={handleClick}>{btn}</button>
                    ))}
                </section>
                <button className="delete-button" onClick={handleDelete}>Delete Stat</button>
                <section className="offense-player-selector">
                    {players.map((player, idx) => (
                        <input key={idx} id={player} type="radio" name="selector" value={idx} checked={player === players[selectedPlayerIdx]} onChange={handleRadioChange} />
                    ))}
                </section>
            </section>
            </> )}
        </>
    );
};

export default NewGame;