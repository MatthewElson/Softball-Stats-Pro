import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { teams } from './DummyData';

const TeamStats = () => {

    const { teamName } = useParams();

    return (
        <section className="team-stats">
            <div className="header">
                    <h1>{teams[0].name}</h1>
                    <Link className="link-button" to={`/menu/${teamName}`}>Menu</Link>
            </div>
            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th style={{textAlign: "left"}}>Player</th>
                            <th>G</th>
                            <th>AB</th>
                            <th>H</th>
                            <th>1B</th>
                            <th>2B</th>
                            <th>3B</th>
                            <th>HR</th>
                            <th>RBI</th>
                            <th>BB</th>
                            <th>K</th>
                            <th>SB</th>
                            <th>AVG</th>
                            <th>OBP</th>
                            <th>SLG</th>
                            <th>OPS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams[0].players.map((player, idx) => (
                            <tr key={idx}>
                                <td style={{textAlign: "left"}}>{player.name}</td>
                                <td>{player.games}</td>
                                <td>{player.singles}</td>
                                <td>{player.singles + player.doubles + player.triples + player.homeruns}</td>
                                <td>{player.singles}</td>
                                <td>{player.doubles}</td>
                                <td>{player.triples}</td>
                                <td>{player.homeruns}</td>
                                <td>{player.rbis}</td>
                                <td>{player.walks}</td>
                                <td>{player.strikeouts}</td>
                                <td>{player.sbs}</td>
                                <td>{((player.singles + player.doubles + player.triples + player.homeruns) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs)).toFixed(2)}</td>
                                <td>{((player.singles + player.doubles + player.triples + player.homeruns + player.walks) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs + player.walks)).toFixed(2)}</td>
                                <td>{((player.singles + 2 * player.doubles + 3 * player.triples + 4 * player.homeruns) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs)).toFixed(2)}</td>
                                <td>{(((player.singles + 2 * player.doubles + 3 * player.triples + 4 * player.homeruns) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs)) + ((player.singles + player.doubles + player.triples + player.homeruns + player.walks) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs + player.walks))).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>   
        </section>
    );
};

export default TeamStats;