import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from '../Components/NavBar';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import SplitButton from 'react-bootstrap/SplitButton';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const TeamStats = () => {

    const { teamName } = useParams();
    const [players, setPlayers] = useState({});
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('oneTableRadio');
    const [activeFilters, setActiveFilters] = useState(() => new Set());
    const [sortBy, setSortBy] = useState('name');
    const [sortAsc, setSortAsc] = useState(true);
    const [showToolTip, setShowToolTip] = useState('');
    /*
    Season year
    Game #
    Team name
    Win/Loss
    Our Score
    Their Score
    Playoff Game
    Practice Game
    Lineup?
    */

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
            id: 'winsCheckbox',
            label: "Wins",
            nameField: "victory",
        },
        {
            id:'playOffCheckbox',
            label:"Playoff Games",
            nameField:"playoffGames",
        },
        {
            id:'practiceCheckbox',
            label:"Practice Games",
            nameField:"practiceGames",
        }
    ];

    const sortOptions = [
        {
            id: 'gameNumberRadio',
            label: "Game Number",
            stat:'id'
        },
        {
            id: 'teamNameRadio',
            label: "Name",
            stat:'them'
        },
        {
            id: 'ourScoreRadio',
            label: "Our Score",
            stat:'ourScore'
        },
        {
            id: 'theirScoreRadio',
            label: "Their Score",
            stat:'theirScore'
        },
    ];

    function showSortSVG(sortAsc){
        return (sortAsc ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z"/>
                <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z"/>
            </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-sort-alpha-up-alt" viewBox="0 0 16 16">
                <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645z"/>
                <path fillRule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371zm1.57-.785L11 9.688h-.047l-.652 2.156z"/>
                <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z"/>
            </svg>
        )
    }


    function determineSort(a, b, sortAsc) {
        if (sortAsc)
            return a[sortBy] > b[sortBy] ? 1 : -1
        else 
            return a[sortBy] > b[sortBy] ? -1 : 1
    }

    function determineFilter(player, activeFilters) {
        const [showSubs, noGamesPlayed] = filterOptions;
        if(!activeFilters.has(showSubs.id) && player.isSub)
            return false;
        if(!activeFilters.has(noGamesPlayed.id) && !player.games)
            return false
        return true;
    }

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
            <Container className='mx-0'>
                {loading
                    ? (<Row><Col><h1 className="loading">Loading Team Stats...</h1></Col></Row>) 
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
                                                onChange={ e => e.currentTarget.checked ? addItem(element.id) : removeItem(element.id) }
                                            />
                                        )}
                                    </Form>
                                </DropdownButton>
                                <SplitButton
                                    id={'sortDirection'}
                                    title={showSortSVG(sortAsc)}
                                    as={ButtonGroup} 
                                    variant={'primary'} 
                                    className='w-100 whiteBorder directChildp-1'
                                    autoClose='outside'
                                    onClick={() => setSortAsc((prev => !prev))}
                                >
                                    <Form className='ps-2'>
                                        {sortOptions.map((element, idx) =>
                                            <Form.Check
                                                label={element.label}
                                                name={element.id}
                                                type={'radio'}
                                                id={element.id}
                                                checked={element.stat === sortBy}
                                                key={element.id.replace(" ", "_") + idx}
                                                className='whiteBorder'
                                                onChange={() => setSortBy(element.stat)}
                                            />
                                        )}
                                    </Form>
                                </SplitButton>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row><Col>
                        {seasonsInfo.map(season => {

                        })}
                        <h2></h2>
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    {statNames.map(stat => (
                                        <OverlayTrigger
                                            key= {stat.id + "Tooltip"}
                                            placement="top"
                                            overlay= {
                                                <Tooltip id={`tooltip-above`}>
                                                    {stat.fullName}
                                                </Tooltip>
                                            }
                                        >
                                            <th><span className='underlineTableHeader'>{stat.stat}</span></th> 
                                        </OverlayTrigger>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {players.sort((a,b) => determineSort(a,b, sortAsc))
                                .filter(player => determineFilter(player, activeFilters)).map((player, idx) => (
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
                </>  
                )}
            </Container>
        </>
    );
};

export default TeamStats;
