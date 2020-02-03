import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

const createApp = (): express.Application => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(morgan('combined'));

  app.get('/', function(req, res) {
    res.send({
      success: true,
      message: 'JustRead API'
    });
  });

  return app;
};

const app = createApp();

export default app;
