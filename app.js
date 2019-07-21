const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema');
const graphQLResolvers = require('./graphql/resolvers')

const app = express();

app.use(bodyParser.json());

app.use('/graphql',
    graphqlHttp({
      schema: graphQLSchema,
      rootValue: graphQLResolvers,
      graphiql: true,
    })
);

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphql-react-event-booking-n6ptb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {useNewUrlParser: true})
    .then(() => {
      app.listen(3000);
    }).catch((err) => {
      console.log(err);
    });

