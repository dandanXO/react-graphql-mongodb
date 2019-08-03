import React, { Component } from 'react'
import AuthContext from '../context/auth-context'

import Spinner from '../components/spinner/spinner'
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
  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? <Spinner /> :
          <ul>
            {this.state.bookings.map(booking => {
              return (
                <li key={booking._id}>
                  {booking.event.title} - {'  '}
                  {new Date(booking.createdAt * 1).toLocaleDateString}
                </li>
              )
            })}
          </ul>}
      </React.Fragment>
    )
  }
}

export default Booking