import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from 'aws-lambda';
import serverless from 'serverless-http';
import app from './app';

let serverlessApp: serverless.Handler;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (!serverlessApp) {
    serverlessApp = serverless(app);
  }
  return serverlessApp(event, context);
};
