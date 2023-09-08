import React, { useState } from 'react';
import { Gavilanes } from './DummyData';

const NewGame = () => {

    const [players, setPlayers] = useState([
        "Alonso",
        "Guerra",
        "Miguel",
        "Rogelio"
    ])

    const [gameStats, setGameStats] = useState([
        ["Single", "Strikeout", "Double", "Triple"],
        ["Single", "Strikeout", "Double", "Triple"],
        ["Single", "Strikeout", "Double", "Triple"],
        ["Single", "Strikeout", "Double", "Triple"]
    ])

    const [rbis, setRbis] = useState([
        0,
        0,
        0,
        0
    ])

    const [sbs, setSbs] = useState([
        0,
        0,
        0,
        0
    ])

    const [average, setAverage] = useState([
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ])

    const [selectedPlayerIdx, setSelectedPlayerIdx] = useState(0);

    const goodButtons = ["Single", "Double", "Triple", "Homerun", "Walk"]
    const badButtons = ["Out", "Strikeout"];

    const handleRadioChange = (e) => {
        setSelectedPlayerIdx(e.target.value);
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


    return (
        <section className="new-game">
            <h1>Gavilanes</h1>
            <h2>Current Team Players: </h2>
            <p className="players-list">
                {Gavilanes.players.map((player) => {
                    return player.name;
                }).join(", ")}
            </p>
            <h2>Offense:</h2>
            <section className="offense-boxes">
                {players.map((player, idx) => (
                    <div className={`box ${player === players[selectedPlayerIdx] ? "selected" : ""}`} key={player}>
                        <label htmlFor={player}>
                            <div className="upperbox">
                                <div className="player-name">{player}</div>
                                <div className="player-average">{average[idx][0]}/{average[idx][1]}</div>
                                <div className="player-sbs">{sbs[idx]} SB's</div>
                                <div className="player-rbis">{rbis[idx]} RBI's</div>
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
                    <input key={player} id={player} type="radio" name="selector" value={idx} checked={player === players[selectedPlayerIdx]} onChange={handleRadioChange} />
                ))}
            </section>
        </section>
    );
};

export default NewGame;