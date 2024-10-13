import { useState } from 'react';
import { PlayerPlaying, Lineup, useDndDrop } from '../Components/Lineup';
import ItemTypes from '../Types/NewGameTypes';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const DndRosterContainer = ({lineupCards, setLineupCards, allPlayers, setAllPlayers}) => {
    const roster = allPlayers.filter(player => Object.keys(player).length && !player.isSub);
    const subs = allPlayers.filter(player => player.isSub);
    const [rosterCards, setRosterCards] = useState(roster);
    const [subsCards, setSubsCards] = useState(subs);
    // const { drop, backgroundColor, isActive } = useDndDrop(ItemTypes.LINEUP, 'Sub');
    
    const PlayersInTabs = ({cards, setFunction, removeFunction, type, name}) => {
      const { drop, backgroundColor } = useDndDrop(ItemTypes.LINEUP, 'bench');
      const capitalName = name.charAt(0).toUpperCase() + name.slice(1);
      return (
        <Card>
          <ListGroup variant="flush" ref={drop} style={{ overflow: 'hidden', clear: 'both', backgroundColor: {backgroundColor}}}>
            {cards.map( (player,idx) => !Object.keys(player).length ? null : <PlayerPlaying key={capitalName + "Bench" + idx} player={player} setFunction={setFunction} removeFunction={removeFunction} idx={idx} type={type} name={name} /> )}
          </ListGroup>
        </Card>
      )
    }

    return (
      <Container className='maxHeight'>
        <Row className='maxHeight'>
          <Col xs={6} className='maxHeight'>
            {/* <div ref={drop} style={{ overflow: 'hidden', clear: 'both' }}> */}
            <Card id="lineup" className='maxHeight' style={{height: '100%', overflow: 'hidden', clear: 'both' }}>
              <Lineup lineupCards={lineupCards} setFunction={setAllPlayers} removeFunction={setLineupCards}/>
              {/* <Lineup findCard={findCard} moveCard={moveCard}/> */}
            </Card>
          </Col>
          <Col>
            <Tabs fill>
              <Tab className="isATab" eventKey={'roster'} title={'Roster'}>
                <PlayersInTabs cards={rosterCards} setFunction={setLineupCards} removeFunction={setRosterCards} type={ItemTypes.ROSTER} name='roster' />
              </Tab>
              <Tab className="isATab" eventKey={'subs'} title={'Subs'}>
                <PlayersInTabs cards={subsCards} setFunction={setLineupCards} removeFunction={setSubsCards} type={ItemTypes.SUB} name='subs' />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    )
};
  
export default DndRosterContainer
