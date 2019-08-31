import React from 'react'
import './BookingsControl.css'

const bookingsControl = props =>{
    return(
        <div className="bookings-control">
        <button className={props.activeType === 'list'? 'active': ''} onClick={props.onChage.bind(this, 'list')}>List</button>
        <button className={props.activeType === 'chart'? 'active': ''} onClick={props.onChage.bind(this, 'chart')}>Chart</button>
      </div>
    )
}

export default bookingsControl