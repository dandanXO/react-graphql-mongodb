import React from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../../context/auth-context'

import './MainNavigation.css'

const MainNavigation = props => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className="main-nabigation">
          <div className="main-nabigation_logo">
            <h1>The Navbar</h1>
          </div>
          <div className="main-navigation_items">
            <ul>
              {!context.token && <li>
                <NavLink to="/auth">Auth</NavLink>
              </li>}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>}
            </ul>
          </div>
        </header>
      )
    }}
  </AuthContext.Consumer>
)

export default MainNavigation