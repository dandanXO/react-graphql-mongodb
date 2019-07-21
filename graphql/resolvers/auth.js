const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
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
};
