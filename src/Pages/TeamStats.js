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
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';

const TeamStats = () => {

    const { teamName } = useParams();
    const [players, setPlayers] = useState({});
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('oneView');
    const [activeFilters, setActiveFilters] = useState(() => new Set());
    const [sortBy, setSortBy] = useState('');
    const statNames = [                                        
        {
            id: 'name',
            fullName: 'Player Name',
            shortName: 'Player',
        },
        {
            id: 'games',
            fullName: 'Games',
            shortName: 'G',
        },
        {
            id: 'atBat',
            fullName: 'Times At Bat',
            shortName: 'AB',
        },
        {
            id: 'firstBase',
            fullName: '1st Base',
            shortName: '1B',
        },
        {
            id: 'secondBase',
            fullName: '2nd Base',
            shortName: '2B',
        },
        {
            id: 'thirdBase',
            fullName: '3rd Base',
            shortName: '3B',
        },
        {
            id: 'homeRun',
            fullName: 'Home Run',
            shortName: 'HR',
        },
        {
            id: 'rbis',
            fullName: 'RBIs',
            shortName: 'RBI',
        },
        {
            id: 'strikeOut',
            fullName: 'Strikeouts',
            shortName: 'K',
        },
        {
            id: 'averageBats',
            fullName: 'Average',
            shortName: 'AVG',
        }
    ]

    const addItem = item => {
        setActiveFilters(prev => new Set(prev).add(item));
    }
    const removeItem = item => {
        setActiveFilters(prev => {
            const next = new Set(prev);
            next.delete(item);
            return next;
        });
    }

    const viewOptions = [
        {
            id: 'oneTableRadio',
            label: "One Table",
            nameField: 'oneTable',
        },
        {
            id: 'multiTableRadio',
            label: "Multiple Tables",
            nameField: 'multiTable',
        },
    ]

    const filterOptions = [
        {
            id: 'showSubsCheckbox',
            label: "Show Subs",
            nameField: "showSubs",
        },
        {
            id:'noGamesPlayedCheckbox',
            label:"Show 0 Games Played",
            nameField:"noGamesPlayed",
        }
    ];

    const sortOptions = [
        {
            id: 'playerNameRadio',
            label: "Player Name",
            stat:'name'
        },
        {
            id: 'singlesRadio',
            label: "Singles",
            stat:'singles'
        },
        {
            id: 'doublesRadio',
            label: "Doubles",
            stat:'doubles'
        },
        {
            id: 'triplesRadio',
            label: "Triples",
            stat:'triples'
        },
        {
            id: 'homerunsRadio',
            label: "Homeruns",
            stat:'homeruns'
        },
        {
            id: 'battingAverageRadio',
            label: "Batting Average",
            stat:'avg'
        },
        {
            id: 'rbisRadio',
            label: "RBIs",
            stat:'rbis'
        },
    ];

    useEffect(() => {
        const func = async () => {
            const docRef = doc(db, "teams", teamName);
            const docSnap = await getDoc(docRef);
            setPlayers(docSnap.data().players.sort());
            setLoading(false);
        }

        func();
    }, [teamName]);


    return (
        <>
            <NavBar teamName={teamName}/>
            <Container className='mx-0 px-2'>
                {loading 
                    ? (<Row><Col><h1 className="loading">Loading Stats...</h1></Col></Row>) 
                    : (
                    <>
                    <Row className='mb-2'>
                        <Col>
                            <ButtonGroup className='my-1 w-100'>
                                <DropdownButton as={ButtonGroup} id={'dropdown-views'} variant={'primary'} title={'Views'} className='w-100 whiteBorder' autoClose={'outside'}>
                                    <Form className='ps-2'>
                                        {viewOptions.map((element, idx) =>
                                            <Form.Check 
                                                label={element.label}
                                                name={element.id}
                                                type={'radio'}
                                                id={element.id}
                                                checked={element.id === view}
                                                key={element.id.replace(" ", "_") + idx}
                                                onChange={() => setView(element.id)}
                                            />
                                        )}
                                    </Form>
                                </DropdownButton>
                                <DropdownButton as={ButtonGroup} id={'dropdown-filters'} variant={'primary'} title={'Filters'} className='w-100 whiteBorder' autoClose='outside'>
                                    <Form className='ps-2'>
                                        {filterOptions.map((element, idx) =>
                                            <Form.Check
                                                label={element.label}
                                                name={element.id}
                                                type={'checkbox'}
                                                id={element.id}
                                                checked={activeFilters.has(element.id)}
                                                key={element.id.replace(" ", "_") + idx}
                                                onChange={ e => {
                                                    console.log('e.v',e.currentTarget.checked);
                                                    return e.currentTarget.checked ?  
                                                    addItem(element.id) : 
                                                    removeItem(element.id) }}
                                            />
                                        )}
                                    </Form>
                                </DropdownButton>
                                <DropdownButton as={ButtonGroup} id={'dropdown-sort'} variant={'primary'} title={'Sort'} className='w-100 whiteBorder' autoClose='outside'>
                                    <Form className='ps-2'>
                                        {sortOptions.map((element, idx) =>
                                            <Form.Check
                                                label={element.label}
                                                name={element.id}
                                                type={'radio'}
                                                id={element.id}
                                                checked={element.id === sortBy}
                                                key={element.id.replace(" ", "_") + idx}
                                                onChange={() => setSortBy(element.id)}
                                            />
                                        )}
                                    </Form>
                                </DropdownButton>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    {view ? (
                        <Row><Col>
                            <Table striped bordered hover responsive size="sm">
                                <thead>
                                    <tr>
                                        {statNames.map(stat => <th key={stat.id}>{stat.shortName}</th> )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(true ?  players : players.sort((a,b) => a[sortBy.stat] > b[sortBy.stat]).filter(player => !player.isSub)).map((player, idx) => (
                                        <tr key={"stats_" + idx}>
                                            <td>{player.name}</td>
                                            <td>{player.games}</td>
                                            <td>{player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs}</td>
                                            <td>{player.singles}</td>
                                            <td>{player.doubles}</td>
                                            <td>{player.triples}</td>
                                            <td>{player.homeruns}</td>
                                            <td>{player.rbis}</td>
                                            <td>{player.strikeouts}</td>
                                            <td>{((player.singles + player.doubles + player.triples + player.homeruns) / (player.singles + player.doubles + player.triples + player.homeruns + player.strikeouts + player.outs)).toFixed(2)}</td>
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
                                        <th>1B</th>
                                        <th>2B</th>
                                        <th>3B</th>
                                        <th>HR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(filterOptions.get('showSubs').checked ?  players : players.filter(player => !player.isSub)).map((pl, idx) => (
                                        <tr key={idx + 'T1'}>
                                            <td>{pl.name}</td>
                                            <td>{pl.games}</td>
                                            <td>{pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs}</td>
                                            <td>{pl.singles}</td>
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
                                        <th>K</th>
                                        <th>AVG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(filterOptions.showSubs.checked ?  players : players.filter(player => !player.isSub)).map((pl, idx) => (
                                        <tr key={idx + 'T2'}>
                                            <td>{pl.name}</td>
                                            <td>{pl.games}</td>
                                            <td>{pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs}</td>
                                            <td>{pl.rbis}</td>
                                            <td>{pl.strikeouts}</td>
                                            <td>{((pl.singles + pl.doubles + pl.triples + pl.homeruns) / (pl.singles + pl.doubles + pl.triples + pl.homeruns + pl.strikeouts + pl.outs)).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col></Row>
                    )}
                </>  
                )}
            </Container>
        </>
    );
};

export default TeamStats;
