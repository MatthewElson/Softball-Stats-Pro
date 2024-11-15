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

const DndRosterContainer = ({lineupCards, setLineupCards, allPlayers, removePlayerFromFunctions }) => {

  const roster = allPlayers.filter(player => {
      const lineupCardHasPlayerName = lineupCards.some(lineupCard => lineupCard.name === player.name);
      if(!lineupCardHasPlayerName)
        return Object.keys(player).length && !player.isSub;
      return null;
    });
    const subs = allPlayers.filter(player => {
      const lineupCardHasPlayerName = lineupCards.some(lineupCard => lineupCard.name === player.name);
      if(!lineupCardHasPlayerName)
        return player.isSub;
      return null;
    });
    const [rosterCards, setRosterCards] = useState(roster);
    const [subsCards, setSubsCards] = useState(subs);
    // const { drop, backgroundColor, isActive } = useDndDrop(ItemTypes.LINEUP, 'Sub');
    
    const PlayersInTabs = ({cards, setFunction, type, name, removePlayerFromFunctions}) => {
      const { drop, backgroundColor } = useDndDrop(ItemTypes.LINEUP, 'bench', 'white');
      const capitalName = name.charAt(0).toUpperCase() + name.slice(1);
      return (
        <Card bg={backgroundColor} className='isFullWidth'>
          <ListGroup variant="flush" ref={drop} className='isFullHeight isFullWidth'>
            {cards.map( (player,idx) => !Object.keys(player).length ? null : <PlayerPlaying key={capitalName + "Bench" + idx} player={player} setFunction={setFunction} removePlayerFromFunctions={removePlayerFromFunctions} idx={idx} type={type} name={name}/> )}
          </ListGroup>
        </Card>
      )
    }

    return (
      <Container id='createLineupContainer' className='maxHeight'>
        <Row className='maxHeight'>
          <Col xs={6} id='newLineupContainer'>
            {/* <div ref={drop} style={{ overflow: 'hidden', clear: 'both' }}> */}
            
              <Lineup lineupCards={lineupCards} setFunction={[setRosterCards, setSubsCards]} removePlayerFromFunctions={[setLineupCards, ...removePlayerFromFunctions]}/>
              {/* <Lineup findCard={findCard} moveCard={moveCard}/> */}
            
          </Col>
          <Col id='playersTabsContainer'>
            <Tabs fill>
              <Tab eventKey={'roster'} title={'Roster'} className='isFullHeight isFullWidth'>
                <PlayersInTabs cards={rosterCards} setFunction={setLineupCards} type={ItemTypes.ROSTER} name='roster' removePlayerFromFunctions={[setRosterCards]}/>
              </Tab>
              <Tab eventKey={'subs'} title={'Subs'} className='isFullHeight isFullWidth'>
                <PlayersInTabs cards={subsCards} setFunction={setLineupCards} type={ItemTypes.SUB} name='subs' removePlayerFromFunctions={[setSubsCards]}/>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    )
};
  
export default DndRosterContainer
