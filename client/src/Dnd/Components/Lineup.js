import React, { useCallback, memo } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import ItemTypes from '../Types/NewGameTypes';
import update from 'immutability-helper';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

function Lineup ({ lineupCards, setFunction, removeFunction }) {
  const { drop, backgroundColor, isActive } = useDndDrop([ItemTypes.ROSTER, ItemTypes.SUB], 'lineup','white')
  // player, setFunction, removeFunction, idx
  return (
      <Badge className='maxHeight' bg={backgroundColor} ref={drop} variant="success" data-testid="lineup">
          <p>{isActive ? 'Release to add player' : 'Drag a player here'}</p>
          <ListGroup variant="flush" style={{ overflow: 'hidden', clear: 'both' }}>
            {lineupCards.map( (player, idx) => <PlayerPlaying key={"playerInLineup" + idx} player={player} setFunction={player.isSub ? setFunction[1] : setFunction[0]} removeFunction={removeFunction} idx={idx} type={ItemTypes.LINEUP} name='lineup' bg='white'/>)}
          </ListGroup>
      </Badge>
  )
};

function useDndDrop(accepts, name, ...backgroundColors) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: accepts,
    drop: () => ({ name: name }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    })
  }));

  const isActive = canDrop && isOver;
  const {bgDefault = (accepts === 'lineup' ? 'white' : 'secondary'), bgOnAcceptable = 'warning', bgOnHover = 'success'} = backgroundColors;
  let backgroundColor = bgDefault;
  if (isActive)
    backgroundColor = bgOnAcceptable;
  else if (canDrop)
    backgroundColor = bgOnHover;

  return {drop, backgroundColor, isActive}
}


function useDndDrag(type, item, setFunction, removeFunction, idx, from){
  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: item,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        console.log(`You dropped ${item.name} into ${dropResult.name}!`);
        console.log('item :', item);
        // setLineupCards([...lineupCards, item]);
        setFunction((prev) => update(prev, {$push:[{...item, from: from}]}));
        // setFunction((prev) => prev.push(item));
        //removeFunction((prev) => update(prev, {[idx]:{$set: {}}}));
        removeFunction((prev) => update(prev, {$unset: [idx]}));
        // removeFunction((prev) => {
        //   console.log('prev :', prev);
        //   return prev.splice(idx, 1);
        // });
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

function PlayerPlaying({player, setFunction, removeFunction, idx, type, name, bg='transparent'}) {
  const {drag, opacity} = useDndDrag(type, player, setFunction, removeFunction, idx, name);
  const { drop } = useDndDrop([ItemTypes.LINEUP], 'lineup');
  let callbackRef = useCallback(
    element => {
      mergeRefs([drag, drop], element);
    },
    [drag, drop]
  );
  return (
    <ListGroup.Item ref={callbackRef} style={{ opacity, backgroundColor:{bg} }} data-testid={name}>
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
