import { memo, useState, useCallback } from 'react';
import update from 'immutability-helper';
import { useDrop } from 'react-dnd';
import { Player, Sub, Lineup } from '../Components/Lineup';
import ItemTypes from '../Types/NewGameTypes';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const DndRosterContainer = ({lineupCards, setLineupCards, playersList}) => {
    const roster = playersList.filter(player => Object.keys(player).length && !player.isSub);
    const subs = playersList.filter(player => player.isSub);
    const [rosterCards, setRosterCards] = useState(roster);
    const [subsCards, setSubsCards] = useState(subs);

    return (
      <Container className='maxHeight'>
        <Row className='maxHeight'>
          <Col xs={6} className='maxHeight'>
            {/* <div ref={drop} style={{ overflow: 'hidden', clear: 'both' }}> */}
            <Card id="lineup" className='maxHeight' style={{height: '100%', overflow: 'hidden', clear: 'both' }}>
              <Lineup lineupCards={lineupCards} />
              {/* <Lineup findCard={findCard} moveCard={moveCard}/> */}
            </Card>
          </Col>
          <Col>
            <Tabs fill>
              <Tab className="isATab" eventKey="roster" title="Roster">
                <Card>
                  <ListGroup variant="flush" style={{ overflow: 'hidden', clear: 'both' }}>
                    {rosterCards.map( (player,idx) => !Object.keys(player).length ? null : <Player key={"RosterBench_" + idx} player={player} setLineupCards={setLineupCards} setRosterCards={setRosterCards} idx={idx}/> )}
                  </ListGroup>
                </Card>
              </Tab>
              <Tab className="isATab" eventKey="subs" title="Subs">
                <Card>
                  <ListGroup variant="flush" style={{ overflow: 'hidden', clear: 'both' }}>
                    {subsCards.map( (player, idx) =>  !Object.keys(player).length ? null : <Sub key={"SubsBench" + idx} player={player} setLineupCards={setLineupCards} setSubsCards={setSubsCards} idx={idx} /> )}
                  </ListGroup>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    )
};
  
export default DndRosterContainer
