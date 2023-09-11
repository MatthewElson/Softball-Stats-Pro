import React, { useState } from 'react';
import { teams } from './DummyData';
import { Link, useParams } from "react-router-dom";

const NewGame = () => {

    const { teamName } = useParams();
    const [players, setPlayers] = useState(["Alonso", "Guerra", "Miguel", "Rogelio", "Manuel", "José", "Marcelo", "Eugenio", "Wicho", "Mauricio"])
    const [tempPlayers, setTempPlayers] = useState(players);
    const [gameStats, setGameStats] = useState([[], [], [], [], [], [], [], [], [], []]);
    const [rbis, setRbis] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [sbs, setSbs] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [average, setAverage] = useState([[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]);
    const [selectedPlayerIdx, setSelectedPlayerIdx] = useState(0);
    const [toggle, setToggle] = useState(false);
    const [formToggle, setFormToggle] = useState(false);
    const [layout, setLayout] = useState(true)
    const [secret, setSecret] = useState("");
    const goodButtons = ["Single", "Double", "Triple", "Homerun", "Walk"]
    const badButtons = ["Out", "Strikeout"];

    const handleRadioChange = (e) => {
        setSelectedPlayerIdx(Number(e.target.value));
    }

    const handleClick = (e) => {

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
                    setSelectedPlayerIdx(prev => prev + 1);
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
            if (copyTempPlayers[i] === e.target.value) {
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
    
    const handleSubmitStats = (e) => {
        e.preventDefault();
        if (teams[0].secret === secret){
            alert("Stats have been successfully submited!");
        }
        else {
            alert("Wrong team password!")
        }
    }

    return (
        <>
            {formToggle && (
                <section className="new-game-form">
                    <form className="players-form" onSubmit={handleSubmitForm}>
                        <h1>Edit Players</h1>
                        {tempPlayers.map((player, idx) => (
                            <input key={idx} type="text" id={player} value={player} onChange={(e) => handleChange(e, idx)} />
                        ))}
                        <button type="submit" className="players-form-button">Confirm Changes</button>
                    </form>
                </section>
            )}
            <section className={`new-game ${formToggle ? "blurred" : ""}`}>
                <div className="header">
                    <h1>{teams[0].name}</h1>
                    <Link className="link-button" to={`/menu/${teamName}`}>Menu</Link>
                </div>
                <h2>Current Team Players: </h2>
                <p className="players-list">
                    {teams[0].players.map((player) => {
                        return player.name;
                    }).join(", ")}
                </p>
                <h2>Publish Stats:</h2>
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
                        <button onClick={handleFormToggle}>Change Players</button>
                    </div>
                </section>
                <section className="offense-boxes">
                    {players.map((player, idx) => (
                        <div className={`box ${layout ? "two-box" : ""} ${player === players[selectedPlayerIdx] ? "selected" : ""}`} key={idx}>
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
                <section className="offense-player-selector">
                    {players.map((player, idx) => (
                        <input key={idx} id={player} type="radio" name="selector" value={idx} checked={player === players[selectedPlayerIdx]} onChange={handleRadioChange} />
                    ))}
                </section>
            </section>
        </>
    );
};

export default NewGame;