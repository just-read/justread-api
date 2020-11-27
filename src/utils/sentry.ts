import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { Application } from 'express';

const initSentryBeforeRoutes = (app: Application): void => {
  Sentry.init({
    dsn: process.env.DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
};

const initSentryAfterRoutes = (app: Application): void => {
  app.use(Sentry.Handlers.errorHandler());
};

export { initSentryBeforeRoutes, initSentryAfterRoutes };
