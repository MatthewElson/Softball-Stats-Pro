import React, { useCallback, memo } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import ItemTypes from '../Types/NewGameTypes';
import update from 'immutability-helper';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

function Lineup ({ lineupCards, setFunction, removeFunction }) {
  const { drop, backgroundColor, isActive } = useDndDrop([ItemTypes.ROSTER, ItemTypes.SUB], 'lineup')
  // player, setFunction, removeFunction, idx
  return (
      <Badge className='maxHeight' bg={backgroundColor} ref={drop} variant="success" data-testid="lineup">
          <p>{isActive ? 'Release to add player' : 'Drag a player here'}</p>
          <ListGroup variant="flush" style={{ overflow: 'hidden', clear: 'both' }}>
            {lineupCards.map( (player, idx) => <PlayerPlaying key={"playerInLineup" + idx} player={player} setFunction={setFunction} removeFunction={removeFunction} idx={"Sub_" + idx} type={ItemTypes.LINEUP} testid={'lineup'}/>)}
          </ListGroup>
      </Badge>
  )
};

function useDndDrop(accepts, name) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: accepts,
    drop: () => ({ name: name }),
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

  return {drop, backgroundColor, isActive}
}


function useDndDrag(type, item, setFunction, removeFunction, idx){
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
        removeFunction((prev) => {
          console.log('test');
          return update(prev, {[idx]:{$set: {}}});
        });
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

function PlayerPlaying({player, setFunction, removeFunction, idx, type, name}) {
  const {drag, opacity} = useDndDrag(type, player, setFunction, removeFunction, idx);
  const { drop } = useDndDrop([ItemTypes.ROSTER, ItemTypes.SUB], 'lineup');
  let callbackRef = React.useCallback(
    element => {
      mergeRefs([drag, drop], element);
    },
    [drag, drop]
  );
  return (
    <ListGroup.Item ref={callbackRef} style={{ opacity }} data-testid={name}>
      {player.name}
    </ListGroup.Item>
  )
}

function mergeRefs(refs, element) {
  refs.forEach(ref => {
    if (typeof ref === "function") ref(element);
    else if (ref != null) ref.current = element;
  });
}

export {Lineup, PlayerPlaying, useDndDrop};
