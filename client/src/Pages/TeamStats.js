import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from '../Components/NavBar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
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
                    <Button className="ut-button mb-2" onClick={() => setView(prev => !prev)}>Change View</Button>
                </Col></Row>
                {view ? (
                    <Row><Col>
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    <th>Player</th>
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
                                    <th>OPS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.players.map((player, idx) => (
                                    <tr key={"stats_" + idx}>
                                        <td>{player.name}</td>
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
                        </Table>
                    </Col></Row>
                ) : (
                    <Row><Col>
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>G</th>
                                    <th>AB</th>
                                    <th>H</th>
                                    <th>2B</th>
                                    <th>3B</th>
                                    <th>HR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.players.map((pl, idx) => (
                                    <tr key={idx + 'T1'}>
                                        <td>{pl.name}</td>
                                        <td>{pl.games}</td>
                                        <td>{pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs}</td>
                                        <td>{pl.singles + pl.doubles + pl.triples + pl.homeruns}</td>
                                        <td>{pl.doubles}</td>
                                        <td>{pl.triples}</td>
                                        <td>{pl.homeruns}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>G</th>
                                    <th>AB</th>
                                    <th>RBI</th>
                                    <th>BB</th>
                                    <th>K</th>
                                    <th>SB</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.players.map((pl, idx) => (
                                    <tr key={idx + 'T2'}>
                                        <td>{pl.name}</td>
                                        <td>{pl.games}</td>
                                        <td>{pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs}</td>
                                        <td>{pl.rbis}</td>
                                        <td>{pl.walks}</td>
                                        <td>{pl.strikeouts}</td>
                                        <td>{pl.sbs}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </Table>
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>G</th>
                                    <th>AB</th>
                                    <th>AVG</th>
                                    <th>OBP</th>
                                    <th>SLG</th>
                                    <th>OPS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.players.map((pl, idx) => (
                                    <tr key={idx + 'T2'}>
                                        <td>{pl.name}</td>
                                        <td>{pl.games}</td>
                                        <td>{pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs}</td>
                                        <td>{((pl.singles + pl.doubles + pl.triples + pl.homeruns) / (pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs)).toFixed(2)}</td>
                                        <td>{((pl.singles + pl.doubles + pl.triples + pl.homeruns) / (pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs)).toFixed(2)}</td>
                                        <td>{((pl.singles + 2 * pl.doubles + 3 * pl.triples + 4 * pl.homeruns) / (pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs)).toFixed(2)}</td>
                                        <td>{(((pl.singles + 2 * pl.doubles + 3 * pl.triples + 4 * pl.homeruns) / (pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs)) + ((pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.walks) / (pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs + pl.walks))).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col></Row>
                )}
            </>  
            )}
        </Container>
    );
};

export default TeamStats;
