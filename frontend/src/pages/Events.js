import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'

import './Events.css'
class Events extends Component {
  state = {
    createing: false
  }
  startCreateEventHandler = () => {
    this.setState({ createing: true })
  }
  modalConfirmHandler = () =>{
    this.setState({createing: false})
  }
  modalCancelHandler = () =>{
    this.setState({createing: false})
  }
  render() {
    return (
      <React.Fragment>
        {this.state.createing && <Backdrop></Backdrop>}
        {this.state.createing &&
          <Modal title="Add event!" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
            <p>modal context</p>
          </Modal>
        }
        <div className="events-control">
          <p>Share your own Evets!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>Cruuent Event</button>
        </div>
      </React.Fragment >
    )
  }
}

export default Events