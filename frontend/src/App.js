import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import AuthPage from './pages/Auth'
import Booking from './pages/Booking'
import Events from './pages/Events'

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/auth" exact></Redirect>
        <Route path="/auth" component={AuthPage}></Route>
        <Route path="/events" component={Events}></Route>
        <Route path="/bookings" component={Booking}></Route>
      </Switch>
    </BrowserRouter>

  );
}

export default App;
