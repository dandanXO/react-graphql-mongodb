import React, { Component } from 'react'
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
import EventList from '../components/Events/EventLis/EventList'
import Spinner from '../components/Spinner/Spinner'

import AuthContext from '../context/auth-context'

import './Events.css'
class Events extends Component {
  state = {
    createing: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  }

  isActive = true

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

    const event = { title, price, date, description }
    console.log(event)

    let requestBody = {
      query: `
        mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!){
          createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date }){
            _id
            title
            description
            price
            date
          }
        }
      `,
      variables: {
        title,
        description,
        price,
        date
      }
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
      this.setState(prevState => {
        const updateEvents = [...prevState.events]
        updateEvents.push({
          _id: this.context.userId,
          title: result.data.createEvent.title,
          description: result.data.createEvent.description,
          price: result.data.createEvent.price,
          date: result.data.createEvent.date,
          creator: {
            _id: this.context.userId,
          }
        })
        return { events: updateEvents }
      })

    } catch (e) {
      console.log(e)
    }
  }

  modalCancelHandler = () => {
    this.setState({ createing: false, selectedEvent: null })
  }

  async fetchEvent() {
    this.setState({ isLoading: true })
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
      if (this.isActive) {
        const events = result.data.events;
        this.setState({ events: events, isLoading: false })
      }
    } catch (e) {
      if (this.isActive) {
        console.log(e)
        this.setState({ isLoading: false })
      }
    }
  }
  showDetailHandler = eventId => {

    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId)
      console.log(selectedEvent)
      return { selectedEvent: selectedEvent }
    })
  }
  bookEventHandler = async () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null })
      return
    }
    let requestBody = {
      query: `
        mutation bookEvent($id: ID!){
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {id: this.state.selectedEvent._id}
    };

    try {
      const res = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.context.token
        }
      })
      const result = await res.json()

      if (res.status !== 200 && res.status !== 201) {
        console.log(result)
        throw new Error('Failed!')
      }
      console.log(result)
      this.setState({ selectedEvent: null })

    } catch (e) {
      console.log(e)
      this.setState({ isLoading: false })
    }
  }

  componentWillUnmount() {
    this.isActive = false
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.createing || this.state.selectedEvent) && <Backdrop></Backdrop>}
        {this.state.createing &&
          <Modal
            title="Add event!"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText='Confirm'
          >
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

        {this.state.selectedEvent &&
          <Modal
            title={this.state.selectedEvent.title}
            canCancel canConfirm onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? 'Book' : 'Confirm'}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>${this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date * 1).toLocaleDateString()}</h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        }
        {this.context.token && <div className="events-control">
          <p>Share your own Evets!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>Cruuent Event</button>
        </div>}
        {this.state.isLoading ? <Spinner></Spinner> :
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          ></EventList>}

      </React.Fragment >
    )
  }
}

export default Events