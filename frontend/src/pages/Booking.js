import React, {
  Component
} from 'react'
import AuthContext from '../context/auth-context'
import BookingList from '../components/Bookings/BookingList/BookingList'
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart'
import BookingsControl from '../components/Bookings/BookingsControl/BookingsControl'
import Spinner from '../components/Spinner/Spinner'
class Booking extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: 'list'
  }
  componentDidMount() {
    this.fetchBookings()
  }

  static contextType = AuthContext

  async fetchBookings() {
    this.setState({
      isLoading: true
    })
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
              price
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
      this.setState({
        bookings: bookings,
        isLoading: false
      })

    } catch (e) {
      console.log(e)
      this.setState({
        isLoading: false
      })
    }
  }
  deleteBookingHandler = async bookingId => {
    let requestBody = {
      query: `
        mutation cancelBooking( $id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
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
        return {
          bookings: updateBookings,
          isLoading: false
        }
      })

    } catch (e) {
      console.log(e)
      this.setState({
        isLoading: false
      })
    }
  }
  changeOutputTypeHandler = outputType => {
    if (outputType === 'list'){
      this.setState({outputType: 'list'})
    } else {
      this.setState({outputType:'chart'})
    }
  }
  render() {
    console.log(this.state.outputType)
    let content = <Spinner></Spinner>
    if(!this.state.isLoading){
      content = (
        <React.Fragment>
         <BookingsControl activeType={this.state.outputType} onChage={this.changeOutputTypeHandler}></BookingsControl>
          <div>
          {this.state.outputType === 'list' ? <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}></BookingList> :<BookingsChart boookings={this.state.bookings}/>}
          </div>
        </React.Fragment>
      );
    }
    return ( <React.Fragment > {content}  </React.Fragment>)
  }
}

export default Booking