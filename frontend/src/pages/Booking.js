import React, { Component } from 'react'
import AuthContext from '../context/auth-context'

import BookingList from '../components/Bookings/BookingList/BookingList'
import Spinner from '../components/Spinner/Spinner'
class Booking extends Component {
  state = {
    isLoading: false,
    bookings: []
  }
  componentDidMount() {
    this.fetchBookings()
  }

  static contextType = AuthContext

  async fetchBookings() {
    this.setState({ isLoading: true })
    let requestBody = {
      query: `
        query{
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
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
          'Authorization': 'Bearer ' + this.context.token
        }
      })
      const result = await res.json()

      if (res.status !== 200 && res.status !== 201) {
        console.log(result)
        throw new Error('Failed!')

      }
      const bookings = result.data.bookings;
      this.setState({ bookings: bookings, isLoading: false })

    } catch (e) {
      console.log(e)
      this.setState({ isLoading: false })
    }
  }
  deleteBookingHandler = async bookingId => {
    let requestBody = {
      query: `
        mutation{
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
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
          'Authorization': 'Bearer ' + this.context.token
        }
      })
      const result = await res.json()

      if (res.status !== 200 && res.status !== 201) {
        console.log(result)
        throw new Error('Failed!')

      }
      this.setState(prevState => {
        const updateBookings = prevState.bookings.filter(booking => {
          return booking._id !== bookingId
        })
        return { bookings: updateBookings, isLoading: false}
      })

    } catch (e) {
      console.log(e)
      this.setState({ isLoading: false })
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner /> :
          <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler} />
        }
      </React.Fragment>
    )
  }
}

export default Booking