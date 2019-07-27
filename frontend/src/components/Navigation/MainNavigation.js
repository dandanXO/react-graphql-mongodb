import React from 'react'
import {NavLink} from 'react-router-dom'

import'./MainNavigation.css'

const MainNavigation = props => {
  return (
    <header className="main-nabigation">
      <div className="main-nabigation_logo">
        <h1>The Navbar</h1>
      </div>
      <div className="main-navigation_items">
        <ul>
          <li>
            <NavLink  to="/auth">Auth</NavLink>
          </li>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default MainNavigation