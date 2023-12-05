import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faMoneyBillTrendUp, faBuildingColumns, faGear, faEllipsisVertical, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

export function IconMenu(){
    return(<><FontAwesomeIcon icon={faEllipsisVertical} /></>);
}

export function IconCog(){
    return(<><FontAwesomeIcon icon={faGear} /></>);
}

export function IconArrowDown(){
    return(<><FontAwesomeIcon icon={faAngleDown} /></>);
}

export function IconArrowUp(){
    return(<><FontAwesomeIcon icon={faAngleUp} /></>);
}

export function IconBank(){
    return(<><FontAwesomeIcon icon={faBuildingColumns} /></>);
}

export function IconTrade(){
    return(<><FontAwesomeIcon icon={faMoneyBillTrendUp} /></>);
}

export function IconX(){
    return(<><FontAwesomeIcon icon={faXmark} /></>);
}