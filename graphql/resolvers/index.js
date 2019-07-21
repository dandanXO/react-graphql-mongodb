const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
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
    return {
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event.creator),
    };
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

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5d342838569a7e22082a3329',
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator),
      };
      const creator = await User.findById('5d342838569a7e22082a3329');

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: (args) => {
    return User.findOne({email: args.userInput.email})
        .then((user) => {
          if (user) {
            throw new Error('User exists already. ');
          }
          return bcrypt.hash(args.userInput.password, 12)
              .then((hashPassword) => {
                const user = new User({
                  email: args.userInput.email,
                  password: hashPassword,
                });
                return user.save();
              })
              .then((result) => {
                return {
                  ...result._doc, password: 'can not to see',
                  _id: result.id,
                };
              })
              .catch((err) => {
                throw (err);
              });
        });
  },
  bookEvent: async (args) => {
    const fetchEvent = await Event.findOne({_id: args.eventId});
    const booking = new Booking({
      user: '5d342838569a7e22082a3329',
      event: fetchEvent,
    });
    const result = await booking.save();
    console.log(result);
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(booking._doc.createdAt).toISOString(),
      updatedAt: new Date(booking._doc.updatedAt).toISOString(),
    };
  },
  cancelBooking: async (args)=>{
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: user.bind(this, booking.event._doc.creator),
      };
      await Booking.deleteOne({_id: args.bookingId});
      return event;
    } catch (err) {
      console.log(err);
    }
  },
};
