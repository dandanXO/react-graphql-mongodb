const Event = require('../../models/event');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date')

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    creator: user.bind(this, event.creator),
  };
};
const transformBooking = (booking) =>{
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const events = (eventId) => {
  return Event.find({_id: {$in: eventId}})
      .then((events) => {
        return events.map((event) => {
          return {...event._doc, creator: user.bind(this, event._doc.creator)};
        });
      });
};
const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};
const user = (userId) => {
  return User.findById(userId)
      .then((user) => {
        return {...user._doc,
          password: 'con not see',
          createdEvents: events.bind(this, user._doc.createdEvents)};
      })
      .catch((err) => {
        throw err;
      });
};

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;

exports.transformBooking=transformBooking;
exports.transformEvent=transformEvent;
