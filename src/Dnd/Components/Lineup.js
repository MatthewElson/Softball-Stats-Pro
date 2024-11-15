import React, { useCallback } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import ItemTypes from '../Types/NewGameTypes';
import update from 'immutability-helper';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

function Lineup ({ lineupCards, setFunction, removePlayerFromFunctions }) {
  const { drop, backgroundColor, isActive } = useDndDrop([ItemTypes.ROSTER, ItemTypes.SUB], 'lineup','white')
  return (
    <Card id="lineup" className='minHeight100 fillAvailable' ref={drop} variant="success" data-testid="lineup">
      <Badge className='minHeight100 fillAvailable' bg={backgroundColor}>
          <p>{isActive ? 'Release to add player' : 'Drag a player here'}</p>
          <ListGroup variant="flush">
            {lineupCards.map( (player, idx) => <PlayerPlaying key={"playerInLineup" + idx} player={player} setFunction={player.isSub ? setFunction[1] : setFunction[0]} idx={idx} type={ItemTypes.LINEUP} name='lineup' bg='white' removePlayerFromFunctions={removePlayerFromFunctions}/>)}
          </ListGroup>
      </Badge>
    </Card>
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

function useDndDrag(type, item, setFunction, idx, from, removePlayerFromFunctions = null){
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

        if(removePlayerFromFunctions){
          removePlayerFromFunctions.forEach(func => {
            func((prev) => { 
              return update(prev, { 
                $splice: [[idx, 1]]
            })});
          });
        }
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

function PlayerPlaying({player, setFunction, idx, type, name, bg='transparent', removePlayerFromFunctions}) {
  const {drag, opacity} = useDndDrag(type, player, setFunction, idx, name, removePlayerFromFunctions);
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
