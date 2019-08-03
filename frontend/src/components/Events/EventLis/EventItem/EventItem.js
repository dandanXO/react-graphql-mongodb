import React from 'react';
import './EventItem.css';

const eventItem = props => {
  return (
    <li key={props._id} className="events__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>${props.price} - {new Date(props.date *1).toLocaleDateString()}</h2>
      </div>
      <div>
        {props.userId === props.creatorId ? <p>Your the owner of this event.</p> : 
        <button className="btn" onClick={props.onDetail.bind(this,props.eventId)}>View Details</button>
        }
      </div>
    </li>
  )
}

export default eventItem;
