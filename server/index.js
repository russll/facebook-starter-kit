import path from 'path';
import express from 'express';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 8080 : process.env.PORT;
const address = process.env.DOCKER_HOST || process.env.APP_IP || 'localhost';
const app = express();

import graphQLHTTP from 'express-graphql';
import { schema } from '../data/schema.js';

app.use('/graphql', graphQLHTTP((request) => ({
  graphiql: isDeveloping,
  pretty: true,
  schema: schema,
})));

app.use(express.static(__dirname + '/build/client'));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'client', 'index.html'));
});

app.listen(port, address, function (err) {
  if (err) {
    // TODO : Add logging.
    return console.error(err);
  } else {
    console.info('Listening on http://%s:%s in %s', address, port, isDeveloping ? 'developer mode' : 'production mode');
  }
});
