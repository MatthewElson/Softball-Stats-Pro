//Monitors and Connectors
import {ItemTypes} from '../Types/NewGameTypes';

export const LineUp = (connect, monitor) => ({
    accept: [ItemTypes.ROSTER, ItemTypes.SUB],
    drop: () => ({ name: 'Dustbin' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    })
});

export const RosterMonitor = (connect, monitor) => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    connectDropTarget: connect.dropTarget()
});
