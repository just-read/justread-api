import createApp from './app';
import Database from './database';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const database = new Database();
database.getConnection();

createApp().then(app =>
  app.listen(PORT, () => console.log(`JustRead API is running: http://localhost:${PORT}`))
);
