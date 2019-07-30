import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'

import AuthContext from '../context/auth-context'

import './Events.css'
class Events extends Component {
  state = {
    createing: false,
    events:[]
  }
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }
  componentDidMount() {
    this.fetchEvent();
  }

  startCreateEventHandler = () => {
    this.setState({ createing: true })
  }
  modalConfirmHandler = async () => {
    this.setState({ createing: false })
    const title = this.titleElRef.current.value;
    const price = parseFloat(this.priceElRef.current.value);
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0) {

    }

    const event = { title, price, date, description }
    console.log(event)

    let requestBody = {
      query: `
        mutation{
          createEvent(eventInput: {title: "${title}", description: "${description}", price:${price}, date:"${date}" }){
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };

    try {
      const token = this.context.token;
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        }
      })
      const result = await res.json()

      if (res.status !== 200 && res.status !== 201) {
        console.log(result)
        throw new Error('Failed!')

      }
      this.fetchEvent()

    } catch (e) {
      console.log(e)
    }
  }

  modalCancelHandler = () => {
    this.setState({ createing: false })
  }

  async fetchEvent() {
    let requestBody = {
      query: `
        query{
          events {
            _id
            title
            description
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };

    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      const result = await res.json()

      if (res.status !== 200 && res.status !== 201) {
        console.log(result)
        throw new Error('Failed!')

      }
      const events = result.data.events;
      this.setState( { events: events })

    } catch (e) {
      console.log(e)
    }
  }
  render() {
    const eventList = this.state.events.map(event=>{
      return (
        <li key={event._id} className="events__list-item">{event.title}</li>
      )
    })
    return (
      <React.Fragment>
        {this.state.createing && <Backdrop></Backdrop>}
        {this.state.createing &&
          <Modal
            title="Add event!"
            canCancel canConfirm onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}>
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="price" id="price" ref={this.priceElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="date" id="date" ref={this.dateElRef}></input>
              </div>
              <div className="form-control">
                <label htmlFor="descritption">Descritption</label>
                <textarea type="descritption" id="descritption" rows="4" ref={this.descriptionElRef}></textarea>
              </div>
            </form>
          </Modal>
        }
        {this.context.token && <div className="events-control">
          <p>Share your own Evets!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>Cruuent Event</button>
        </div>}
        <ul className="events__list">
          {eventList}
        </ul>
      </React.Fragment >
    )
  }
}

export default Events