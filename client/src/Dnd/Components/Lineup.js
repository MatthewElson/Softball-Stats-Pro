import { useCallback, memo } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import ItemTypes from '../Types/NewGameTypes';
import update from 'immutability-helper';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

function Lineup ({ lineupCards }) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
      accept: [ItemTypes.ROSTER, ItemTypes.SUB],
      drop: () => ({ name: 'lineup' }),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      })
  }));

  const isActive = canDrop && isOver;
  let backgroundColor = 'secondary';
  if (isActive)
    backgroundColor = 'warning';
  else if (canDrop)
    backgroundColor = 'success';

  return (
      <Badge className='maxHeight' bg={backgroundColor} ref={drop} variant="success" data-testid="lineup">
          <p>{isActive ? 'Release to add player' : 'Drag a player here'}</p>
          <ListGroup variant="flush" style={{ overflow: 'hidden', clear: 'both' }}>
            {lineupCards.map( (player, idx) => {
              return <Sub key={"playerInLineup" + idx} id={"Sub_" + idx} player={player}/>
            })}
          </ListGroup>
      </Badge>
  )
};

function DndFunctionality(type, item, setFunction, removeFunction, idx){
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: item,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        console.log(`You dropped ${item.name} into ${dropResult.name}!`);
        console.log('item :', item);
        // setLineupCards([...lineupCards, item]);
        setFunction((prev) => update(prev, {$push:[item]}));

        if(removeFunction)
          removeFunction((prev) => update(prev, {[idx]:{$set: {}}}) );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))
  const opacity = isDragging ? 0.4 : 1;
  return { drag, opacity };
}


function Player({ player, setLineupCards, setRosterCards, idx}) {
  const {drag, opacity} = DndFunctionality(ItemTypes.ROSTER, player, setLineupCards, setRosterCards, idx);

  return (
    <ListGroup.Item ref={drag} style={{ opacity }} data-testid={`player`}>
      {player.name}
    </ListGroup.Item>
  )
}

//id={idx} setLineupCards={setLineupCards} subsCards={subsCards} setSubsCards={setSubsCards} player={player}
function Sub({player, setLineupCards, setSubsCards, idx }) {
      const {drag, opacity} = DndFunctionality(ItemTypes.SUB, player, setLineupCards, setSubsCards, idx);
      return (
        <ListGroup.Item ref={drag} style={{ opacity }} data-testid={`sub`}>
          {player.name}
        </ListGroup.Item>
      )
}

export {Lineup, Player, Sub};
