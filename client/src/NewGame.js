import React, { useState } from 'react';
import { Gavilanes } from './DummyData';

const NewGame = () => {

    const [players, setPlayers] = useState([
        "Alonso",
        "Guerra"
    ])

    const [gameStats, setGameStats] = useState([
        ["Single", "Strikeout", "Double", "Triple"],
        ["Single", "Strikeout", "Double", "Triple"]
    ])

    const [rbis, setRbis] = useState([
        0,
        0
    ])

    const [average, setAverage] = useState([
        [0, 0],
        [0, 0]
    ])

    const goodButtons = ["Single", "Double", "Triple", "Homerun", "Walk", "Stolen Base"];
    const badButtons = ["Out", "Strikeout"];


    return (
        <section className="new-game">
            <h1>Gavilanes</h1>
            <h2>Current Team Players: </h2>
            <p className="players-list">
                {Gavilanes.players.map((player) => {
                    return player.name;
                }).join(", ")}
            </p>
            <h2>Offense</h2>
            <section className="offense-boxes">
                {players.map((player, idx) => (
                    <div className="box" key={player}>
                        <div className="upperbox">
                            <div>{player}</div>
                            <div>{average[idx][0]}/{average[idx][1]}</div>
                            <div>{rbis[idx]} RBI's</div>
                        </div>
                        <div className="lowerbox">
                            <div>{gameStats[idx].join(", ")}</div>
                        </div>
                    </div>
                ))}
            </section>
            <section className="offense-good-buttons">
                {goodButtons.map((btn) => (
                    <button className="good-button" key={btn} value={btn}>{btn}</button>
                ))}
            </section>
            <section className="offense-bad-buttons">
                {badButtons.map((btn) => (
                    <button key={btn} value={btn}>{btn}</button>
                ))}
            </section>
        </section>
    );
};

export default NewGame;