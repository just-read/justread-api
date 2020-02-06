import createApp from './app';

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

createApp().then(app =>
  app.listen(PORT, () =>
    console.log(`JustRead API is running: http://localhost:${PORT}`)
  )
);
