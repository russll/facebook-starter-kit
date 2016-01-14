import path from 'path';
import express from 'express';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 8080 : process.env.PORT;
const address = process.env.DOCKER_HOST || process.env.APP_IP || 'localhost';
const app = express();

import graphQLHTTP from 'express-graphql';
import { schema } from '../data/schema.js';

app.use('/', graphQLHTTP((request) => ({
  graphiql: isDeveloping,
  pretty: true,
  schema: schema,
})));

app.listen(port, address, function (err) {
  if (err) {
    // TODO : Add logging.
    return console.error(err);
  } else {
    console.info('Listening GraphQL on http://%s:%s in %s', address, port, isDeveloping ? 'developer mode' : 'production mode');
  }
});
