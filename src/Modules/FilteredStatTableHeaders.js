import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

/**
 * Filters the table headers
 * @param {array} statNames An array of objects with properties including table, fullName, id, and stat
 * @param {number} tableNumber The number of the table the item is associated with
 * @returns Table headers filtered by the table number with tool tips on hover
 */
const FilteredHeaders = ({statNames, tableNumber}) => {
    let filteredStats = statNames;
    
    if(tableNumber) 
        filteredStats = statNames.filter(v => v.table === 0 || v.table === tableNumber);
 
    return filteredStats.map(stat => (
        <OverlayTrigger
            key= {stat.id + "Tooltip"}
            placement="top"
            trigger={"hover"}
            overlay= {
                <Tooltip id={`tooltip-above`}>
                    {stat.fullName}
                </Tooltip>
            }
        >
            <th><span className='underlineTableHeader'>{stat.stat}</span></th> 
        </OverlayTrigger> 
    ))
}

export default FilteredHeaders;
