import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const TeamStats = () => {

    const { teamName } = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(false);

    useEffect(() => {
        const func = async () => {
            const docRef = doc(db, "teams", teamName);
            const docSnap = await getDoc(docRef);
            setData(docSnap.data());
            setLoading(false);
        }

        func();
    }, [teamName]);

    return (
        <Container>
            {loading 
                ? (<Row><Col><h1 className="loading">Loading Stats...</h1><NavBar/></Col></Row>) 
                : (
                <>
                <Row><Col>
                    <NavBar teamName={teamName}/>
                </Col></Row>
                <Row><Col>
                <button className="ut-button" onClick={() => setView(prev => !prev)}>Change View</button>
                </Col></Row>
                {view ? (
                    <Row><Col>
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{textAlign: "left"}}>Player</th>
                                        <th>G</th>
                                        <th>AB</th>
                                        <th>H</th>
                                        <th>2B</th>
                                        <th>3B</th>
                                        <th>HR</th>
                                        <th>RBI</th>
                                        <th>BB</th>
                                        <th>K</th>
                                        <th>AVG</th>
                                        <th>OBP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.players.map((player, idx) => (
                                        <tr key={idx}>
                                            <td style={{textAlign: "left"}}>{player.name}</td>
                                            <td>{player.games}</td>
                                            <td>{player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs}</td>
                                            <td>{player.singles + player.doubles + player.triples + player.homeruns}</td>
                                            <td>{player.doubles}</td>
                                            <td>{player.triples}</td>
                                            <td>{player.homeruns}</td>
                                            <td>{player.rbis}</td>
                                            <td>{player.strikeouts}</td>
                                            <td>{((player.singles + player.doubles + player.triples + player.homeruns) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs)).toFixed(2)}</td>
                                            <td>{((player.singles + player.doubles + player.triples + player.homeruns) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs)).toFixed(2)}</td>
                                            <td>{((player.singles + 2 * player.doubles + 3 * player.triples + 4 * player.homeruns) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs)).toFixed(2)}</td>
                                            <td>{(((player.singles + 2 * player.doubles + 3 * player.triples + 4 * player.homeruns) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs)) + ((player.singles + player.doubles + player.triples + player.homeruns) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs))).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Col></Row>
                ) : (
                    <Row><Col>
                        <div className="ut-view">
                            <section className="ut">
                                <div className="ut-players ut-2 ut-col">
                                    <div className="ut-header">Player</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.name}</div>
                                    ))}
                                </div>
                                <div className="ut-games ut-1 ut-col">
                                    <div className="ut-header">G</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.games}</div>
                                    ))}
                                </div>
                                <div className="ut-atbats ut-1 ut-col">
                                    <div className="ut-header">AB</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs}</div>
                                    ))}
                                </div>
                                <div className="ut-hits ut-1 ut-col">
                                    <div className="ut-header">H</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.singles + pl.doubles + pl.triples + pl.homeruns}</div>
                                    ))}
                                </div>
                                <div className="ut-doubles ut-1 ut-col">
                                    <div className="ut-header">2B</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.doubles}</div>
                                    ))}
                                </div>
                                <div className="ut-triples ut-1 ut-col">
                                    <div className="ut-header">3B</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.triples}</div>
                                    ))}
                                </div>
                                <div className="ut-homeruns ut-1 ut-col">
                                    <div className="ut-header">HR</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.homeruns}</div>
                                    ))}
                                </div>
                            </section>
                            <section className="ut">
                                <div className="ut-players ut-2 ut-col">
                                    <div className="ut-header">Player</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.name}</div>
                                    ))}
                                </div>
                                <div className="ut-games ut-1 ut-col">
                                    <div className="ut-header">G</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.games}</div>
                                    ))}
                                </div>
                                <div className="ut-atbats ut-1 ut-col">
                                    <div className="ut-header">AB</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs}</div>
                                    ))}
                                </div>
                                <div className="ut-rbis ut-1 ut-col">
                                    <div className="ut-header">RBI</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.rbis}</div>
                                    ))}
                                </div>
                                <div className="ut-strikeouts ut-1 ut-col">
                                    <div className="ut-header">K</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.strikeouts}</div>
                                    ))}
                                </div>
                            </section>
                            <section className="ut">
                                <div className="ut-players ut-2 ut-col">
                                    <div className="ut-header">Player</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.name}</div>
                                    ))}
                                </div>
                                <div className="ut-games ut-1 ut-col">
                                    <div className="ut-header">G</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.games}</div>
                                    ))}
                                </div>
                                <div className="ut-atbats ut-1 ut-col">
                                    <div className="ut-header">AB</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs}</div>
                                    ))}
                                </div>
                                <div className="ut-avg ut-1 ut-col">
                                    <div className="ut-header">AVG</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{((pl.singles + pl.doubles + pl.triples + pl.homeruns) / (pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs)).toFixed(2)}</div>
                                    ))}
                                </div>
                                <div className="ut-obp ut-1 ut-col">
                                    <div className="ut-header">OBP</div>
                                    {data.players.map((pl, idx) => (
                                        <div key={idx}>{((pl.singles + pl.doubles + pl.triples + pl.homeruns) / (pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs)).toFixed(2)}</div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </Col></Row>
                )}
            </>  
            )}
        </Container>
    );
};

export default TeamStats;
